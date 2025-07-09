import { format, parse, addMinutes, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

export const generateTimeIntervals = (): string[] => {
  const intervals: string[] = [];
  const baseDate = new Date();
  
  // Set to start of day
  const startDate = setMinutes(setSeconds(setMilliseconds(baseDate, 0), 0), 0);
  
  // Generate 15-minute intervals for 24 hours
  for (let i = 0; i < 96; i++) { // 24 hours * 4 (15-minute intervals)
    const time = addMinutes(startDate, i * 15);
    intervals.push(format(time, 'HH:mm'));
  }
  
  return intervals;
};

export const formatTimeForDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDateForDisplay = (date: string): string => {
  return format(new Date(date), 'EEEE, MMMM d, yyyy');
};

export const getTimeIntervals = generateTimeIntervals(); 