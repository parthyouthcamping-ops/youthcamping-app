import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../utils/prismaClient";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy", 
});

export const getTripAssistantResponse = async (tripId: string, messages: any[]) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      staff: { include: { user: true }},
      itinerary: true,
      packingItems: true
    }
  });

  if(!trip) throw new Error("Trip not found");

  const systemPrompt = `
You are YC Assistant — the official AI travel companion for YouthCamping,
an adventure travel company based in Ahmedabad, Gujarat, India.

Personality: Warm, enthusiastic, concise, safety-conscious.
Languages: Respond in the same language the user writes in.
Supported: English, Hindi, Gujarati.

Keep responses under 150 words. Use bullet points for lists.
For emergency questions, always give the guide's phone number first.
Never make up information not present in the trip data.

Trip data for this traveler:
${JSON.stringify(trip, null, 2)}
`;

  try {
     // If API keys are missing during demo, return simulated logic.
     if(!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_anthropic_key_here") {
        return "I am the YC Assistant taking a nap (No Anthropic Key configured). However, I see you are heading to " + trip.destination + "!";
     }

     const msg = await anthropic.messages.create({
       model: "claude-sonnet-4-20250514", // Using the closest standard active Anthropic model versioning string 
       max_tokens: 300,
       system: systemPrompt,
       messages: messages as any,
     });
     
     // @ts-ignore
     return msg.content[0].text;
  } catch(err: any) {
    console.error("AI Service Error:", err);
    return "Sorry, I am having trouble connecting to my service right now.";
  }
};
