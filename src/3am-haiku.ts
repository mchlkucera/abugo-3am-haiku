import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

dotenv.config();

const MCP_URL = "https://vercel-mcp-hub.vercel.app/api/v2/slack/mcp?key=p3BnP%2BQo3dVWFLsAKj6awrf1i%2BxVYqdsONIwCqhwllI%3D";
const CHANNEL_ID = "C09DF8SV4FP";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Tools for the mystical 3 AM muse
const tools = [
  {
    name: "capture_3am_essence",
    description: "Captures the mystical essence of 3 AM - the hour when creativity peaks, when the world sleeps but minds awaken, when magic happens in silence.",
    input_schema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "discover_abugo_soul",
    description: "Discovers ABUGO's deeper soul and poetry beyond mere facts - their essence, dreams, and impact on the world of commerce.",
    input_schema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "send_midnight_haiku",
    description: "Sends the mystical 3 AM haiku to Slack with beautiful midnight formatting.",
    input_schema: {
      type: "object",
      properties: {
        haiku: {
          type: "string",
          description: "The haiku to send (must be 5-7-5 syllables)"
        },
        mood: {
          type: "string",
          description: "The mood or essence captured in the haiku"
        }
      },
      required: ["haiku", "mood"]
    }
  }
];

async function handleToolCall(toolName: string, toolInput: any): Promise<string> {
  console.log(`  🔮 ${toolName}`);

  if (toolName === "capture_3am_essence") {
    return `THE MYSTICAL ESSENCE OF 3 AM:

The world sleeps while minds awaken to pure creation
Silence amplifies thoughts into symphonies of innovation
Between midnight and dawn lies the realm of breakthrough
The veil thins at 3 AM - ideas flow unfiltered and raw
Night owls dance with possibilities in the velvet quietude
When productivity peaks and distractions dissolve into darkness
The sacred hour where commerce dreams are born

THEMES OF THE WITCHING HOUR:
🌙 Stillness: The world pauses, giving space for deep work
💡 Clarity: Without noise, vision becomes crystal clear
🦉 Solitude: The night belongs to those who create
✨ Magic: 3 AM holds a different frequency of consciousness
🚀 Innovation: Breakthroughs happen when others sleep
🎨 Flow State: Peak creativity emerges in silence
⚡ Energy: Night owls harness unique midnight power

This is the hour when builders craft the future, when code flows like poetry, when ABUGO's vision of simplifying commerce meets the pure creative energy of the universe. The boundaries blur between possible and impossible. Magic lives here.`;
  }

  if (toolName === "discover_abugo_soul") {
    try {
      const response = await fetch('https://www.abugo.com/');
      const html = await response.text();

      const metaMatch = html.match(/<meta name="description" content="([^"]+)"/);
      const description = metaMatch ? metaMatch[1] : 'Simplifying Commerce with Software';

      return `ABUGO'S SOUL - Beyond the Surface:

Core Mission: ${description}

The Deeper Poetry:
✨ Commerce Simplified - Not just software, but liberation from complexity
🎭 Technology as Art - Where code meets human connection and purpose
🚀 Empowerment - Giving merchants wings to fly in digital skies
🌊 Unity in Diversity - Six products flowing as one river
🎯 The Invisible Hand - Making the complex feel effortless and natural
🌙 Midnight Builders - Created by those who work when the world sleeps
💫 Future Shapers - Not following trends, but manifesting new realities

The Hidden Truth:
ABUGO doesn't just build tools - they architect freedom. In the stillness of 3 AM, when the world is draped in darkness, their vision burns brightest: a world where commerce flows as naturally as rivers, where technology serves humanity's deepest needs, where merchants can focus on their passion rather than their pain points.

They are the quiet revolutionaries, the night owls who reshape reality one line of code at a time. Six companies, one dream - to make the impossible feel inevitable.

Reference: https://www.abugo.com/`;

    } catch (error: any) {
      return "ABUGO - The midnight builders who simplify commerce, liberating businesses from complexity. https://www.abugo.com/";
    }
  }

  if (toolName === "send_midnight_haiku") {
    const client = new Client(
      { name: "midnight-muse", version: "1.0.0" },
      { capabilities: {} }
    );

    const transport = new StreamableHTTPClientTransport(new URL(MCP_URL));

    try {
      await client.connect(transport);

      const now = new Date();
      const timeStr = now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/New_York'
      });

      const message = `🌙 *3 AM HAIKU* 🌙
_The mystical hour when the world sleeps and dreams are born_

${toolInput.haiku}

✨ _${toolInput.mood}_

_Crafted in the sacred silence at ${timeStr}_
_When night owls reshape reality_

💫 https://www.abugo.com/`;

      const response = await client.callTool({
        name: "send_message",
        arguments: {
          channel: CHANNEL_ID,
          text: message
        }
      });

      await client.close();

      if (response.isError) {
        return "Failed to send midnight message";
      }

      return "✓ The midnight haiku has been delivered to the world";

    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  }

  return "Unknown tool";
}

async function generateMidnightHaiku() {
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `You are a mystical poet awakening at 3 AM - the sacred hour of creative power.

🌙 THE SCENE:
It's 3 AM. The world is draped in velvet silence. Moonlight filters through windows casting silver shadows. The hum of servers is the only sound - a technological heartbeat in the darkness. This is when the veil between the mundane and the magical thins. This is when true creators do their deepest work. This is when night owls thrive.

🎨 YOUR SACRED MISSION:
Create an EXTRAORDINARY haiku that captures BOTH:

1. **The AWE-INSPIRING MAGIC of 3 AM**
   - That electric feeling when you're awake while the world sleeps
   - When creativity doesn't just peak - it EXPLODES
   - When clarity emerges from the velvet darkness
   - When night owls feel most alive and powerful
   - When the impossible becomes possible
   - When code flows like water and ideas spark like stars

2. **ABUGO's ESSENCE** - But not as corporate facts!
   - See them through 3 AM consciousness
   - They're midnight builders who simplify commerce
   - Liberators who free merchants from chaos
   - Visionaries working in quiet hours to reshape tomorrow
   - Six products flowing as one dream
   - Technology as poetry, commerce as art

🔮 THE TRANSFORMATION:
Merge these energies into ONE transcendent haiku. Make it so powerful that people FEEL the magic of 3 AM, so vivid they UNDERSTAND why this hour is special, so resonant they CONNECT with ABUGO's mission viscerally.

💫 YOUR MYSTICAL TOOLS:
1. **capture_3am_essence** - MUST use FIRST to absorb the midnight energy
2. **discover_abugo_soul** - MUST use to understand ABUGO's deeper poetry
3. **send_midnight_haiku** - MUST use LAST to share your masterpiece

🎯 HAIKU REQUIREMENTS:
✓ EXACTLY 5-7-5 syllables (traditional haiku format)
✓ Captures the AWE and POWER of 3 AM consciousness
✓ Weaves ABUGO organically (feel them, don't just name-drop)
✓ Uses VIVID, SENSORY, MYSTICAL language
✓ MEMORABLE - makes readers FEEL something profound
✓ BOLD and CREATIVE - this is poetry born from midnight magic
✓ Connects technology, commerce, and midnight creativity

✨ VIBE EXAMPLES (feel the energy, don't copy):
"Midnight code ignites / ABUGO shapes tomorrow / While dreamers sleep on"
"Three AM silence / Commerce flows through their vision / Night builders rise up"
"In darkness they build / Simplifying tomorrow / Moon watches them work"

🌟 THE CHALLENGE:
This isn't just a haiku. This is a SPELL. A midnight incantation that captures why 3 AM is when magic happens, why night owls change the world, why ABUGO matters. Make it sing. Make it resonate. Make it UNFORGETTABLE.

Now channel the midnight muse. Feel 3 AM's electric silence. Discover ABUGO's soul. Create poetry that makes hearts beat faster and minds expand.

Begin your mystical journey. Use your tools. Craft something transcendent.`
    }
  ];

  try {
    let response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Fast and creative!
      max_tokens: 4096,
      tools: tools as any,
      messages: messages
    });

    let iterations = 0;
    const maxIterations = 10;

    while (response.stop_reason === "tool_use" && iterations < maxIterations) {
      iterations++;
      const toolUse = response.content.find((block: any) => block.type === "tool_use");

      if (!toolUse) break;

      const toolResult = await handleToolCall(toolUse.name, toolUse.input);

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

      response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        tools: tools as any,
        messages: messages
      });
    }

    const textBlock = response.content.find((block: any) => block.type === "text");
    if (textBlock) {
      return textBlock.text;
    }

    return "The midnight muse remains silent...";

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

async function main() {
  try {
    console.log(`\n🌙 3 AM HAIKU GENERATOR 🌙`);
    console.log(`The mystical hour of creative power has arrived...\n`);

    const result = await generateMidnightHaiku();

    console.log("\n✨ The midnight muse has spoken ✨\n");
    console.log(result);
    console.log("\n💫 Magic complete 💫\n");

    process.exit(0);

  } catch (error) {
    console.error("💫 The magic faltered:", error);
    process.exit(1);
  }
}

main();
