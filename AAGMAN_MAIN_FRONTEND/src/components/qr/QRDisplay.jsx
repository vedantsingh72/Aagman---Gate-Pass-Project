import { QRCodeSVG } from 'qrcode.react';

/**
 * QRDisplay Component
 * Displays QR code for approved passes
 * 
 * @param {Object} props
 * @param {string} props.qrCode - QR code string to display
 * @param {string} props.passId - Pass ID (optional)
 */
const QRDisplay = ({ qrCode, passId }) => {
  if (!qrCode) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">QR code not available</p>
        <p className="text-sm text-gray-400 mt-2">
          Pass must be approved to generate QR code
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Your Gate Pass QR Code</h3>
      <div className="bg-white p-4 rounded border-2 border-gray-200">
        <QRCodeSVG value={qrCode} size={200} />
      </div>
      {passId && (
        <p className="text-sm text-gray-500 mt-4">Pass ID: {passId}</p>
      )}
      <p className="text-xs text-gray-400 mt-2 text-center max-w-xs">
        Show this QR code at the gate for entry/exit
      </p>
    </div>
  );
};

export default QRDisplay;

