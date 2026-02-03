import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import dotenv from "dotenv";
import * as fs from "fs/promises";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

dotenv.config();

const execAsync = promisify(exec);
const MCP_URL = "https://vercel-mcp-hub.vercel.app/api/v2/slack/mcp?key=p3BnP%2BQo3dVWFLsAKj6awrf1i%2BxVYqdsONIwCqhwllI%3D";
const CHANNEL_ID = "C09DF8SV4FP";
const ANALYSIS_DIR = path.join(process.cwd(), "analysis");

// Ensure analysis directory exists
await fs.mkdir(ANALYSIS_DIR, { recursive: true });

// Create custom tools using the real Agent SDK
const customTools = createSdkMcpServer({
  name: "abugo-research-tools",
  version: "1.0.0",
  tools: [
    tool(
      "web_search",
      "Searches the web for information about any topic. Returns search results with URLs and content.",
      {
        query: z.string().describe("The search query to look up")
      },
      async (args) => {
        console.log(`[Agent SDK] Web search: ${args.query}`);

        try {
          // DuckDuckGo API
          const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(args.query)}&format=json`;
          const response = await fetch(searchUrl);
          const data = await response.json();

          // Fetch ABUGO website
          const abugoResponse = await fetch('https://www.abugo.com/');
          const abugoHtml = await abugoResponse.text();

          const metaMatch = abugoHtml.match(/<meta name="description" content="([^"]+)"/);
          const description = metaMatch ? metaMatch[1] : '';

          const titleMatch = abugoHtml.match(/<title>([^<]+)<\/title>/);
          const title = titleMatch ? titleMatch[1] : '';

          let result = `Web Search Results for "${args.query}":\n\n`;
          result += `ABUGO Official Website:\n`;
          result += `Title: ${title}\n`;
          result += `URL: https://www.abugo.com/\n`;
          result += `Description: ${description}\n\n`;

          if (data.AbstractText) {
            result += `Additional Info:\n${data.AbstractText}\n\n`;
          }

          result += `Reference URLs:\n`;
          result += `- https://www.abugo.com/\n`;
          result += `- https://www.abugo.com/news/introducing-abugo-make-commerce-simple\n`;
          result += `- https://www.crunchbase.com/organization/abugo\n`;
          result += `- https://www.linkedin.com/company/abugo\n`;

          return { content: [{ type: "text", text: result }] };

        } catch (error: any) {
          return { content: [{ type: "text", text: `Search error: ${error.message}` }] };
        }
      }
    ),

    tool(
      "execute_python",
      "Executes Python code for data analysis, calculations, and insights generation.",
      {
        code: z.string().describe("The Python code to execute"),
        description: z.string().optional().describe("Brief description of what this code does")
      },
      async (args) => {
        console.log(`[Agent SDK] Python: ${args.description || 'Executing code'}`);

        try {
          const tempFile = path.join(ANALYSIS_DIR, `temp_${Date.now()}.py`);
          await fs.writeFile(tempFile, args.code);

          const { stdout, stderr } = await execAsync(`python3 ${tempFile}`);
          await fs.unlink(tempFile);

          const result = stdout || stderr || "Code executed successfully";
          return { content: [{ type: "text", text: `Python result:\n${result}` }] };

        } catch (error: any) {
          return { content: [{ type: "text", text: `Python error: ${error.message}` }] };
        }
      }
    ),

    tool(
      "write_analysis",
      "Writes analysis results to a file for future reference.",
      {
        filename: z.string().describe("Name of the file to write"),
        content: z.string().describe("Content to write to the file")
      },
      async (args) => {
        console.log(`[Agent SDK] Writing: ${args.filename}`);

        try {
          const filepath = path.join(ANALYSIS_DIR, args.filename);
          await fs.writeFile(filepath, args.content, 'utf-8');
          return { content: [{ type: "text", text: `Successfully wrote to ${args.filename}` }] };
        } catch (error: any) {
          return { content: [{ type: "text", text: `Write error: ${error.message}` }] };
        }
      }
    ),

    tool(
      "send_slack_message",
      "Sends a message to Slack channel via MCP.",
      {
        text: z.string().describe("The message text to send")
      },
      async (args) => {
        console.log(`[Agent SDK] Sending to Slack`);

        const client = new Client(
          { name: "agent-sdk-slack", version: "1.0.0" },
          { capabilities: {} }
        );

        const transport = new StreamableHTTPClientTransport(new URL(MCP_URL));

        try {
          await client.connect(transport);

          const response = await client.callTool({
            name: "send_message",
            arguments: {
              channel: CHANNEL_ID,
              text: args.text
            }
          });

          await client.close();

          if (response.isError) {
            return { content: [{ type: "text", text: "Failed to send Slack message" }] };
          }

          return { content: [{ type: "text", text: "✓ Slack message sent successfully" }] };

        } catch (error: any) {
          return { content: [{ type: "text", text: `Slack error: ${error.message}` }] };
        }
      }
    )
  ]
});

async function main() {
  try {
    const currentTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/New_York'
    });

    console.log(`\n🤖 Claude Agent SDK - Running at ${currentTime}\n`);

    const prompt = `You are an analytical and creative AI agent. Your task:

1. Use web_search to learn about ABUGO company
2. Use execute_python to analyze interesting insights (count products, analyze focus areas, etc.)
3. Use write_analysis to save your findings to a file named "abugo-analysis-sdk-${Date.now()}.txt"
4. Create a beautiful haiku (5-7-5 syllable format) that captures ABUGO's essence
5. Use send_slack_message to post your haiku with a note "Generated by Claude Agent SDK" and include the reference URLs you discovered

Be creative and autonomous! Format your Slack message nicely with the haiku and sources.`;

    let finalResult = "";
    let toolsUsed: string[] = [];

    // Use the real Agent SDK query function!
    for await (const message of query({
      prompt,
      options: {
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: "claude-3-haiku-20240307",
        mcpServers: {
          "abugo-research-tools": customTools
        },
        allowedTools: [
          "mcp__abugo-research-tools__web_search",
          "mcp__abugo-research-tools__execute_python",
          "mcp__abugo-research-tools__write_analysis",
          "mcp__abugo-research-tools__send_slack_message"
        ],
        maxTurns: 15
      }
    })) {
      if (message.type === "tool") {
        const toolName = message.tool.replace("mcp__abugo-research-tools__", "");
        if (!toolsUsed.includes(toolName)) {
          toolsUsed.push(toolName);
        }
        console.log(`  ✓ Used tool: ${toolName}`);
      }

      if (message.type === "result") {
        if (message.subtype === "success") {
          finalResult = message.result;
          console.log("\n✅ Agent completed successfully!");
        } else if (message.subtype === "error") {
          console.error("\n❌ Agent error:", message.error);
        }
      }
    }

    console.log("\n📊 Tools used:", toolsUsed.join(", "));
    console.log("\n🎉 Done!\n");

    process.exit(0);

  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
