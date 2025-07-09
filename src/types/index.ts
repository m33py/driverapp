export interface Booking {
  id: string;
  date: string;
  location: string;
  familyMember: string;
  pickupTime: string;
  dropoffTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  color: string;
}

export interface BookingFormData {
  date: string;
  location: string;
  familyMember: string;
  pickupTime: string;
  dropoffTime: string;
}

export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'; 