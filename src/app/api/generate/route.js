import { GoogleGenerativeAI } from "@google/generative-ai";
export const runtime = "edge";

export async function POST(req) {
  const { body } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const websiteInfo = `You are a helpful AI assistant.`;

  const result = await model.generateContentStream(
    `${websiteInfo}\nUser: ${body}`
  );

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}
