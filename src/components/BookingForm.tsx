import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { BookingFormData } from '../types';
import { familyMembers } from '../data/familyMembers';
import { getTimeIntervals, formatTimeForDisplay } from '../utils/timeUtils';

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
  initialData?: Partial<BookingFormData>;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors }, watch } = useForm<BookingFormData>({
    defaultValues: {
      date: initialData?.date || new Date().toISOString().split('T')[0],
      location: initialData?.location || '',
      familyMember: initialData?.familyMember || '',
      pickupTime: initialData?.pickupTime || '',
      dropoffTime: initialData?.dropoffTime || ''
    }
  });

  const selectedPickupTime = watch('pickupTime');

  const handleFormSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {initialData ? 'Edit Booking' : 'New Booking'}
          </h2>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <Controller
                name="location"
                control={control}
                rules={{ required: 'Location is required' }}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="Enter destination or location"
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Family Member Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family Member *
              </label>
              <Controller
                name="familyMember"
                control={control}
                rules={{ required: 'Family member is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a family member</option>
                    {familyMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.familyMember && (
                <p className="text-red-500 text-sm mt-1">{errors.familyMember.message}</p>
              )}
            </div>

            {/* Pickup Time Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Time *
              </label>
              <Controller
                name="pickupTime"
                control={control}
                rules={{ required: 'Pickup time is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select pickup time</option>
                    {getTimeIntervals.map((time) => (
                      <option key={time} value={time}>
                        {formatTimeForDisplay(time)}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.pickupTime && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupTime.message}</p>
              )}
            </div>

            {/* Dropoff Time Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dropoff Time *
              </label>
              <Controller
                name="dropoffTime"
                control={control}
                rules={{ 
                  required: 'Dropoff time is required',
                  validate: (value) => {
                    if (selectedPickupTime && value) {
                      return value > selectedPickupTime || 'Dropoff time must be after pickup time';
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select dropoff time</option>
                    {getTimeIntervals
                      .filter(time => !selectedPickupTime || time > selectedPickupTime)
                      .map((time) => (
                        <option key={time} value={time}>
                          {formatTimeForDisplay(time)}
                        </option>
                      ))}
                  </select>
                )}
              />
              {errors.dropoffTime && (
                <p className="text-red-500 text-sm mt-1">{errors.dropoffTime.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm; 