import dotenv from "dotenv";
import { runCalendarAgent } from "./agent.js";

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log("Starting calendar agent...");
    console.log(`Time: ${new Date().toLocaleString()}`);

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    const result = await runCalendarAgent();
    console.log("\nCalendar Events:");
    console.log("=".repeat(50));
    console.log(result);

    process.exit(0);
  } catch (error) {
    console.error("Fatal error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
