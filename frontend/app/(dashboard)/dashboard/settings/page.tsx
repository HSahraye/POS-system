'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';

const settingsSections = [
  {
    id: 'account',
    name: 'Account Settings',
    description: 'Manage your account information and preferences.',
    settings: [
      {
        id: 'email-notifications',
        name: 'Email Notifications',
        description: 'Receive email notifications for important updates and events.',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'two-factor-auth',
        name: 'Two-Factor Authentication',
        description: 'Add an extra layer of security to your account.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Customize the look and feel of your dashboard.',
    settings: [
      {
        id: 'dark-mode',
        name: 'Dark Mode',
        description: 'Use dark theme for the dashboard interface.',
        type: 'toggle',
        defaultValue: false,
      },
      {
        id: 'compact-view',
        name: 'Compact View',
        description: 'Display more information with less spacing.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure how and when you receive notifications.',
    settings: [
      {
        id: 'order-notifications',
        name: 'Order Notifications',
        description: 'Receive notifications for new orders and order status changes.',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'inventory-alerts',
        name: 'Inventory Alerts',
        description: 'Get notified when products are low in stock or out of stock.',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'customer-activity',
        name: 'Customer Activity',
        description: 'Receive notifications about customer registrations and activity.',
        type: 'toggle',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Manage security settings and access controls.',
    settings: [
      {
        id: 'session-timeout',
        name: 'Session Timeout',
        description: 'Automatically log out after a period of inactivity.',
        type: 'select',
        options: [
          { value: '15', label: '15 minutes' },
          { value: '30', label: '30 minutes' },
          { value: '60', label: '1 hour' },
          { value: '120', label: '2 hours' },
          { value: 'never', label: 'Never' },
        ],
        defaultValue: '30',
      },
      {
        id: 'login-history',
        name: 'Login History',
        description: 'View and manage your recent login activity.',
        type: 'button',
        buttonText: 'View History',
        action: () => alert('Login history would be displayed here'),
      },
    ],
  },
];

export default function SettingsPage() {
  // Initialize state for all toggle settings
  const [toggleSettings, setToggleSettings] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    settingsSections.forEach(section => {
      section.settings.forEach(setting => {
        if (setting.type === 'toggle') {
          initialState[setting.id] = setting.defaultValue as boolean;
        }
      });
    });
    return initialState;
  });

  // Initialize state for all select settings
  const [selectSettings, setSelectSettings] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    settingsSections.forEach(section => {
      section.settings.forEach(setting => {
        if (setting.type === 'select') {
          initialState[setting.id] = setting.defaultValue as string;
        }
      });
    });
    return initialState;
  });

  const handleToggleChange = (id: string, checked: boolean) => {
    setToggleSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setSelectSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveSettings = () => {
    // In a real application, this would save the settings to the backend
    alert('Settings saved successfully!');
    console.log('Toggle settings:', toggleSettings);
    console.log('Select settings:', selectSettings);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {settingsSections.map((section) => (
          <div key={section.id} className="border-b border-gray-200 pb-8">
            <h2 className="text-lg font-medium text-gray-900">{section.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{section.description}</p>

            <div className="mt-6 space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-start justify-between">
                  <div className="max-w-2xl">
                    <div className="text-sm font-medium text-gray-900">{setting.name}</div>
                    <div className="mt-1 text-sm text-gray-500">{setting.description}</div>
                  </div>
                  <div className="ml-6 flex-shrink-0">
                    {setting.type === 'toggle' && (
                      <Switch
                        checked={toggleSettings[setting.id]}
                        onChange={(checked) => handleToggleChange(setting.id, checked)}
                        className={cn(
                          toggleSettings[setting.id] ? 'bg-primary-600' : 'bg-gray-200',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
                        )}
                      >
                        <span className="sr-only">{setting.name}</span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            toggleSettings[setting.id] ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                    )}
                    {setting.type === 'select' && (
                      <select
                        id={setting.id}
                        name={setting.id}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                        value={selectSettings[setting.id]}
                        onChange={(e) => handleSelectChange(setting.id, e.target.value)}
                      >
                        {setting.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {setting.type === 'button' && (
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={setting.action}
                      >
                        {setting.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          className="ml-4 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          onClick={handleSaveSettings}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
} 