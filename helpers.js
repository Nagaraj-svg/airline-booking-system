// Helper function to generate seat numbers
exports.generateSeatNumbers = (totalSeats) => {
    const seats = [];
    const rows = Math.ceil(totalSeats / 6); // 6 seats per row (A-F)
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let row = 1; row <= rows; row++) {
        for (let letter of seatLetters) {
            if (seats.length < totalSeats) {
                seats.push(`${row}${letter}`);
            }
        }
    }
    
    return seats;
};

// Helper function to format flight duration
exports.formatDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const diffMs = arrival - departure;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
};

// Helper function to validate email
exports.validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

// Helper function to generate booking reference
exports.generateBookingReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Helper function to format currency
exports.formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Helper function to calculate age from date of birth
exports.calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};
