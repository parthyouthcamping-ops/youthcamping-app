import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getMyTrips,
  getTripDetails,
  getTripItinerary,
  getTripPacking,
  getTripContacts,
  getTripNotifications,
  getTripPayment,
  getTravelerByCode,
  triggerSos
} from "../controllers/traveler.controller";

const router = Router();
router.use(authenticate);

router.get("/trips", getMyTrips);
router.get("/trip/:id", getTripDetails);
router.get("/trip/:id/itinerary", getTripItinerary);
router.get("/trip/:id/packing", getTripPacking);
router.get("/trip/:id/contacts", getTripContacts);
router.get("/trip/:id/notifications", getTripNotifications);
router.get("/trip/:id/payment", getTripPayment);
router.get("/code/:code", getTravelerByCode);
router.post("/trip/:id/sos", triggerSos);

export default router;
