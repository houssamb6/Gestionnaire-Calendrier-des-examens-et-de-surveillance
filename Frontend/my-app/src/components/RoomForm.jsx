import React, { useState, useEffect, useRef } from 'react';
import { Building, Users, MapPin, CheckCircle, XCircle, BadgeCheck, Clock } from 'lucide-react';
import axios from 'axios';
import "../styles/popup.css";

export function RoomForm({ room, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    roomName: '',
    capacity: 1,
    location: '',
    RoomStatus: 'Available'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const nameRef = useRef(null);
  
  useEffect(() => {
    if (room) {
      setFormData({
        roomName: room.roomName || '',
        capacity: room.capacity || 1,
        location: room.location || '',
        RoomStatus: room.isAvailable === 1 ? 'Available' : 'In Use'
      });
    }
    
    // Focus on first field when form opens
    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }, [room]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.roomName.trim()) newErrors.roomName = 'Room name is required';
    if (formData.capacity <= 0) newErrors.capacity = 'Capacity must be at least 1';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem("token");
        const endpoint = room?.id 
          ? `http://localhost:8000/api/rooms/${room.id}` 
          : "http://localhost:8000/api/rooms";
        
        const method = room?.id ? "put" : "post";
        
        const response = await axios({
          method,
          url: endpoint,
          data: {
            roomName: formData.roomName,
            capacity: parseInt(formData.capacity),
            location: formData.location,
            isAvailable: formData.RoomStatus === 'Available' ? 1 : 0
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true
        });
        
        setSubmitSuccess(true);
        
        // Delay closing to show success state
        setTimeout(() => {
          onSubmit(formData);
        }, 1000);
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors(prev => ({ 
          ...prev, 
          submit: error.response?.data?.message || "Failed to save room. Please try again."
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getInputClass = (field) =>
    `w-full p-3 border rounded-md shadow-sm transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

  const statusOptions = [
    { 
      label: 'Available', 
      value: 'Available', 
      icon: <Clock className="w-4 h-4" />, 
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200' 
    },
    { 
      label: 'In Use', 
      value: 'In Use', 
      icon: <Users className="w-4 h-4" />, 
      color: 'bg-amber-100 text-amber-800 border-amber-200' 
    },
  ];

  return (
    <div className="backdrop fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative overflow-hidden animate-fadeIn">
        {/* Header with visual appeal */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Building className="mr-2 h-6 w-6" />
            {room ? 'Edit Room Details' : 'Create New Room'}
          </h2>
          <p className="text-indigo-100 text-sm mt-1">
            {room ? 'Update the room information below' : 'Fill in the details to add a new room'}
          </p>
        </div>
        
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Close form"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {submitSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Room {room ? 'Updated' : 'Created'} Successfully!
            </h3>
            <p className="text-gray-600 mt-2 text-center">
              The room has been {room ? 'updated' : 'added'} to the system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Room Name */}
              <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name*
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="roomName"
                    ref={nameRef}
                    value={formData.roomName}
                    onChange={(e) => handleChange('roomName', e.target.value)}
                    className={`${getInputClass('roomName')} pl-10`}
                    placeholder="e.g., Conference Room A101"
                    autoComplete="off"
                  />
                </div>
                {errors.roomName && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {errors.roomName}
                  </p>
                )}
              </div>

              {/* Capacity with better UX */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity*
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', Math.max(1, parseInt(e.target.value) || 1))}
                    className={`${getInputClass('capacity')} pl-10`}
                    placeholder="e.g., 40"
                    min="1"
                  />
                  <div className="absolute right-3 top-2 flex space-x-1">
                    <button 
                      type="button"
                      className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                      onClick={() => handleChange('capacity', Math.max(1, formData.capacity - 1))}
                      tabIndex="-1"
                    >
                      <span className="sr-only">Decrease</span>
                      <span className="block w-4 h-4 items-center justify-center text-gray-600">−</span>
                    </button>
                    <button 
                      type="button"
                      className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                      onClick={() => handleChange('capacity', formData.capacity + 1)}
                      tabIndex="-1"
                    >
                      <span className="sr-only">Increase</span>
                      <span className="block w-4 h-4 items-center justify-center text-gray-600">+</span>
                    </button>
                  </div>
                </div>
                {errors.capacity && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {errors.capacity}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">Number of people this room can accommodate</p>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className={`${getInputClass('location')} pl-10`}
                    placeholder="e.g., Building A, First Floor"
                    autoComplete="off"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Status Section - Improved */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Status
                </label>
                <div className="flex flex-wrap gap-3">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => handleChange('RoomStatus', status.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        formData.RoomStatus === status.value 
                          ? `${status.color} ring-2 ring-offset-2 ring-indigo-300` 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {status.icon}
                      {status.label}
                      {formData.RoomStatus === status.value && (
                        <BadgeCheck className="w-3.5 h-3.5 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Global form error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                  <p className="text-red-600 text-sm flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                  disabled={isSubmitting}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex items-center px-5 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                    isSubmitting 
                      ? 'bg-indigo-400 cursor-wait' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {room ? 'Update Room' : 'Create Room'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}