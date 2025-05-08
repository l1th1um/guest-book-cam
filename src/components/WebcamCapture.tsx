import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCw } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (photoDataUrl: string) => void;
  photoDataUrl: string | null;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, photoDataUrl }) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const webcamRef = useRef<Webcam | null>(null);

  const videoConstraints = {
    width: 720,
    height: 540,
    facingMode: "user"
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
        setIsCapturing(false);
      }
    }
  }, [webcamRef, onCapture]);

  const startCapture = () => {
    setIsCapturing(true);
  };

  const retake = () => {
    onCapture('');
    setIsCapturing(true);
  };

  return (
    <div className="flex flex-col items-center mb-6 w-full">
      <div className="rounded-lg overflow-hidden shadow-md bg-white w-full max-w-md border-2 border-gray-200 relative">
        {isCapturing ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-auto rounded-lg"
            />
            <div className="flex justify-center my-3">
              <button
                onClick={capture}
                className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
                aria-label="Take photo"
              >
                <Camera size={20} />
                Take Photo
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
            <p className="text-gray-600 mb-4 text-center">Your photo will appear here</p>
            <button
              onClick={startCapture}
              className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
              aria-label="Start camera"
            >
              <Camera size={20} />
              Start Camera
            </button>
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