import React, { useState, useEffect } from 'react';
import { bookAppointment, getAppointments, cancelAppointment, deleteAppointment } from '../utils/storage';
import { toast } from '@/hooks/use-toast';
import PageNavigator from '../components/PageNavigator';

const Booking = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    symptoms: '',
    date: '',
    time: ''
  });
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('book'); // 'book' or 'view'

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const appointmentList = getAppointments();
    setAppointments(appointmentList);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const appointment = bookAppointment(formData);
      toast({
        title: "Appointment booked successfully!",
        description: `Appointment scheduled for ${appointment.date} at ${appointment.time}`,
      });
      
      // Reset form and reload appointments
      setFormData({
        patientName: '',
        age: '',
        symptoms: '',
        date: '',
        time: ''
      });
      loadAppointments();
      setActiveTab('view');
      
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = (id) => {
    try {
      cancelAppointment(id);
      loadAppointments();
      toast({
        title: "Appointment cancelled",
        description: "The appointment has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        deleteAppointment(id);
        loadAppointments();
        toast({
          title: "Appointment deleted",
          description: "The appointment has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete appointment.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'text-success bg-success/10 border-success/20';
      case 'cancelled':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatDateTime = (date, time) => {
    const appointmentDate = new Date(`${date}T${time}`);
    return appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Appointment Booking</h1>
          <p className="text-muted-foreground">
            Schedule your appointment with healthcare professionals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('book')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'book'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Book New Appointment
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'view'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Appointments ({appointments.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'book' ? (
          <div className="max-w-2xl mx-auto">
            <div className="medical-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Patient Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                    className="medical-input"
                    placeholder="Enter patient's full name"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Age <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="150"
                    className="medical-input"
                    placeholder="Enter patient's age"
                  />
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Symptoms / Reason for Visit <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="medical-input resize-none"
                    placeholder="Describe the symptoms or reason for the appointment..."
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Date <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={today}
                      className="medical-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Time <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="medical-input"
                    >
                      <option value="">Select time</option>
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Important Note */}
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-warning text-lg">⚠️</span>
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">Important Note:</div>
                      <p className="text-muted-foreground">
                        This is a booking request. Our team will contact you to confirm the appointment 
                        within 24 hours. For emergencies, please call our helpline directly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-medical disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>Booking Appointment...</span>
                    </div>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* View Appointments */
          <div className="max-w-4xl mx-auto">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-muted-foreground text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No appointments yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  You haven't booked any appointments. Click the button below to schedule your first appointment.
                </p>
                <button
                  onClick={() => setActiveTab('book')}
                  className="btn-medical"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-foreground">
                    Your Appointments
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    Total: {appointments.length}
                  </div>
                </div>

                <div className="grid gap-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="medical-card-hover">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {appointment.patientName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                              {appointment.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Date & Time:</div>
                              <div className="font-medium text-foreground">
                                {formatDateTime(appointment.date, appointment.time)}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Age:</div>
                              <div className="font-medium text-foreground">
                                {appointment.age} years old
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-muted-foreground text-sm">Symptoms:</div>
                            <div className="text-foreground">
                              {appointment.symptoms}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-muted-foreground">
                            Booked on: {appointment.createdDate} at {appointment.createdTime}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 sm:space-y-3">
                          {appointment.status === 'scheduled' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="bg-warning text-warning-foreground px-4 py-2 rounded-lg hover:bg-warning/90 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Page Navigator */}
      <PageNavigator position="bottom-right" />
    </div>
  );
};

export default Booking;