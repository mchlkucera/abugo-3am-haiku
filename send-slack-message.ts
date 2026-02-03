import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MCP_URL = "https://vercel-mcp-hub.vercel.app/api/v2/slack/mcp?key=p3BnP%2BQo3dVWFLsAKj6awrf1i%2BxVYqdsONIwCqhwllI%3D";

async function sendSlackMessage(channel: string, text: string) {
  // Create MCP client
  const client = new Client(
    { name: "slack-message-sender", version: "1.0.0" },
    { capabilities: {} }
  );

  // Create HTTP transport
  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL));

  try {
    console.log("Connecting to Slack MCP...");
    await client.connect(transport);

    console.log("Listing available tools...");
    const tools = await client.listTools();
    console.log("Available tools:", tools.tools.map(t => t.name).join(", "));

    console.log(`\nSending message to channel ${channel}...`);
    const response = await client.callTool({
      name: "send_message",
      arguments: {
        channel: channel,
        text: text
      }
    });

    if (response.isError) {
      const content = response.content as Array<{ type: string; text?: string }>;
      const errorText = content.find(c => c.type === "text")?.text || "Unknown error";
      throw new Error(`Failed to send message: ${errorText}`);
    }

    const content = response.content as Array<{ type: string; text?: string }>;
    const resultText = content.find(c => c.type === "text")?.text;

    console.log("\n✅ Message sent successfully!");
    console.log("Response:", resultText);

    return resultText;

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await client.close();
  }
}

async function main() {
  try {
    await sendSlackMessage("C09DF8SV4FP", "Hello from MCP");
  } catch (error) {
    console.error("Failed:", error);
    process.exit(1);
  }
}

main();
