import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * QRScanner Component
 * Scans QR codes using device camera
 * 
 * @param {Object} props
 * @param {Function} props.onScanSuccess - Callback when QR is scanned successfully
 * @param {Function} props.onScanError - Callback when scan fails
 */
const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((err) => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setScanning(true);

      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanning();
        },
        (errorMessage) => {
        }
      );
    } catch (err) {
      setError('Failed to start camera. Please check permissions.');
      setScanning(false);
      if (onScanError) onScanError(err);
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
      setScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div
        id="qr-reader"
        className="w-full max-w-md mb-4 rounded-lg overflow-hidden"
      ></div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {!scanning ? (
          <button
            onClick={startScanning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;

