'use client';

import { useState } from 'react';
import { useZxing } from 'react-zxing';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError: (error: Error) => void;
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(true);

  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
      setIsScanning(false);
    },
    onError(error) {
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error('Failed to access camera'));
      }
    },
  });

  return (
    <div className="relative">
      <video
        ref={ref}
        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
      />
      {!isScanning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <button
            onClick={() => setIsScanning(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
} 