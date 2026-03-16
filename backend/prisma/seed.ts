import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@123", 12);
  const travelerPasswordHash = await bcrypt.hash("Traveler@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@youthcamping.in" },
    update: {
      phone: "+91 98765 43210"
    },
    create: {
      email: "admin@youthcamping.in",
      name: "Parth Patel",
      phone: "+91 98765 43210",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const traveler = await prisma.user.upsert({
    where: { email: "rahul@example.com" },
    update: {},
    create: {
      email: "rahul@example.com",
      name: "Rahul Kumar",
      phone: "+91 9988776655",
      passwordHash: travelerPasswordHash,
      role: "TRAVELER",
    },
  });

  // Create Staff Users
  const staffTypes = [
    { name: "Rameshbhai Patel", role: "DRIVER", phone: "+91 98252 41873" },
    { name: "Suresh Negi", role: "GUIDE", phone: "+91 94120 83456" },
    { name: "Bhupendra Rawat", role: "GUIDE", phone: "+91 70170 22345" },
    { name: "Priya Sharma", role: "COORDINATOR", phone: "+91 99099 11234" },
    { name: "Dr. Ankit Verma", role: "MEDIC", phone: "+91 87800 55678" }
  ];

  const createdStaff = [];
  for (const s of staffTypes) {
    const staffUser = await prisma.user.upsert({
      where: { email: `${s.name.replace(/\s/g, '').toLowerCase()}@youthcamping.in` },
      update: {},
      create: {
        email: `${s.name.replace(/\s/g, '').toLowerCase()}@youthcamping.in`,
        name: s.name,
        passwordHash: adminPasswordHash,
        role: s.role,
        phone: s.phone
      }
    });
    createdStaff.push({ userId: staffUser.id, role: s.role });
  }

  // Create Trip
  const trip = await prisma.trip.create({
    data: {
      title: "Kedarnath Valley Trek",
      destination: "Kedarnath, Uttarakhand",
      departureDate: new Date("2025-12-15T00:00:00Z"),
      returnDate: new Date("2025-12-19T00:00:00Z"),
      departureCity: "Ahmedabad",
      departurePoint: "ST Bus Stand, Gate 3",
      departureTime: "7:00 AM",
      vehicleNumber: "GJ-01-AY-7842",
      vehicleType: "Tempo Traveller",
      groupSize: 24,
      maxAltitude: 3583,
      difficulty: "Moderate",
      status: "confirmed",
      price: 15000,
      
      travelers: {
        create: [
          { 
            userId: traveler.id, 
            participant_code: "YC-KED25-001",
            booking_reference: "REF12345",
            checkin_status: "REGISTERED",
            payment_status: "PARTIAL",
            total_amount: 15000,
            booking_amount: 5000,
            amount_paid: 10000,
            remaining_amount: 5000,
            payment_method: "Bank Transfer",
            payment_date: new Date(),
            transaction_id: "TXN_SEED_999",
            coordinator_id: admin.id
          }
        ]
      },
      staff: {
        create: createdStaff.map(s => ({ userId: s.userId, role: s.role }))
      },
      itinerary: {
        create: [
          { dayNumber: 1, date: "2025-12-15", title: "Departure from Ahmedabad → Haridwar", activities: JSON.stringify(["overnight journey", "orientation"]) },
          { dayNumber: 2, date: "2025-12-16", title: "Haridwar → Sonprayag", activities: JSON.stringify(["campfire", "briefing"]) },
          { dayNumber: 3, date: "2025-12-17", title: "Trek to Base Camp", activities: JSON.stringify(["3050m", "8 km trek"]) },
          { dayNumber: 4, date: "2025-12-18", title: "Summit Kedarnath Temple", activities: JSON.stringify(["3583m", "celebration dinner"]) },
          { dayNumber: 5, date: "2025-12-19", title: "Descent and return to Ahmedabad", activities: JSON.stringify(["return journey"]) }
        ]
      },
      packingItems: {
        create: [
          { category: "Clothing", itemName: "Thermal inner wear", mandatory: true },
          { category: "Clothing", itemName: "Fleece jacket", mandatory: true },
          { category: "Clothing", itemName: "Windproof jacket", mandatory: true },
          { category: "Gear", itemName: "Trekking boots", mandatory: true },
          { category: "Gear", itemName: "Gloves", mandatory: true },
          { category: "Clothing", itemName: "Woolen hat", mandatory: true },
          { category: "Gear", itemName: "Headlamp", mandatory: true },
          { category: "Health", itemName: "Water bottles", mandatory: true },
          { category: "Health", itemName: "Sunscreen", mandatory: true },
          { category: "Health", itemName: "Diamox", mandatory: false },
          { category: "Health", itemName: "ORS sachets", mandatory: true },
          { category: "Documents", itemName: "Aadhaar card", mandatory: true },
          { category: "Documents", itemName: "Booking confirmation", mandatory: true },
          { category: "Electronics", itemName: "Power bank", mandatory: true }
        ]
      },
      notifications: {
        create: [
          { title: "Departure Reminder", message: "Bus departs Dec 15 at 7:00 AM from ST Bus Stand Gate 3.", sentBy: "admin@youthcamping.in" },
          { title: "Packing Tip", message: "Carry -10°C rated sleeping bag liner. Temperature drops to -8°C at night.", sentBy: "admin@youthcamping.in" }
        ]
      }
    }
  });

  // Create Initial Payment Records
  const tt = await prisma.tripTraveler.findFirst({ where: { userId: traveler.id, tripId: trip.id } });
  if(tt) {
    await prisma.paymentRecord.createMany({
        data: [
            { tripTravelerId: tt.id, amount: 5000, payment_method: "Bank Transfer", payment_type: "BOOKING", transaction_id: "TXN_SEED_999a", payment_date: new Date(Date.now() - 86400000 * 5) },
            { tripTravelerId: tt.id, amount: 5000, payment_method: "UPI", payment_type: "PARTIAL", transaction_id: "TXN_SEED_999b", payment_date: new Date(Date.now() - 86400000 * 2) }
        ]
    });
  }

  console.log("Seed successful! Trip ID:", trip.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
