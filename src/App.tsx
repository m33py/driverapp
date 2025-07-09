import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Calendar from './components/Calendar';
import BookingForm from './components/BookingForm';
import BookingDetails from './components/BookingDetails';
import { Booking, BookingFormData, CalendarView } from './types';
import { format } from 'date-fns';

function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>('dayGridMonth');
  const [initialBookingData, setInitialBookingData] = useState<Partial<BookingFormData> | undefined>(undefined);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    }
  }, []);

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleCreateBooking = (data: BookingFormData) => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBookings(prev => [...prev, newBooking]);
    setShowBookingForm(false);
    toast.success('Booking created successfully!');
  };

  const handleUpdateBooking = (data: BookingFormData) => {
    if (!editingBooking) return;

    const updatedBooking: Booking = {
      ...editingBooking,
      ...data,
      updatedAt: new Date().toISOString()
    };

    setBookings(prev => prev.map(booking => 
      booking.id === editingBooking.id ? updatedBooking : booking
    ));
    setShowBookingForm(false);
    setEditingBooking(null);
    toast.success('Booking updated successfully!');
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    setShowBookingDetails(false);
    setSelectedBooking(null);
    toast.success('Booking deleted successfully!');
  };

  const handleDateClick = (arg: any) => {
    // arg can be a dateClick (dateStr) or a slot (date, allDay)
    let date = '';
    let pickupTime = '';
    if (arg.date) {
      // timeGrid or dayGrid slot
      const d = arg.date;
      date = format(d, 'yyyy-MM-dd');
      pickupTime = d.toTimeString().slice(0,5); // 'HH:mm'
    } else if (arg.dateStr) {
      // dayGrid click
      date = arg.dateStr;
    }
    setInitialBookingData({ date, pickupTime });
    setEditingBooking(null);
    setShowBookingForm(true);
  };

  const handleEventClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowBookingDetails(false);
    setShowBookingForm(true);
  };

  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-safe">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 pt-safe sticky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Family Booking System</h1>
              <p className="text-sm text-gray-500">Manage schedules for family members and chauffeur</p>
            </div>
            <button
              onClick={() => {
                setEditingBooking(null);
                setShowBookingForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Booking
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Calendar */}
          <Calendar
            bookings={bookings}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onViewChange={handleViewChange}
            currentView={currentView}
          />

          {/* Family Members Legend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Family Members</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { id: '1', name: 'Mom', color: '#ef4444' },
                { id: '2', name: 'Dad', color: '#3b82f6' },
                { id: '3', name: 'Siang', color: '#10b981' },
                { id: '4', name: 'Steph', color: '#f59e0b' },
                { id: '5', name: 'Josephine', color: '#8b5cf6' }
              ].map((member) => (
                <div key={member.id} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: member.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showBookingForm && (
        <BookingForm
          onSubmit={editingBooking ? handleUpdateBooking : handleCreateBooking}
          onCancel={() => {
            setShowBookingForm(false);
            setEditingBooking(null);
            setInitialBookingData(undefined);
          }}
          initialData={editingBooking || initialBookingData}
        />
      )}

      {showBookingDetails && selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onEdit={handleEditBooking}
          onDelete={handleDeleteBooking}
          onClose={() => {
            setShowBookingDetails(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}

export default App; 