import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Calendar from './components/Calendar';
import BookingForm from './components/BookingForm';
import BookingDetails from './components/BookingDetails';
import { Booking, BookingFormData, CalendarView } from './types';
import { format } from 'date-fns';

// Hook to calculate available height below the header
function useAvailableHeight(headerRef: React.RefObject<HTMLElement>) {
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    function updateHeight() {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      setHeight(window.innerHeight - headerHeight);
    }
    window.addEventListener('resize', updateHeight);
    updateHeight();
    return () => window.removeEventListener('resize', updateHeight);
  }, [headerRef]);
  return height;
}

function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>('dayGridMonth');
  const [calendarTitle, setCalendarTitle] = useState<string>('');
  const [initialBookingData, setInitialBookingData] = useState<Partial<BookingFormData> | undefined>(undefined);
  const calendarRef = useRef<any>(null);

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

  // Navigation handlers
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };
  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };
  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  };
  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  const headerRef = useRef<HTMLElement>(null);
  const calendarHeight = useAvailableHeight(headerRef);
  return (
    <div className="min-h-screen h-screen bg-gray-50 flex flex-col pt-safe overflow-hidden">
      <Toaster position="top-right" />

      {/* Header */}
      <header ref={headerRef} className="bg-white shadow-sm border-b border-gray-200 pt-safe sticky top-0 z-30">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Left: Calendar title and navigation */}
          <div className="flex items-center gap-2">
            {/* <span className="text-lg font-semibold text-gray-900 mr-4">{calendarTitle}</span> */}
            <button onClick={handleToday} className="px-3 py-1 rounded border text-sm font-medium bg-gray-100 hover:bg-gray-200">Today</button>
            <button onClick={handlePrev} className="px-2 py-1 rounded border text-sm font-medium bg-gray-100 hover:bg-gray-200">&#60;</button>
            <button onClick={handleNext} className="px-2 py-1 rounded border text-sm font-medium bg-gray-100 hover:bg-gray-200">&#62;</button>
            <select
              value={currentView}
              onChange={e => handleViewChange(e.target.value as CalendarView)}
              className="ml-2 px-2 py-1 rounded border text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              <option value="dayGridMonth">Month</option>
              <option value="timeGridWeek">Week</option>
              <option value="timeGridDay">Day</option>
              <option value="listWeek">List</option>
            </select>
          </div>
          {/* Center: Title */}
          <span className="text-lg font-semibold text-gray-900 mr-4">{calendarTitle}</span>
          {/* Right: New Booking button */}
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
      </header>

      {/* Main Content - flex-grow, scrollable calendar */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div style={{ flex: 1, minHeight: 0 }}>
          <Calendar
            ref={calendarRef}
            bookings={bookings}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onViewChange={setCurrentView}
            currentView={currentView}
            height={calendarHeight}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            onTitleChange={setCalendarTitle}
          />
        </div>
        {/*
      Family Members Legend
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
      */}
      </div>

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