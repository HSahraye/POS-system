'use client';

import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

// Sample FAQ data
const faqs = [
  {
    id: 1,
    question: 'How do I create a new order?',
    answer: 'To create a new order, navigate to the Orders page and click on the "New Order" button. Fill in the required information and click "Save" to create the order.'
  },
  {
    id: 2,
    question: 'How do I add a new product?',
    answer: 'To add a new product, go to the Products page and click on the "Add Product" button. Fill in the product details including name, price, and inventory, then click "Save".'
  },
  {
    id: 3,
    question: 'How do I view sales reports?',
    answer: 'Sales reports can be accessed from the Reports page. You can filter reports by date range and export them in various formats including PDF and CSV.'
  },
  {
    id: 4,
    question: 'How do I manage user permissions?',
    answer: 'User permissions can be managed from the Settings page. Navigate to the "Users" tab and select a user to modify their role and access permissions.'
  },
  {
    id: 5,
    question: 'How do I reset my password?',
    answer: 'To reset your password, go to the Profile page and click on "Change Password". You will need to enter your current password and then set a new one.'
  }
];

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    description: '',
    priority: 'medium'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const toggleFaq = (id: number) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit the ticket to the backend
    console.log('Ticket submitted:', ticketForm);
    setFormSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setTicketForm({
        subject: '',
        category: '',
        description: '',
        priority: 'medium'
      });
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Help & Support</h1>
          <p className="mt-2 text-sm text-gray-700">
            Find answers to common questions or contact our support team for assistance.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* FAQs Section */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <div key={faq.id} className="py-4">
                    <button
                      className="flex w-full items-start justify-between text-left"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                      <span className="ml-6 flex h-7 items-center">
                        <QuestionMarkCircleIcon
                          className={`h-6 w-6 ${
                            expandedFaq === faq.id ? 'text-primary-600' : 'text-gray-400'
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="mt-2 pr-12">
                        <p className="text-sm text-gray-500">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <div className="rounded-lg border border-gray-200 bg-white shadow">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Contact Information
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-900">Email Support</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <a href="mailto:support@example.com" className="text-primary-600 hover:text-primary-500">
                      support@example.com
                    </a>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Response time: Within 24 hours
                  </div>
                </div>

                <div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-900">Phone Support</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <a href="tel:+18001234567" className="text-primary-600 hover:text-primary-500">
                      +1 (800) 123-4567
                    </a>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Hours: Mon-Fri, 9AM-5PM EST
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-900">Live Chat</div>
                  <div className="mt-2 text-sm text-gray-500">
                    Available during business hours
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      onClick={() => alert('Live chat would open here')}
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Ticket Form */}
      <div className="mt-8">
        <div className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Submit a Support Ticket
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {formSubmitted ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Your support ticket has been submitted successfully. We'll get back to you soon.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">
                      Subject
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        value={ticketForm.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                      Category
                    </label>
                    <div className="mt-2">
                      <select
                        id="category"
                        name="category"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        value={ticketForm.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a category</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing Question</option>
                        <option value="account">Account Management</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      value={ticketForm.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900">
                    Priority
                  </label>
                  <div className="mt-2">
                    <select
                      id="priority"
                      name="priority"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      value={ticketForm.priority}
                      onChange={handleInputChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 