# Family Booking System

A modern web application for managing schedules between family members and a chauffeur. Built with React, TypeScript, and FullCalendar.

## Features

### 🗓️ Calendar Interface
- **Multiple Views**: Day, Week, Month, and List views (similar to Google Calendar)
- **Interactive Calendar**: Click on dates to create new bookings
- **Color-coded Events**: Each family member has a unique color for easy identification
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 📝 Booking Management
- **Simple Booking Form**: Intuitive form with all essential fields
- **15-minute Time Intervals**: Pickup and dropoff times in 15-minute increments
- **Form Validation**: Ensures dropoff time is after pickup time
- **Edit & Delete**: Full CRUD operations for bookings

### 👨‍👩‍👧‍👦 Family Member Management
- **Pre-configured Family Members**: Mom, Dad, Sarah, Michael, Emma
- **Color-coded System**: Each member has a distinct color
- **Visual Legend**: Easy identification of family members

### 💾 Data Persistence
- **Local Storage**: All bookings are saved locally in the browser
- **No Backend Required**: Works offline and doesn't require server setup

## Required Fields

The booking form includes these simple, essential fields:
- **Date**: When the booking is scheduled
- **Location**: Destination or pickup location
- **Family Member**: Who needs the ride
- **Pickup Time**: When to be picked up (15-minute intervals)
- **Dropoff Time**: When to be dropped off (15-minute intervals)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the files locally, navigate to the project directory
   cd driverApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `build` folder, which you can deploy to any static hosting service.

## Usage

### Creating a Booking
1. Click the "New Booking" button in the header, or
2. Click on any date in the calendar
3. Fill out the booking form with the required information
4. Click "Create" to save the booking

### Viewing Bookings
- **Calendar View**: See all bookings in a visual calendar format
- **Event Click**: Click on any booking event to view details
- **Multiple Views**: Switch between Day, Week, Month, and List views

### Editing a Booking
1. Click on a booking event in the calendar
2. Click "Edit" in the booking details modal
3. Modify the information as needed
4. Click "Update" to save changes

### Deleting a Booking
1. Click on a booking event in the calendar
2. Click "Delete" in the booking details modal
3. Confirm the deletion

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Calendar**: FullCalendar for rich calendar functionality
- **Forms**: React Hook Form for form management
- **Notifications**: React Hot Toast for user feedback
- **Data Storage**: Browser localStorage for persistence

## Browser Compatibility

The application is compatible with:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones (iOS and Android)

## Customization

### Adding Family Members
Edit `src/data/familyMembers.ts` to add or modify family members:

```typescript
export const familyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Mom',
    color: '#ef4444'
  },
  // Add more members here
];
```

### Changing Colors
Each family member can have a custom color. Use any valid CSS color value (hex, rgb, etc.).

## Troubleshooting

### Common Issues

1. **Dependencies not installing**
   - Try deleting `node_modules` and `package-lock.json`
   - Run `npm install` again

2. **Calendar not loading**
   - Check browser console for errors
   - Ensure all dependencies are properly installed

3. **Bookings not saving**
   - Check if localStorage is enabled in your browser
   - Try clearing browser cache and reloading

## Future Enhancements

Potential features for future versions:
- User authentication
- Backend database integration
- Email notifications
- Recurring bookings
- Driver availability management
- Route optimization
- Real-time updates

## License

This project is for personal use. Feel free to modify and adapt for your family's needs.

## Support

For questions or issues, please check the troubleshooting section above or review the code comments for implementation details. 