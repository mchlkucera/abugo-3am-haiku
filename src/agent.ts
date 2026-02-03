import Anthropic from "@anthropic-ai/sdk";
import { getMockCalendarEvents, CalendarEvent } from "./mock-calendar.js";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Define the calendar tool
const calendarTool = {
  name: "get_calendar_events",
  description: "Retrieves calendar events for a specific date. Returns a list of events with their details including title, time, location, and description.",
  input_schema: {
    type: "object",
    properties: {
      date: {
        type: "string",
        description: "The date to get events for in ISO format (YYYY-MM-DD). Defaults to today if not provided."
      }
    }
  }
};

function formatCalendarEvents(events: CalendarEvent[]): string {
  if (events.length === 0) {
    return "No events scheduled for this day.";
  }

  let result = `You have ${events.length} event${events.length > 1 ? 's' : ''} scheduled:\n\n`;

  events.forEach((event, index) => {
    result += `${index + 1}. ${event.title}\n`;
    result += `   Time: ${event.startTime} - ${event.endTime}\n`;
    if (event.location) {
      result += `   Location: ${event.location}\n`;
    }
    if (event.description) {
      result += `   Description: ${event.description}\n`;
    }
    result += '\n';
  });

  return result;
}

function handleToolCall(toolName: string, toolInput: any): string {
  if (toolName === "get_calendar_events") {
    const dateStr = toolInput.date || new Date().toISOString().split('T')[0];
    const date = new Date(dateStr);
    const events = getMockCalendarEvents(date);
    return formatCalendarEvents(events);
  }
  return "Unknown tool";
}

export async function runCalendarAgent(): Promise<string> {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `What are my calendar events today (${today})?`
    }
  ];

  let finalResponse = "";

  try {
    // Initial request with tool
    let response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      tools: [calendarTool as any],
      messages: messages
    });

    // Process tool calls
    while (response.stop_reason === "tool_use") {
      const toolUse = response.content.find((block: any) => block.type === "tool_use");

      if (!toolUse) break;

      const toolResult = handleToolCall(toolUse.name, toolUse.input);

      // Add assistant response and tool result to messages
      messages.push({
        role: "assistant",
        content: response.content
      });

      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: toolResult
          }
        ]
      });

      // Continue conversation
      response = await client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        tools: [calendarTool as any],
        messages: messages
      });
    }

    // Extract final text response
    const textBlock = response.content.find((block: any) => block.type === "text");
    if (textBlock) {
      finalResponse = textBlock.text;
    }

    // Write to log file
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const logsDir = path.join(process.cwd(), 'logs');

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFile = path.join(logsDir, `calendar-${timestamp}.log`);
    const logContent = `Calendar Events - ${today}\n${'='.repeat(50)}\n\n${finalResponse}\n`;

    fs.writeFileSync(logFile, logContent);
    console.log(`✓ Log written to: ${logFile}`);

    return finalResponse;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error running calendar agent:", errorMsg);
    throw error;
  }
}
