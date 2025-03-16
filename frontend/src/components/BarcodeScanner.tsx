'use client';

import { useState, useEffect } from 'react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError: (error: Error) => void;
}

// This is a simplified mock version of the barcode scanner for static builds
export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Check if we're in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on the server
  if (!isClient) {
    return (
      <div className="p-4 border border-gray-300 rounded-lg">
        <p className="text-center text-gray-500">Barcode scanner loading...</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onScan(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Barcode Scanner</h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter a barcode manually or scan using a USB scanner.
      </p>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter barcode"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Scan
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: The actual camera-based scanner is disabled in static builds.</p>
      </div>
    </div>
  );
} 