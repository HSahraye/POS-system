'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/outline';

// Sample events data
const events = [
  {
    id: '1',
    name: 'Team Meeting',
    time: '9:00 AM - 10:00 AM',
    date: '2023-03-15',
    type: 'meeting',
  },
  {
    id: '2',
    name: 'Product Launch',
    time: '2:00 PM - 4:00 PM',
    date: '2023-03-15',
    type: 'event',
  },
  {
    id: '3',
    name: 'Client Call',
    time: '11:30 AM - 12:00 PM',
    date: '2023-03-16',
    type: 'call',
  },
  {
    id: '4',
    name: 'Marketing Review',
    time: '1:00 PM - 2:00 PM',
    date: '2023-03-17',
    type: 'meeting',
  },
  {
    id: '5',
    name: 'Inventory Check',
    time: '10:00 AM - 11:00 AM',
    date: '2023-03-18',
    type: 'task',
  },
  {
    id: '6',
    name: 'Sales Report Due',
    time: '5:00 PM',
    date: '2023-03-20',
    type: 'deadline',
  },
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const eventTypeColors = {
  meeting: 'bg-blue-100 text-blue-700',
  event: 'bg-purple-100 text-purple-700',
  call: 'bg-green-100 text-green-700',
  task: 'bg-yellow-100 text-yellow-700',
  deadline: 'bg-red-100 text-red-700',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Get the number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Create calendar days array
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    const dayEvents = events.filter(event => event.date === dateString);
    
    calendarDays.push({
      day,
      date: dateString,
      events: dayEvents,
      isToday: dateString === new Date().toISOString().split('T')[0],
    });
  }
  
  // Get events for the selected date
  const selectedDateEvents = events.filter(event => event.date === selectedDate);
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Calendar</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your schedule, events, and appointments.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 inline-block" aria-hidden="true" />
            Add event
          </button>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {months[currentMonth]} {currentYear}
            </h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="rounded-md bg-white p-2 text-gray-400 hover:text-gray-500"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Previous month</span>
              </button>
              <button
                type="button"
                onClick={goToNextMonth}
                className="rounded-md bg-white p-2 text-gray-400 hover:text-gray-500"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Next month</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-gray-200 text-sm shadow">
            {/* Day headers */}
            {days.map((day) => (
              <div key={day} className="bg-gray-50 py-2 text-center font-semibold text-gray-900">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={`min-h-[100px] bg-white px-3 py-2 ${
                  dayData?.isToday ? 'bg-primary-50' : ''
                } ${
                  dayData?.date === selectedDate ? 'ring-2 ring-primary-600' : ''
                } ${
                  dayData ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
                onClick={() => dayData && setSelectedDate(dayData.date)}
              >
                {dayData ? (
                  <>
                    <div className={`text-right font-semibold ${
                      dayData.isToday ? 'text-primary-600' : 'text-gray-900'
                    }`}>
                      {dayData.day}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayData.events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`truncate rounded px-1.5 py-0.5 text-xs ${
                            eventTypeColors[event.type as keyof typeof eventTypeColors] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {event.name}
                        </div>
                      ))}
                      {dayData.events.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayData.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        
        {/* Selected day events */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white shadow">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Events for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {selectedDateEvents.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {selectedDateEvents.map((event) => (
                    <li key={event.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{event.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">{event.time}</p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            eventTypeColors[event.type as keyof typeof eventTypeColors] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No events scheduled for this day.</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Add event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 