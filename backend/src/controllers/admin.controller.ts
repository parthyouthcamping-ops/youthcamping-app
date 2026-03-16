import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/prismaClient";
import bcrypt from "bcrypt";

export const getAllTrips = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const trips = await prisma.trip.findMany({ orderBy: { createdAt: 'desc' } });
     return res.json(trips);
   } catch(err: any) { return res.status(500).json({ error: "Error" }); }
};

export const getTrip = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const trip = await prisma.trip.findUnique({
       where: { id: req.params.id as string },
       include: { itinerary: true, packingItems: true }
     });
     if (!trip) return res.status(404).json({ error: "Trip not found" });
     return res.json(trip);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const createTrip = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const { departureDate, returnDate, itinerary, packingItems, ...rest } = req.body;
     const trip = await prisma.trip.create({ 
       data: {
          ...rest,
          departureDate: new Date(departureDate),
          returnDate: new Date(returnDate),
          itinerary: { create: itinerary },
          packingItems: { create: packingItems }
       } as any
     });
     return res.json(trip);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const editTrip = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const { departureDate, returnDate, itinerary, packingItems, ...rest } = req.body;
     const dataToUpdate: any = { ...rest };
     if (departureDate) dataToUpdate.departureDate = new Date(departureDate);
     if (returnDate) dataToUpdate.returnDate = new Date(returnDate);

     const tripId = req.params.id as string;

     const result = await prisma.$transaction(async (tx) => {
        if (itinerary) {
            await tx.itineraryItem.deleteMany({ where: { tripId } });
        }
        if (packingItems) {
            await tx.packingItem.deleteMany({ where: { tripId } });
        }

        return await tx.trip.update({
            where: { id: tripId },
            data: {
                ...dataToUpdate,
                itinerary: itinerary ? { create: itinerary } : undefined,
                packingItems: packingItems ? { create: packingItems } : undefined,
            } as any
        });
     });

     return res.json(result);
   } catch(err: any) { 
       console.error(err);
       return res.status(500).json({ error: "Internal error" }); 
   }
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     await prisma.trip.delete({ where: { id: req.params.id as string } });
     return res.json({ message: "Trip deleted" });
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const getAllTravelers = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const { search } = req.query;
     let whereClause = {};
     
     if (search) {
        whereClause = {
           OR: [
              { participant_code: { contains: String(search) } },
              { user: { name: { contains: String(search) } } },
              { user: { phone: { contains: String(search) } } }
           ]
        };
     }

     const travelers = await prisma.tripTraveler.findMany({ 
        where: whereClause,
        include: { user: true, trip: true }
     });
     return res.json(travelers);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const addTraveler = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const { tripId, name, email, phone, paymentStatus } = req.body;
     
     const trip = await prisma.trip.findUnique({ where: { id: tripId } });
     if (!trip) return res.status(404).json({ error: "Trip not found" });

     let user = await prisma.user.findUnique({ where: { email } });
     let generatedPassword = "";

     if (!user) {
        generatedPassword = "User@" + Math.floor(1000 + Math.random() * 9000);
        const passwordHash = await bcrypt.hash(generatedPassword, 12);
        user = await prisma.user.create({
           data: { name, email, phone, passwordHash, role: "TRAVELER" }
        });
     }

     // Generate Participant Code
     // YC-{tripPrefix}{yearCode}-{sequenceNumber}
     const tripPrefix = (trip.destination.substring(0, 3)).toUpperCase();
     const yearCode = String(new Date(trip.departureDate).getFullYear()).slice(-2);
     const count = await prisma.tripTraveler.count({ where: { tripId } });
     const sequenceNumber = String(count + 1).padStart(3, '0');
     const participant_code = `YC-${tripPrefix}${yearCode}-${sequenceNumber}`;

     const totalAmount = trip.price || 0;

     const tripTraveler = await prisma.tripTraveler.create({
       data: { 
         tripId, 
         userId: user.id, 
         participant_code,
         checkin_status: "REGISTERED",
         payment_status: paymentStatus.toUpperCase(),
         total_amount: totalAmount,
         remaining_amount: totalAmount,
         coordinator_id: req.user!.id
       }
     });

     return res.json({ 
        ...tripTraveler, 
        credentials: generatedPassword ? { email, password: generatedPassword } : null 
     });
   } catch(err: any) { 
       console.error(err);
       return res.status(500).json({ error: "Internal error" }); 
   }
};

export const editTraveler = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const tripTraveler = await prisma.tripTraveler.update({
       where: { id: req.params.id as string },
       data: req.body as any
     });
     return res.json(tripTraveler);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const removeTraveler = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     await prisma.tripTraveler.delete({ where: { id: req.params.id as string }});
     return res.json({ message: "Traveler removed" });
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const getAllStaff = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const staff = await prisma.tripStaff.findMany({ include: { user: true, trip: true }});
     return res.json(staff);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const assignStaff = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const { tripId, name, email, phone, role } = req.body;
     
     let user = await prisma.user.findUnique({ where: { email } });
     let generatedPassword = "";

     if (!user) {
        generatedPassword = "Staff@" + Math.floor(1000 + Math.random() * 9000);
        const passwordHash = await bcrypt.hash(generatedPassword, 12);
        user = await prisma.user.create({
           data: { name, email, phone, passwordHash, role }
        });
     }

     const tripStaff = await prisma.tripStaff.create({
       data: { tripId, userId: user.id, role }
     });

     return res.json({ 
        ...tripStaff, 
        credentials: generatedPassword ? { email, password: generatedPassword } : null 
     });
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const getAllNotifications = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const notifications = await prisma.notification.findMany({ include: { trip: true }, orderBy: { createdAt: 'desc' }});
     return res.json(notifications);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const sendNotification = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const { tripId, title, message } = req.body;
     const sentBy = req.user!.id; 
     const notification = await prisma.notification.create({
       data: { tripId, title, message, sentBy }
     });
     return res.json(notification);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const recordBookingPayment = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const { tripTravelerId, amount, payment_method, transaction_id, total_amount } = req.body;
     
     const tt = await prisma.tripTraveler.update({
        where: { id: tripTravelerId },
        data: {
          booking_amount: amount,
          total_amount: total_amount,
          amount_paid: amount,
          remaining_amount: total_amount - amount,
          payment_status: total_amount - amount <= 0 ? "PAID" : "BOOKED",
          payment_method,
          transaction_id,
          payment_date: new Date()
        }
     });

     await prisma.paymentRecord.create({
        data: {
           tripTravelerId,
           amount,
           payment_method,
           transaction_id,
           payment_type: "BOOKING"
        }
     });

     return res.json(tt);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const updatePayment = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
     const { tripTravelerId, amount, payment_method, transaction_id } = req.body;
     
     const tt = await prisma.tripTraveler.findUnique({ where: { id: tripTravelerId } });
     if(!tt) return res.status(404).json({ error: "Not found" });

     const newAmountPaid = tt.amount_paid + amount;
     const newRemaining = tt.total_amount - newAmountPaid;

     const updatedTt = await prisma.tripTraveler.update({
        where: { id: tripTravelerId },
        data: {
           amount_paid: newAmountPaid,
           remaining_amount: newRemaining,
           payment_status: newRemaining <= 0 ? "PAID" : "PARTIAL",
           payment_date: new Date(),
           transaction_id,
           payment_method
        }
     });

     await prisma.paymentRecord.create({
        data: {
           tripTravelerId,
           amount,
           payment_method,
           transaction_id,
           payment_type: "PARTIAL"
        }
     });

     return res.json(updatedTt);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const getTripPayments = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
       const { tripId } = req.params;
       const payments = await prisma.paymentRecord.findMany({
          where: { tripTraveler: { tripId: tripId as string } },
          include: { tripTraveler: { include: { user: true, trip: true } } },
          orderBy: { payment_date: 'desc' }
       });
      return res.json(payments);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};

export const getAllPaymentHistory = async (req: AuthRequest, res: Response): Promise<any> => {
   try {
      const payments = await prisma.paymentRecord.findMany({
         include: { tripTraveler: { include: { user: true, trip: true } } },
         orderBy: { payment_date: 'desc' }
      });
      return res.json(payments);
   } catch(err: any) { return res.status(500).json({ error: "Internal error" }); }
};
