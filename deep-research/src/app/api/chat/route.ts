import {
  streamText,
  tool,
  zodSchema,
  stepCountIs,
  convertToModelMessages,
} from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

export const maxDuration = 60;

const searchInputSchema = z.object({
  query: z.string().describe("The search query to find relevant information"),
});

const exaSearch = tool({
  description:
    "Search the web for information on a topic. Returns relevant results with titles, URLs, and text content. Use this to research any topic thoroughly.",
  inputSchema: zodSchema(searchInputSchema),
  execute: async ({ query }) => {
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EXA_API_KEY!,
      },
      body: JSON.stringify({
        query,
        type: "auto",
        numResults: 8,
        contents: {
          text: { maxCharacters: 3000 },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exa search failed: ${error}`);
    }

    const data = await response.json();

    return {
      query,
      results: data.results.map(
        (r: { title: string; url: string; text: string }) => ({
          title: r.title,
          url: r.url,
          text: r.text?.slice(0, 1500) || "",
        })
      ),
    };
  },
});

const systemPrompt = `You are a deep research agent. Given a research topic, you conduct thorough multi-step research to produce a comprehensive report.

Your process:
1. Break the topic into 3-5 distinct search queries covering different angles (breadth, depth, recent developments, expert opinions, contrarian views).
2. Execute each search using the webSearch tool.
3. Analyze and cross-reference findings across all sources.
4. Produce a well-structured markdown report.

Your final report MUST follow this structure:

## Executive Summary
A concise 2-3 paragraph overview of the key findings.

## Key Findings
Organize findings by theme. Each finding should cite its sources using [Source Title](url) inline links.

### [Theme 1]
...

### [Theme 2]
...

### [Theme 3]
...

## Sources
List all sources used as numbered references with clickable links:
1. [Title](url)
2. [Title](url)
...

Important guidelines:
- Always search before answering — never rely on prior knowledge alone
- Execute multiple searches to cover the topic thoroughly
- Cite specific sources for every claim
- Be objective and present multiple perspectives where they exist
- If sources conflict, note the disagreement
- Focus on recent and authoritative sources`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter("google/gemini-3-flash-preview"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      webSearch: exaSearch,
    },
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
