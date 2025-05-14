import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCw } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (photoDataUrl: string) => void;
  photoDataUrl: string | null;
  isFormFilled: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, photoDataUrl, isFormFilled }) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const videoConstraints = {
    width: 720,
    height: 540,
    facingMode: "user"
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      capture();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
        setIsCapturing(false);
        setCountdown(null);
      }
    }
  }, [webcamRef, onCapture]);

  const startCapture = () => {
    setIsCapturing(true);
  };

  const startCountdown = () => {
    setCountdown(5);
  };

  const retake = () => {
    onCapture('');
    setIsCapturing(true);
    setCountdown(null);
  };

  return (
    <div className="flex flex-col items-center mb-6 w-full">
      <div className="rounded-lg overflow-hidden shadow-md bg-white w-full max-w-md border-2 border-gray-200 relative">
        {isCapturing ? (
          <>
            <div className="relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-auto rounded-lg"
              />
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">{countdown}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center my-3">
              <button
                onClick={startCountdown}
                disabled={countdown !== null}
                className={`py-2 px-4 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                  countdown !== null
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                aria-label="Take photo"
              >
                <Camera size={20} />
                {countdown !== null ? 'Taking photo...' : 'Take Photo'}
              </button>
            </div>
          </>
        ) : photoDataUrl ? (
          <div className="relative">
            <img src={photoDataUrl} alt="Captured" className="w-full h-auto rounded-lg" />
            <button
              onClick={retake}
              className="absolute bottom-4 right-4 p-2 bg-white text-blue-500 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300 flex items-center gap-1"
              aria-label="Retake photo"
            >
              <RotateCw size={18} /> Retake
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50">
            <Camera size={48} className="text-gray-400 mb-3" />
            <p className="text-gray-600 mb-4 text-center">Foto akan muncul disini</p>
            <button
              onClick={startCapture}
              disabled={!isFormFilled}
              className={`py-2 px-4 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                !isFormFilled
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              aria-label="Start camera"
            >
              <Camera size={20} />
              {isFormFilled ? 'Start Camera' : 'Fill form first'}
            </button>
            {!isFormFilled && (
              <p className="text-sm text-gray-500 mt-2">
                Please fill all required fields first
              </p>
            )}
          </div>
        )}
      </div>
      {photoDataUrl && (
        <p className="text-green-600 mt-2 flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Photo captured successfully
        </p>
      )}
    </div>
  );
};

export default WebcamCapture;