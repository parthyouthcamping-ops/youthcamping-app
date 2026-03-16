import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getTripAssistantResponse } from "../services/ai.service";

export const chatWithAssistant = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { messages, tripId } = req.body;
    
    // Injecting trip data is handled cleanly within the service. 
    // We just pass it the requested tripId and raw messages from context.
    const reply = await getTripAssistantResponse(tripId, messages);

    return res.json({ answer: reply });
  } catch(err: any) {
    console.error("Assistant chat error:", err);
    return res.status(500).json({ error: "Failed to communicate with YC Assistant." });
  }
};
