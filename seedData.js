const mongoose = require('mongoose');
const Flight = require('./models/Flight');
const User = require('./models/User');
const config = require('./config/config');

// Connect to database
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Sample flight data
const sampleFlights = [
    {
        flightNumber: "AA101",
        airline: "American Airlines",
        origin: "New York",
        destination: "Los Angeles",
        departureTime: new Date("2024-02-15T08:00:00Z"),
        arrivalTime: new Date("2024-02-15T11:30:00Z"),
        duration: "5h 30m",
        price: 299,
        availableSeats: 150,
        totalSeats: 180,
        aircraft: "Boeing 737",
        status: "scheduled"
    },
    {
        flightNumber: "DL205",
        airline: "Delta Airlines",
        origin: "Chicago",
        destination: "Miami",
        departureTime: new Date("2024-02-16T14:30:00Z"),
        arrivalTime: new Date("2024-02-16T18:45:00Z"),
        duration: "3h 15m",
        price: 189,
        availableSeats: 120,
        totalSeats: 160,
        aircraft: "Airbus A320",
        status: "scheduled"
    },
    {
        flightNumber: "UA308",
        airline: "United Airlines",
        origin: "San Francisco",
        destination: "Seattle",
        departureTime: new Date("2024-02-17T10:15:00Z"),
        arrivalTime: new Date("2024-02-17T12:30:00Z"),
        duration: "2h 15m",
        price: 149,
        availableSeats: 90,
        totalSeats: 120,
        aircraft: "Boeing 757",
        status: "scheduled"
    },
    {
        flightNumber: "SW412",
        airline: "Southwest Airlines",
        origin: "Dallas",
        destination: "Denver",
        departureTime: new Date("2024-02-18T16:00:00Z"),
        arrivalTime: new Date("2024-02-18T17:45:00Z"),
        duration: "2h 45m",
        price: 129,
        availableSeats: 140,
        totalSeats: 175,
        aircraft: "Boeing 737",
        status: "scheduled"
    },
    {
        flightNumber: "JB515",
        airline: "JetBlue Airways",
        origin: "Boston",
        destination: "Orlando",
        departureTime: new Date("2024-02-19T09:30:00Z"),
        arrivalTime: new Date("2024-02-19T13:15:00Z"),
        duration: "3h 45m",
        price: 199,
        availableSeats: 110,
        totalSeats: 150,
        aircraft: "Airbus A321",
        status: "scheduled"
    },
    {
        flightNumber: "AA620",
        airline: "American Airlines",
        origin: "Los Angeles",
        destination: "New York",
        departureTime: new Date("2024-02-20T12:00:00Z"),
        arrivalTime: new Date("2024-02-20T20:30:00Z"),
        duration: "5h 30m",
        price: 319,
        availableSeats: 85,
        totalSeats: 180,
        aircraft: "Boeing 777",
        status: "scheduled"
    },
    {
        flightNumber: "DL725",
        airline: "Delta Airlines",
        origin: "Atlanta",
        destination: "Las Vegas",
        departureTime: new Date("2024-02-21T11:45:00Z"),
        arrivalTime: new Date("2024-02-21T13:30:00Z"),
        duration: "4h 45m",
        price: 249,
        availableSeats: 95,
        totalSeats: 160,
        aircraft: "Boeing 767",
        status: "scheduled"
    },
    {
        flightNumber: "UA830",
        airline: "United Airlines",
        origin: "Houston",
        destination: "Phoenix",
        departureTime: new Date("2024-02-22T15:20:00Z"),
        arrivalTime: new Date("2024-02-22T16:45:00Z"),
        duration: "2h 25m",
        price: 159,
        availableSeats: 105,
        totalSeats: 140,
        aircraft: "Airbus A319",
        status: "scheduled"
    },
    {
        flightNumber: "SW935",
        airline: "Southwest Airlines",
        origin: "Nashville",
        destination: "Austin",
        departureTime: new Date("2024-02-23T13:10:00Z"),
        arrivalTime: new Date("2024-02-23T14:25:00Z"),
        duration: "1h 15m",
        price: 99,
        availableSeats: 130,
        totalSeats: 175,
        aircraft: "Boeing 737",
        status: "scheduled"
    },
    {
        flightNumber: "JB040",
        airline: "JetBlue Airways",
        origin: "New York",
        destination: "San Diego",
        departureTime: new Date("2024-02-24T07:45:00Z"),
        arrivalTime: new Date("2024-02-24T11:15:00Z"),
        duration: "6h 30m",
        price: 359,
        availableSeats: 75,
        totalSeats: 150,
        aircraft: "Airbus A321",
        status: "scheduled"
    }
];

// Sample admin user
const adminUser = {
    name: "Admin User",
    email: "admin@airline.com",
    password: "admin123",
    role: "admin"
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await Flight.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Cleared existing data');

        // Create admin user
        const admin = await User.create(adminUser);
        console.log('✅ Created admin user:', admin.email);

        // Create sample flights
        const flights = await Flight.insertMany(sampleFlights);
        console.log(`✅ Created ${flights.length} sample flights`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Sample Data Summary:');
        console.log(`   • Admin User: ${admin.email} (password: admin123)`);
        console.log(`   • Flights: ${flights.length} flights added`);
        console.log('\n🚀 You can now start the server and test the application!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeder
seedDatabase();
