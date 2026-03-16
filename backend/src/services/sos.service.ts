import twilio from "twilio";
import { prisma } from "../utils/prismaClient";

export const sendSosAlert = async (tripId: string, travelerUserId: string) => {
  const traveler = await prisma.user.findUnique({ where: { id: travelerUserId }});
  const trip = await prisma.trip.findUnique({ 
     where: { id: tripId },
     include: { staff: { include: { user: true } } }
  });

  if(!traveler || !trip) throw new Error("Invalid Trip or Traveler Data");

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  const staffNumbers = (trip.staff as any[]).map(s => s.user.phone).filter(Boolean);

  const messageText = `🚨 SOS ALERT: ${traveler.name} (${traveler.phone}) triggered an emergency alert for trip: ${trip.title}. Please contact immediately.`;

  console.log(`[SOS TRIGGERED] Would send to: ${staffNumbers.join(", ")} | Message: ${messageText}`);

  if(accountSid && authToken && twilioNumber && accountSid !== "your_twilio_sid") {
    const client = twilio(accountSid, authToken);
    for(const phone of staffNumbers) {
       try {
         await client.messages.create({
           body: messageText,
           from: twilioNumber,
           to: phone as string
         });
       } catch(e) {
         console.error("Twilio send error", e);
       }
    }
  }
};
