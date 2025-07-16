import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Booking, CalendarView } from '../types';
import { familyMembers } from '../data/familyMembers';
import { formatTimeForDisplay } from '../utils/timeUtils';

interface CalendarProps {
  bookings: Booking[];
  onDateClick: (arg: any) => void;
  onEventClick: (booking: Booking) => void;
  onViewChange: (view: CalendarView) => void;
  currentView: CalendarView;
  height?: string | number;
  onPrev?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  onTitleChange?: (title: string) => void;
}

const Calendar = React.forwardRef<any, CalendarProps>(({
  bookings,
  onDateClick,
  onEventClick,
  onViewChange,
  currentView,
  height,
  onPrev,
  onNext,
  onToday,
  onTitleChange
}, ref) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const formattedEvents = bookings.map((booking) => {
      const familyMember = familyMembers.find(member => member.id === booking.familyMember);
      const startDateTime = `${booking.date}T${booking.pickupTime}:00`;
      const endDateTime = `${booking.date}T${booking.dropoffTime}:00`;
      
      return {
        id: booking.id,
        title: `${familyMember?.name || 'Unknown'} - ${booking.location}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: familyMember?.color || '#3b82f6',
        borderColor: familyMember?.color || '#3b82f6',
        extendedProps: {
          booking
        }
      };
    });
    
    setEvents(formattedEvents);
  }, [bookings]);

  // Use the forwarded ref for FullCalendar
  const calendarRef = ref as React.RefObject<any>;
  useEffect(() => {
    if (calendarRef && 'current' in calendarRef && calendarRef.current && onTitleChange) {
      const api = calendarRef.current.getApi();
      onTitleChange(api.view.title);
    }
  }, [currentView, onTitleChange, calendarRef]);

  const handleDateClick = (arg: any) => {
    onDateClick(arg);
  };

  const handleSelect = (arg: any) => {
    // arg.start is a Date object for the slot start
    onDateClick({ date: arg.start });
  };

  const handleEventClick = (arg: any) => {
    const booking = arg.event.extendedProps.booking;
    onEventClick(booking);
  };

  const handleViewChange = (arg: any) => {
    const view = arg.view.type as CalendarView;
    onViewChange(view);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={currentView}
        headerToolbar={false}
        views={{
          dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' },
            dayHeaderFormat: { weekday: 'short' },
            dayCellContent: (args: any) => {
              const date = args.date;
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 32,
                      height: 32,
                      lineHeight: '32px',
                      borderRadius: '50%',
                      background: isToday ? '#bfdbfe' : 'transparent',
                      color: isToday ? '#1e3a8a' : '#111827',
                      fontWeight: 600,
                      fontSize: 16,
                      textAlign: 'center',
                      transition: 'background 0.2s'
                    }}
                  >
                    {date.getDate()}
                  </span>
                </div>
              );
            }
          },
          timeGridWeek: {
            titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
            dayHeaderContent: (args: any) => {
              const date = args.date;
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
                    {date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginTop: 2,
                      color: isToday ? '#2563eb' : '#111827',
                      background: isToday ? '#dbeafe' : 'transparent',
                      borderRadius: '50%',
                      padding: isToday ? '2px 8px' : '0'
                    }}
                  >
                    {date.getDate()}
                  </span>
                </div>
              );
            }
          },
          timeGridDay: {
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
            dayHeaderContent: (args: any) => {
              const date = args.date;
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
                    {date.toLocaleDateString(undefined, { weekday: 'long' })}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginTop: 2,
                      color: isToday ? '#2563eb' : '#111827',
                      background: isToday ? '#dbeafe' : 'transparent',
                      borderRadius: '50%',
                      padding: isToday ? '2px 8px' : '0'
                    }}
                  >
                    {date.getDate()}
                  </span>
                </div>
              );
            }
          },
          listWeek: {
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
          }
        }}
        events={events}
        dateClick={handleDateClick}
        select={handleSelect}
        eventClick={handleEventClick}
        datesSet={(arg: any) => {
          handleViewChange(arg);
          if (calendarRef && 'current' in calendarRef && calendarRef.current && onTitleChange) {
            const api = calendarRef.current.getApi();
            onTitleChange(api.view.title);
          }
        }}
        height={height || 'auto'}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        slotDuration="00:15:00"
        slotLabelInterval="01:00"
        // Remove global dayHeaderFormat so it doesn't override per-view settings
        eventDisplay="block"
        eventColor="#3b82f6"
        eventTextColor="#ffffff"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        moreLinkClick="popover"
        eventDidMount={(info) => {
          // Add custom styling for events
          const eventEl = info.el;
          eventEl.style.borderRadius = '4px';
          eventEl.style.fontSize = '12px';
          eventEl.style.fontWeight = '500';
        }}
      />
    </div>
  );
});

export default Calendar; 