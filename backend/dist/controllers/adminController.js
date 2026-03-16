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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.assignStaff = exports.addTraveler = exports.deleteTrip = exports.editTrip = exports.createTrip = exports.getAdminDashboard = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const getAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trips = yield prismaClient_1.prisma.trip.findMany();
        const travelerCount = yield prismaClient_1.prisma.user.count({ where: { role: "TRAVELER" } });
        return res.json({ trips, travelerCount });
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.getAdminDashboard = getAdminDashboard;
const createTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Expects all required dates parsed as ISO strings
        const _a = req.body, { departure_date, return_date } = _a, rest = __rest(_a, ["departure_date", "return_date"]);
        const trip = yield prismaClient_1.prisma.trip.create({
            data: Object.assign(Object.assign({}, rest), { departure_date: new Date(departure_date), return_date: new Date(return_date) })
        });
        return res.json(trip);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.createTrip = createTrip;
const editTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { departure_date, return_date } = _a, rest = __rest(_a, ["departure_date", "return_date"]);
        const dataToUpdate = Object.assign({}, rest);
        if (departure_date)
            dataToUpdate.departure_date = new Date(departure_date);
        if (return_date)
            dataToUpdate.return_date = new Date(return_date);
        const trip = yield prismaClient_1.prisma.trip.update({ where: { id: parseInt(req.params.id) }, data: dataToUpdate });
        return res.json(trip);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.editTrip = editTrip;
const deleteTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prismaClient_1.prisma.trip.delete({ where: { id: parseInt(req.params.id) } });
        return res.json({ message: "Trip deleted" });
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.deleteTrip = deleteTrip;
const addTraveler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, seat_number, payment_status } = req.body;
        const tripTraveler = yield prismaClient_1.prisma.tripTraveler.create({
            data: { tripId: parseInt(req.params.id), userId, seat_number, payment_status }
        });
        return res.json(tripTraveler);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.addTraveler = addTraveler;
const assignStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role, phone } = req.body;
        const tripStaff = yield prismaClient_1.prisma.tripStaff.create({
            data: { tripId: parseInt(req.params.id), userId, role, phone }
        });
        return res.json(tripStaff);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.assignStaff = assignStaff;
const sendNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, message } = req.body;
        const notification = yield prismaClient_1.prisma.notification.create({
            data: { tripId: parseInt(req.params.id), title, message }
        });
        return res.json(notification);
    }
    catch (e) {
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.sendNotification = sendNotification;
