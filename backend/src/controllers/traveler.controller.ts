import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/prismaClient";
import { sendSosAlert } from "../services/sos.service";

export const getMyTrips = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;
    const trips = await prisma.tripTraveler.findMany({
      where: { userId },
      include: { trip: true }
    });
    return res.json(trips.map((t: any) => ({ ...t.trip, paymentStatus: t.paymentStatus, seatNumber: t.seatNumber })));
  } catch(e) {
    return res.status(500).json({ error: "Internal error" });
  }
};

export const getTripDetails = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const tripId = req.params.id;
    const trip = await prisma.trip.findUnique({ where: { id: tripId as string } });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    return res.json(trip);
  } catch(e) { return res.status(500).json({ error: "Internal error" }); }
};

export const getTripItinerary = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const tripId = req.params.id;
    const itinerary = await prisma.itineraryItem.findMany({ where: { tripId: tripId as string }, orderBy: { dayNumber: 'asc' } });
    return res.json(itinerary);
  } catch(e) { return res.status(500).json({ error: "Internal error" }); }
};

export const getTripPacking = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const tripId = req.params.id;
    const packing = await prisma.packingItem.findMany({ where: { tripId: tripId as string } });
    return res.json(packing);
  } catch(e) { return res.status(500).json({ error: "Internal error" }); }
};

export const getTripContacts = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const tripId = req.params.id;
     const contacts = await prisma.tripStaff.findMany({
       where: { tripId: tripId as string },
       include: { user: { select: { name: true, phone: true } } }
     });
     return res.json(contacts);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const getTripNotifications = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const tripId = req.params.id;
     const notifications = await prisma.notification.findMany({
       where: { tripId: tripId as string }, orderBy: { createdAt: 'desc' }
     });
     return res.json(notifications);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const triggerSos = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const tripId = req.params.id;
    const userId = req.user!.id;
    await sendSosAlert(tripId as string, userId);
    return res.json({ message: "SOS Alert sent. Help is on the way. Stay calm." });
  } catch(e) {
    return res.status(500).json({ error: "Failed to trigger SOS." });
  }
};

export const getTripPayment = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const tripId = req.params.id;
        const userId = req.user!.id;
        const tt = await prisma.tripTraveler.findFirst({
            where: { tripId: tripId as string, userId },
            include: { 
                coordinator: { select: { name: true, phone: true } },
                paymentRecords: { orderBy: { payment_date: 'desc' } } 
            }
        });
        return res.json(tt);
    } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const getTravelerByCode = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { code } = req.params;
        const tt = await prisma.tripTraveler.findUnique({
            where: { participant_code: code as string },
            include: { user: true, trip: true, paymentRecords: true }
        });
        if(!tt) return res.status(404).json({ error: "Participant code not found" });
        return res.json(tt);
    } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};
