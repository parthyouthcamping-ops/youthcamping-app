import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import {
  getAllTrips, getTrip, createTrip, editTrip, deleteTrip,
  getAllTravelers, addTraveler, editTraveler, removeTraveler,
  getAllStaff, assignStaff,
  getAllNotifications, sendNotification,
  recordBookingPayment, updatePayment, getTripPayments, getAllPaymentHistory
} from "../controllers/admin.controller";

const router = Router();
router.use(authenticate, requireAdmin);

router.get("/trips", getAllTrips);
router.get("/trips/:id", getTrip);
router.post("/trips", createTrip);
router.put("/trips/:id", editTrip);
router.delete("/trips/:id", deleteTrip);

router.get("/travelers", getAllTravelers);
router.post("/travelers", addTraveler);
router.put("/travelers/:id", editTraveler);
router.delete("/travelers/:id", removeTraveler);

router.get("/staff", getAllStaff);
router.post("/staff", assignStaff);

router.get("/notifications", getAllNotifications);
router.post("/notify", sendNotification);

router.post("/payment/booking", recordBookingPayment);
router.post("/payment/update", updatePayment);
router.get("/payment/trip/:tripId", getTripPayments);
router.get("/payment/history", getAllPaymentHistory);

export default router;
