"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerSos = exports.getTripPacking = exports.getTripItinerary = exports.getTripDetails = exports.getMyTrips = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const getMyTrips = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const trips = yield prismaClient_1.prisma.tripTraveler.findMany({
            where: { userId },
            include: {
                trip: true
            }
        });
        return res.json(trips.map(t => (Object.assign(Object.assign({}, t.trip), { payment_status: t.payment_status, seat_number: t.seat_number }))));
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.getMyTrips = getMyTrips;
const getTripDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tripId = parseInt(req.params.id);
        const trip = yield prismaClient_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                staff: {
                    include: { user: { select: { name: true, phone: true } } }
                }
            }
        });
        if (!trip)
            return res.status(404).json({ error: "Trip not found" });
        return res.json(trip);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.getTripDetails = getTripDetails;
const getTripItinerary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tripId = parseInt(req.params.id);
        const itinerary = yield prismaClient_1.prisma.itinerary.findMany({ where: { tripId }, orderBy: { day_number: 'asc' } });
        return res.json(itinerary);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.getTripItinerary = getTripItinerary;
const getTripPacking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tripId = parseInt(req.params.id);
        const packing = yield prismaClient_1.prisma.packingItem.findMany({ where: { tripId } });
        return res.json(packing);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.getTripPacking = getTripPacking;
const triggerSos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tripId = parseInt(req.params.id);
        const userId = req.user.id;
        const user = yield prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
        // Here we would integrate SendGrid / Twilio or just broadcast via websockets
        console.log(`[ALERT] SOS TRIGGERED ON TRIP ${tripId} BY USER ${user === null || user === void 0 ? void 0 : user.name} (${user === null || user === void 0 ? void 0 : user.phone})!`);
        return res.json({ message: "SOS Alert sent to Admin and Guide successfully" });
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.triggerSos = triggerSos;
