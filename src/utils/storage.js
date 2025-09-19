/**
 * Storage utilities for UPCHAARAK
 * Handles chat history and appointment booking data in LocalStorage
 */

const CHAT_HISTORY_KEY = 'upchaarak_chat_history';
const APPOINTMENTS_KEY = 'upchaarak_appointments';

// ===================
// CHAT HISTORY MANAGEMENT
// ===================

/**
 * Get all chat history for current user
 */
export const getChatHistory = () => {
  const history = localStorage.getItem(CHAT_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

/**
 * Add a new chat message to history
 */
export const addChatMessage = (userMessage, botResponse) => {
  const history = getChatHistory();
  const newEntry = {
    id: Date.now().toString(),
    userMessage,
    botResponse,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };
  
  history.unshift(newEntry); // Add to beginning for latest first
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  return newEntry;
};

/**
 * Clear all chat history
 */
export const clearChatHistory = () => {
  localStorage.removeItem(CHAT_HISTORY_KEY);
};

/**
 * Delete specific chat entry
 */
export const deleteChatEntry = (id) => {
  const history = getChatHistory();
  const filteredHistory = history.filter(entry => entry.id !== id);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(filteredHistory));
};

// ===================
// APPOINTMENT BOOKING MANAGEMENT
// ===================

/**
 * Get all appointments for current user
 */
export const getAppointments = () => {
  const appointments = localStorage.getItem(APPOINTMENTS_KEY);
  return appointments ? JSON.parse(appointments) : [];
};

/**
 * Book a new appointment
 */
export const bookAppointment = (appointmentData) => {
  const { patientName, age, symptoms, date, time } = appointmentData;
  
  // Validate input
  if (!patientName || !age || !symptoms || !date || !time) {
    throw new Error('All fields are required for booking appointment');
  }
  
  if (age < 1 || age > 150) {
    throw new Error('Please enter a valid age');
  }
  
  const appointments = getAppointments();
  
  const newAppointment = {
    id: Date.now().toString(),
    patientName,
    age: parseInt(age),
    symptoms,
    date,
    time,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    createdDate: new Date().toLocaleDateString(),
    createdTime: new Date().toLocaleTimeString()
  };
  
  appointments.unshift(newAppointment); // Add to beginning for latest first
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  return newAppointment;
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = (id, status) => {
  const appointments = getAppointments();
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  appointments[appointmentIndex].status = status;
  appointments[appointmentIndex].updatedAt = new Date().toISOString();
  
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  return appointments[appointmentIndex];
};

/**
 * Cancel appointment
 */
export const cancelAppointment = (id) => {
  return updateAppointmentStatus(id, 'cancelled');
};

/**
 * Delete appointment
 */
export const deleteAppointment = (id) => {
  const appointments = getAppointments();
  const filteredAppointments = appointments.filter(apt => apt.id !== id);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filteredAppointments));
};

/**
 * Get upcoming appointments (future dates only)
 */
export const getUpcomingAppointments = () => {
  const appointments = getAppointments();
  const today = new Date().toISOString().split('T')[0];
  
  return appointments.filter(apt => {
    return apt.date >= today && apt.status === 'scheduled';
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// ===================
// GENERAL UTILITIES
// ===================

/**
 * Clear all stored data for current user
 */
export const clearAllUserData = () => {
  clearChatHistory();
  localStorage.removeItem(APPOINTMENTS_KEY);
};

/**
 * Export user data (for backup purposes)
 */
export const exportUserData = () => {
  return {
    chatHistory: getChatHistory(),
    appointments: getAppointments(),
    exportDate: new Date().toISOString()
  };
};