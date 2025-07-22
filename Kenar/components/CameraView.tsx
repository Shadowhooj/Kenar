import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateCaptionsForImage } from '../services/geminiService';
import { ChatIcon, CameraFlipIcon, WandIcon, SendIcon, CloseIcon } from './icons';
import Spinner from './Spinner';
import type { User } from '../types';

interface CameraViewProps {
  onNavigateToNearby: () => void;
  onSendPhoto: (photoDataUrl: string, caption: string) => void;
  hasActiveChat: boolean;
  activeChatUser: User | null;
}

export const CameraView: React.FC<CameraViewProps> = ({ onNavigateToNearby, onSendPhoto, hasActiveChat, activeChatUser }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [suggestedCaptions, setSuggestedCaptions] = useState<string[]>([]);
  const [finalCaption, setFinalCaption] = useState('');

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("امکان دسترسی به دوربین وجود ندارد. لطفا دسترسی لازم را بدهید.");
    }
  }, [facingMode]);
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
        stopCamera();
    };
  }, [startCamera]);

  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for user-facing camera
        if (facingMode === 'user') {
            context.scale(-1, 1);
            context.drawImage(video, -video.videoWidth, 0, video.videoWidth, video.videoHeight);
        } else {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        }
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleGenerateCaptions = async () => {
    if (!capturedImage) return;
    setIsGeneratingCaptions(true);
    setSuggestedCaptions([]);
    const captions = await generateCaptionsForImage(capturedImage);
    setSuggestedCaptions(captions);
    setFinalCaption(captions[0] || '');
    setIsGeneratingCaptions(false);
  };
  
  const handleRetake = () => {
    setCapturedImage(null);
    setSuggestedCaptions([]);
    setFinalCaption('');
    startCamera();
  };
  
  const handleSend = () => {
    if (capturedImage) {
        onSendPhoto(capturedImage, finalCaption);
    }
  };


  if (capturedImage) {
    return (
      <div className="relative h-full w-full bg-black flex flex-col items-center justify-center">
        <img src={capturedImage} alt="Captured" className="max-h-full max-w-full object-contain" />
        <canvas ref={canvasRef} className="hidden" />

        <button onClick={handleRetake} className="material-button absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white">
            <CloseIcon className="w-7 h-7"/>
        </button>

        <div className="absolute bottom-0 w-full p-4 flex flex-col items-center">
            {suggestedCaptions.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {suggestedCaptions.map((cap, index) => (
                        <button key={index} onClick={() => setFinalCaption(cap)} className={`material-button text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm transition ${finalCaption === cap ? 'bg-purple-600' : 'bg-black/50 hover:bg-black/70'}`}>
                            {cap}
                        </button>
                    ))}
                </div>
            )}
            
            {isGeneratingCaptions && (
                <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4 bg-black/60 p-3 rounded-full">
                    <Spinner size={5} />
                    <p className="text-white">در حال ساخت کپشن...</p>
                </div>
            )}

            <div className="w-full max-w-md flex items-center space-x-3 space-x-reverse relative">
                <input
                    type="text"
                    value={finalCaption}
                    onChange={(e) => setFinalCaption(e.target.value)}
                    placeholder="یک کپشن بنویس..."
                    className="flex-grow bg-gray-800 text-white placeholder-gray-400 rounded-full py-3 pl-14 pr-5 border-2 border-transparent focus:outline-none focus:border-purple-500"
                />
                 <button onClick={handleGenerateCaptions} disabled={isGeneratingCaptions} className="material-button absolute left-2 p-2 bg-purple-600 rounded-full text-white disabled:bg-gray-500 transition-colors">
                    <WandIcon className="w-6 h-6"/>
                </button>
            </div>
            {activeChatUser && <p className="text-center text-sm mt-2 text-gray-300">ارسال به {activeChatUser.name}</p>}
        </div>
         {/* Floating Action Button (FAB) for Send */}
        <button onClick={handleSend} className="material-button absolute bottom-24 right-5 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-400 transition-colors">
            <SendIcon className="w-7 h-7 text-white"/>
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)' }}></video>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="absolute inset-0 flex flex-col justify-between p-5 bg-black/10">
        <div className="flex justify-start">
            <button onClick={handleFlipCamera} className="material-button bg-black/40 p-3 rounded-full text-white">
                <CameraFlipIcon className="w-7 h-7" />
            </button>
        </div>

        <div className="flex items-center justify-center pb-4">
            <div className="flex items-center justify-around w-full max-w-xs">
                <button onClick={onNavigateToNearby} className="material-button bg-black/40 p-4 rounded-full text-white relative">
                    <ChatIcon className="w-8 h-8" />
                    {hasActiveChat && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-black"></span>}
                </button>
                <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-transparent border-4 border-white flex items-center justify-center material-button">
                    <div className="w-16 h-16 rounded-full bg-white/90"></div>
                </button>
                {/* Placeholder for symmetry */}
                <div className="w-20 h-16"></div> 
            </div>
        </div>
      </div>
    </div>
  );
};