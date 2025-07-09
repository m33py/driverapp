import React from 'react';
import { Booking } from '../types';
import { familyMembers } from '../data/familyMembers';
import { formatTimeForDisplay, formatDateForDisplay } from '../utils/timeUtils';

interface BookingDetailsProps {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
  onClose: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  booking,
  onEdit,
  onDelete,
  onClose
}) => {
  const familyMember = familyMembers.find(member => member.id === booking.familyMember);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Date</label>
              <p className="text-lg text-gray-900">{formatDateForDisplay(booking.date)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Location</label>
              <p className="text-lg text-gray-900">{booking.location}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Family Member</label>
              <div className="flex items-center mt-1">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: familyMember?.color }}
                ></div>
                <p className="text-lg text-gray-900">{familyMember?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Pickup Time</label>
                <p className="text-lg text-gray-900">{formatTimeForDisplay(booking.pickupTime)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dropoff Time</label>
                <p className="text-lg text-gray-900">{formatTimeForDisplay(booking.dropoffTime)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => onEdit(booking)}
                  className="flex-1 px-4 py-2 text-primary-600 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(booking.id)}
                  className="flex-1 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails; 