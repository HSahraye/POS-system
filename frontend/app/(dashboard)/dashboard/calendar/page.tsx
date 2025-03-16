'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

// Event types with colors
const eventTypes = [
  { id: 'meeting', name: 'Meeting', color: 'bg-blue-100 text-blue-800' },
  { id: 'event', name: 'Event', color: 'bg-green-100 text-green-800' },
  { id: 'call', name: 'Call', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'task', name: 'Task', color: 'bg-purple-100 text-purple-800' },
  { id: 'deadline', name: 'Deadline', color: 'bg-red-100 text-red-800' },
];

// Interface for event
interface Event {
  id: string;
  name: string;
  time: string;
  date: string;
  type: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    name: '',
    time: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    type: 'meeting',
  });

  // Load events from localStorage on component mount
  useEffect(() => {
    const loadEvents = () => {
      try {
        const storedEvents = localStorage.getItem('calendarEvents');
        if (storedEvents) {
          setEvents(JSON.parse(storedEvents));
        }
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
      }
    };
    
    loadEvents();
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Update new event date when selected date changes
  useEffect(() => {
    setNewEvent(prev => ({
      ...prev,
      date: format(selectedDate, 'yyyy-MM-dd'),
    }));
  }, [selectedDate]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.time) {
      alert('Please fill in all required fields');
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
    };

    setEvents([...events, event]);
    setShowAddEventModal(false);
    setNewEvent({
      name: '',
      time: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      type: 'meeting',
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  // Get events for selected day
  const selectedDayEvents = getEventsForDay(selectedDate);

  // Get event type color
  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType ? eventType.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
        <button
          onClick={() => setShowAddEventModal(true)}
          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevMonth}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-7 gap-px">
                {/* Day headers */}
                {days.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);

                  return (
                    <div
                      key={day.toString()}
                      onClick={() => handleDateClick(day)}
                      className={`
                        min-h-[80px] cursor-pointer border border-gray-200 p-2
                        ${isSelected ? 'bg-primary-50 border-primary-500' : ''}
                        ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                      `}
                    >
                      <div className="text-right text-sm">
                        {format(day, 'd')}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`px-2 py-1 text-xs rounded-md truncate ${getEventTypeColor(event.type)}`}
                          >
                            {event.name}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Events for selected day */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Events for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            <div className="mt-6 space-y-4">
              {selectedDayEvents.length === 0 ? (
                <p className="text-gray-500">No events scheduled for this day.</p>
              ) : (
                selectedDayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-md border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-gray-900">{event.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-md ${getEventTypeColor(event.type)}`}>
                        {eventTypes.find(t => t.id === event.type)?.name || event.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{event.time}</p>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Add New Event
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Event Name*
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={newEvent.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="Meeting with client"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                          Time*
                        </label>
                        <input
                          type="time"
                          name="time"
                          id="time"
                          value={newEvent.time}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                          Date*
                        </label>
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={newEvent.date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Event Type
                        </label>
                        <select
                          name="type"
                          id="type"
                          value={newEvent.type}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          {eventTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 