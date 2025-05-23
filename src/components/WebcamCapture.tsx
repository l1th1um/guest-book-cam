import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCw } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

interface WebcamCaptureProps {
  onCapture: (photoDataUrl: string) => void;
  photoDataUrl: string | null;
  isFormFilled: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, photoDataUrl, isFormFilled }) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const webcamRef = useRef<Webcam | null>(null);

  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: "user",
    aspectRatio: 16/9,
    frameRate: { ideal: 30, max: 60 },
    resizeMode: 'none'
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

  const processImage = async (imageSrc: string): Promise<string> => {
    try {
      const blob = await fetch(imageSrc).then(res => res.blob());
      const processedBlob = await removeBackground(blob, {
        debug: false,
        progress: (progress) => {
          console.log('Progress:', progress);
        },
      });
      return URL.createObjectURL(processedBlob);
    } catch (error) {
      console.error('Error removing background:', error);
      return imageSrc; // Fallback to original image
    }
  };

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      setIsProcessing(true);
      const imageSrc = webcamRef.current.getScreenshot({
        width: 1920,
        height: 1080
      });
      
      if (imageSrc) {
        try {
          const processedImage = await processImage(imageSrc);
          onCapture(processedImage);
        } catch (error) {
          console.error('Error processing image:', error);
          onCapture(imageSrc); // Fallback to original image if processing fails
        }
      }
      
      setIsCapturing(false);
      setCountdown(null);
      setIsProcessing(false);
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
                screenshotFormat="image/png"
                videoConstraints={videoConstraints}
                className="w-full h-auto rounded-lg"
                imageSmoothing={true}
                minScreenshotWidth={1920}
                minScreenshotHeight={1080}
                screenshotQuality={1}
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
                disabled={countdown !== null || isProcessing}
                className={`py-2 px-4 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                  countdown !== null || isProcessing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                aria-label="Take photo"
              >
                <Camera size={20} />
                {isProcessing ? 'Processing...' : countdown !== null ? 'Taking photo...' : 'Take Photo'}
              </button>
            </div>
          </>
        ) : photoDataUrl ? (
          <div className="relative">
            <img
              src={photoDataUrl}
              alt="Captured"
              className="w-full h-auto rounded-lg"
              style={{ imageRendering: 'high-quality' }}
            />
            <button
              onClick={retake}
              className="absolute bottom-4 right-4 p-2 bg-white text-blue-500 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300 flex items-center gap-1"
              aria-label="Retake photo"
            >
              <RotateCw size={18} /> Foto Lagi
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
              aria-label="Mulai"
            >
              <Camera size={20} />
              {isFormFilled ? 'Mulai' : 'Isi Form terlebih dahulu'}
            </button>
            {!isFormFilled && (
              <p className="text-sm text-gray-500 mt-2">
                 Isi form terlebih dahulu sebelum menggunakan kamera.
              </p>
            )}
          </div>
        )}
      </div>
      {photoDataUrl && (
        <p className="text-green-600 mt-2 flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Foto berhasil diambil
        </p>
      )}
    </div>
  );
};

export default WebcamCapture;