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
exports.opsQuery = exports.askAssistant = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const askAssistant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, tripId } = req.body;
        const userId = req.user.id;
        const tripTraveler = yield prismaClient_1.prisma.tripTraveler.findUnique({
            where: { tripId_userId: { tripId, userId } },
            include: {
                trip: { include: { packingItems: true, staff: { include: { user: true } } } }
            }
        });
        if (!tripTraveler) {
            return res.status(404).json({ answer: "I could not find your trip details." });
        }
        const trip = tripTraveler.trip;
        const msgLower = message.toLowerCase();
        let answer = "I'm YC Assistant! I can help you with what to pack, departure times, and guide contacts.";
        if (msgLower.includes("pack")) {
            const items = trip.packingItems.map(p => p.item_name).join(", ");
            answer = items ? `For this trip, you should pack: ${items}. You can check these off in your Packing List tab!` : "There are no specific packing items listed yet.";
        }
        else if (msgLower.includes("departure") || msgLower.includes("time")) {
            answer = `Your trip departs from ${trip.departure_city} on ${trip.departure_date.toDateString()}.`;
            if (trip.departure_point)
                answer += ` The departure point is ${trip.departure_point}.`;
        }
        else if (msgLower.includes("guide") || msgLower.includes("driver") || msgLower.includes("who")) {
            const staff = trip.staff.map(s => `${s.role}: ${s.user.name} (${s.phone || s.user.phone})`).join(", ");
            answer = staff ? `Your trip contacts are: ${staff}.` : "Staff has not been assigned to your trip yet.";
        }
        return res.json({ answer });
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error processing query" });
    }
});
exports.askAssistant = askAssistant;
const opsQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, tripId } = req.body;
        const msgLower = query.toLowerCase();
        const trip = yield prismaClient_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                travelers: { include: { user: true } },
                staff: { include: { user: true } }
            }
        });
        if (!trip)
            return res.status(404).json({ result: "Trip not found." });
        let dataResult = "Query unclear. Ask 'show travelers', 'show driver details', or 'show departure time'.";
        if (msgLower.includes("traveler")) {
            dataResult = trip.travelers.map(t => ({ name: t.user.name, phone: t.user.phone, seat: t.seat_number }));
        }
        else if (msgLower.includes("driver")) {
            dataResult = trip.staff.filter(s => s.role === "DRIVER").map(s => ({ name: s.user.name, phone: s.phone || s.user.phone }));
        }
        else if (msgLower.includes("departure")) {
            dataResult = { date: trip.departure_date, city: trip.departure_city, point: trip.departure_point, vehicle: trip.vehicle_number };
        }
        return res.json({ data: dataResult });
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error processing ops query" });
    }
});
exports.opsQuery = opsQuery;
