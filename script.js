// API Configuration
const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let currentUser = null;

// DOM Elements
const loadingSpinner = document.getElementById('loading');
const toastContainer = document.getElementById('toast-container');
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');
const bookingsLink = document.getElementById('bookings-link');

// Show/Hide Loading Spinner
const showLoading = () => loadingSpinner.style.display = 'flex';
const hideLoading = () => loadingSpinner.style.display = 'none';

// Toast Notifications
const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Navigation
const showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
};

// Authentication Tab Toggle
const showAuthTab = (tab) => {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
    document.querySelector(`[onclick="showAuthTab('${tab}')"]`).classList.add('active');
};

// API Calls with Error Handling
const apiCall = async (endpoint, options = {}) => {
    try {
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
};

// Authentication Handlers
const handleLogin = async (event) => {
    event.preventDefault();
    showLoading();

    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        token = data.token;
        currentUser = data.data;
        localStorage.setItem('token', token);
        
        updateAuthUI(true);
        showToast('Login successful', 'success');
        showSection('search');
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        hideLoading();
    }
};

const handleRegister = async (event) => {
    event.preventDefault();
    showLoading();

    try {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        token = data.token;
        currentUser = data.data;
        localStorage.setItem('token', token);
        
        updateAuthUI(true);
        showToast('Registration successful', 'success');
        showSection('search');
    } catch (error) {
        console.error('Registration error:', error);
    } finally {
        hideLoading();
    }
};

const handleLogout = () => {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    updateAuthUI(false);
    showSection('home');
    showToast('Logged out successfully', 'success');
};

// Update UI based on authentication state
const updateAuthUI = (isLoggedIn) => {
    loginLink.style.display = isLoggedIn ? 'none' : 'block';
    logoutLink.style.display = isLoggedIn ? 'block' : 'none';
    bookingsLink.style.display = isLoggedIn ? 'block' : 'none';
};

// Flight Search
const searchFlights = async (event) => {
    event.preventDefault();
    showLoading();

    try {
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        const departureDate = document.getElementById('departure-date').value;

        const data = await apiCall(`/flights/search?origin=${origin}&destination=${destination}&departureDate=${departureDate}`);
        displaySearchResults(data.data);
    } catch (error) {
        console.error('Search error:', error);
    } finally {
        hideLoading();
    }
};

const displaySearchResults = (flights) => {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (flights.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No flights found</p>';
        return;
    }

    flights.forEach(flight => {
        const departureTime = new Date(flight.departureTime).toLocaleTimeString();
        const arrivalTime = new Date(flight.arrivalTime).toLocaleTimeString();

        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.innerHTML = `
            <div class="flight-header">
                <span class="flight-number">${flight.flightNumber}</span>
                <span class="airline">${flight.airline}</span>
            </div>
            <div class="flight-details">
                <div class="flight-time">
                    <div class="time">${departureTime}</div>
                    <div class="location">${flight.origin}</div>
                </div>
                <div class="flight-duration">${flight.duration}</div>
                <div class="flight-time">
                    <div class="time">${arrivalTime}</div>
                    <div class="location">${flight.destination}</div>
                </div>
                <div class="flight-footer">
                    <div class="price">$${flight.price}</div>
                    <div class="seats-available">${flight.availableSeats} seats left</div>
                    <button class="book-btn" onclick="showBookingModal('${flight._id}')">
                        Book Now
                    </button>
                </div>
            </div>
        `;
        resultsContainer.appendChild(flightCard);
    });
};

// Booking Modal
const showBookingModal = async (flightId) => {
    if (!token) {
        showToast('Please login to book flights', 'error');
        showSection('auth');
        return;
    }

    try {
        showLoading();
        const flight = await apiCall(`/flights/${flightId}`);
        document.getElementById('flight-details').innerHTML = `
            <div class="selected-flight">
                <h3>Flight Details</h3>
                <p>Flight: ${flight.data.flightNumber}</p>
                <p>From: ${flight.data.origin} To: ${flight.data.destination}</p>
                <p>Date: ${new Date(flight.data.departureTime).toLocaleDateString()}</p>
                <p>Price per passenger: $${flight.data.price}</p>
            </div>
        `;
        document.getElementById('booking-modal').style.display = 'block';
        currentFlightPrice = flight.data.price;
        updateTotalAmount();
    } catch (error) {
        console.error('Error fetching flight details:', error);
    } finally {
        hideLoading();
    }
};

const closeBookingModal = () => {
    document.getElementById('booking-modal').style.display = 'none';
    document.getElementById('booking-form').reset();
    document.getElementById('passengers-container').innerHTML = '';
    addPassenger(); // Add one default passenger form
};

// Passenger Management
let currentFlightPrice = 0;

const addPassenger = () => {
    const container = document.getElementById('passengers-container');
    const passengerForm = document.createElement('div');
    passengerForm.className = 'passenger-form';
    passengerForm.innerHTML = `
        <div class="form-group">
            <label>Passenger Name</label>
            <input type="text" name="passenger-name" required>
        </div>
        <div class="form-group">
            <label>Age</label>
            <input type="number" name="passenger-age" min="1" max="120" required>
        </div>
        <div class="form-group">
            <label>Seat Number</label>
            <input type="text" name="seat-number" required>
        </div>
        ${container.children.length > 0 ? '<button type="button" class="remove-passenger" onclick="removePassenger(this)">&times;</button>' : ''}
    `;
    container.appendChild(passengerForm);
    updateTotalAmount();
};

const removePassenger = (button) => {
    button.parentElement.remove();
    updateTotalAmount();
};

const updateTotalAmount = () => {
    const passengerCount = document.querySelectorAll('.passenger-form').length;
    const totalAmount = passengerCount * currentFlightPrice;
    document.getElementById('total-amount').textContent = totalAmount;
};

// Handle Booking
const handleBooking = async (event) => {
    event.preventDefault();
    showLoading();

    try {
        const passengerForms = document.querySelectorAll('.passenger-form');
        const passengers = Array.from(passengerForms).map(form => ({
            name: form.querySelector('[name="passenger-name"]').value,
            age: parseInt(form.querySelector('[name="passenger-age"]').value),
            seatNumber: form.querySelector('[name="seat-number"]').value
        }));

        const flightId = document.querySelector('.selected-flight').dataset.flightId;
        
        const booking = await apiCall('/bookings', {
            method: 'POST',
            body: JSON.stringify({
                flightId,
                passengers
            })
        });

        showToast('Booking successful!', 'success');
        closeBookingModal();
        loadUserBookings();
        showSection('bookings');
    } catch (error) {
        console.error('Booking error:', error);
    } finally {
        hideLoading();
    }
};

// Load User Bookings
const loadUserBookings = async () => {
    if (!token) return;

    try {
        showLoading();
        const data = await apiCall('/bookings/my');
        displayBookings(data.data);
    } catch (error) {
        console.error('Error loading bookings:', error);
    } finally {
        hideLoading();
    }
};

const displayBookings = (bookings) => {
    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = '';

    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="no-bookings">No bookings found</p>';
        return;
    }

    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
            <div class="booking-header">
                <div class="booking-info">
                    <h3>Booking ID: ${booking._id}</h3>
                    <p>Flight: ${booking.flight.flightNumber}</p>
                </div>
                <span class="booking-status status-${booking.status.toLowerCase()}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <p>From: ${booking.flight.origin} To: ${booking.flight.destination}</p>
                <p>Date: ${new Date(booking.flight.departureTime).toLocaleDateString()}</p>
                <p>Passengers: ${booking.passengers.length}</p>
                <p>Total Amount: $${booking.totalAmount}</p>
            </div>
            ${booking.status !== 'cancelled' ? `
                <button class="cancel-btn" onclick="cancelBooking('${booking._id}')">
                    Cancel Booking
                </button>
            ` : ''}
        `;
        bookingsList.appendChild(bookingCard);
    });
};

// Cancel Booking
const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        showLoading();
        await apiCall(`/bookings/${bookingId}/cancel`, { method: 'PUT' });
        showToast('Booking cancelled successfully', 'success');
        loadUserBookings();
    } catch (error) {
        console.error('Error cancelling booking:', error);
    } finally {
        hideLoading();
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    if (token) {
        updateAuthUI(true);
        apiCall('/auth/me').then(data => {
            currentUser = data.data;
        }).catch(() => {
            handleLogout();
        });
    } else {
        updateAuthUI(false);
    }

    // Event Listeners
    loginLink.addEventListener('click', () => showSection('auth'));
    logoutLink.addEventListener('click', handleLogout);
    bookingsLink.addEventListener('click', () => {
        showSection('bookings');
        loadUserBookings();
    });

    // Add initial passenger form
    addPassenger();
});
