import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { CameraIcon, BluetoothIcon, FlashlightOnIcon, FlashlightOffIcon, ShareIcon } from './icons';
import Spinner from './Spinner';

interface NearbyUsersViewProps {
  onSelectUser: (user: User) => void;
  onNavigateToCamera: () => void;
}

export const NearbyUsersView: React.FC<NearbyUsersViewProps> = ({ onSelectUser, onNavigateToCamera }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<User[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);


  // Cleanup flashlight on component unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [mediaStream]);

  const handleToggleFlashlight = async () => {
    if (isFlashlightOn && mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
        setIsFlashlightOn(false);
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        const track = stream.getVideoTracks()[0];
        
        // Check if torch is supported
        const capabilities = track.getCapabilities();
        // @ts-ignore: `torch` is not in standard capabilities type but is widely used
        if (!capabilities.torch) {
            alert("دستگاه شما از چراغ قوه پشتیبانی نمیکند.");
            track.stop();
            return;
        }

        // @ts-ignore
        await track.applyConstraints({ advanced: [{ torch: true }] });
        setMediaStream(stream);
        setIsFlashlightOn(true);
    } catch (err) {
        console.error("Error toggling flashlight:", err);
        alert("امکان دسترسی به دوربین برای فعالسازی چراغ قوه وجود ندارد.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'برنامه «کنار»',
      text: 'بیا با هم با «کنار» وصل بشیم!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(shareData.url);
        setShowCopyConfirm(true);
        setTimeout(() => setShowCopyConfirm(false), 2000); // Hide message after 2 seconds
      } catch (err) {
        console.error('Failed to copy URL:', err);
        alert('امکان کپی کردن لینک وجود ندارد. لطفا آدرس را به صورت دستی کپی کنید.');
      }
    }
  };


  const handleScan = async () => {
    if (!navigator.bluetooth) {
      setError("مرورگر شما از بلوتوث وب پشتیبانی نمی کند.");
      return;
    }
    setError(null);
    setIsScanning(true);
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      if (!foundDevices.some(d => d.id === device.id)) {
        const newUser: User = {
          id: device.id,
          name: device.name || `دستگاه ${device.id.substring(0, 4)}`,
          bluetoothName: device.name || 'دستگاه بلوتوثی ناشناس',
          avatar: `https://i.pravatar.cc/100?u=${device.id}`,
        };
        setFoundDevices(prev => [...prev, newUser]);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotFoundError') {
        setError("هیچ دستگاهی انتخاب نشد. برای تلاش مجدد روی رادار بزنید.");
      } else {
        console.error('Bluetooth scan failed:', err);
        setError("اسکن دستگاه ناموفق بود. از روشن بودن بلوتوث اطمینان حاصل کنید.");
      }
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleConnect = (user: User) => {
    setConnectingId(user.id);
    setTimeout(() => {
        setConnectedIds(prev => new Set(prev).add(user.id));
        setConnectingId(null);
    }, 1500);
  };

  const renderStatusText = () => {
    if (isScanning) {
      return <p className="text-lg text-purple-300/80 animate-pulse">در حال جستجو...</p>;
    }
    if (error) {
        return <p className="text-lg text-red-400/90">{error}</p>;
    }
    if (foundDevices.length === 0) {
        return <p className="text-lg text-gray-400">برای شروع، روی رادار بزنید</p>;
    }
    return <p className="text-lg text-gray-300">دستگاه های یافت شده</p>;
  }

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-start overflow-hidden">
      {/* AppBar */}
      <header className="w-full p-2 flex justify-between items-center z-20 bg-gray-900 shadow-md">
        <div className="flex items-center space-x-1">
          <button onClick={handleToggleFlashlight} className={`material-button text-white p-3 rounded-full ${isFlashlightOn ? 'text-yellow-300 animate-pulse-subtle' : ''}`}>
             {isFlashlightOn ? <FlashlightOnIcon className="w-6 h-6"/> : <FlashlightOffIcon className="w-6 h-6" />}
          </button>
          <button onClick={handleShare} className="material-button text-white p-3 rounded-full relative">
              <ShareIcon className="w-6 h-6" />
              {showCopyConfirm && (
                  <span className="absolute -top-8 -left-8 bg-purple-600 text-white text-xs whitespace-nowrap px-2 py-1 rounded-md shadow-lg">
                      لینک کپی شد!
                  </span>
              )}
          </button>
        </div>
        <h1 className="text-xl font-medium text-white tracking-wider">رادار کنار</h1>
        <button onClick={onNavigateToCamera} className="material-button text-white p-3 rounded-full">
          <CameraIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Radar */}
      <div 
        onClick={handleScan}
        className="relative w-[220px] h-[220px] md:w-[250px] md:h-[250px] flex-shrink-0 flex items-center justify-center my-6 cursor-pointer group"
        aria-label="Scan for new devices"
        role="button"
      >
        <div className="absolute inset-0 rounded-full border border-purple-500/20"></div>
        <div className="absolute inset-0 rounded-full border border-purple-500/20 scale-75"></div>
        <div className="absolute inset-0 rounded-full border border-purple-500/20 scale-50"></div>
        <div className="absolute inset-0 rounded-full border border-purple-500/20 scale-25"></div>
        <div className="absolute w-full h-px bg-purple-500/20"></div>
        <div className="absolute h-full w-px bg-purple-500/20"></div>
        {isScanning && (
            <div className="absolute inset-0 w-full h-full radar-sweep-animation" style={{ transformOrigin: 'center' }}>
                <div className="absolute top-0 left-1/2 -ml-px h-1/2 w-[2px] bg-gradient-to-b from-purple-400/70 to-transparent"></div>
            </div>
        )}
         <BluetoothIcon className={`w-16 h-16 text-purple-400/70 transition-all duration-300 group-hover:scale-110 ${isScanning ? 'opacity-100 animate-pulse' : 'opacity-50 group-hover:opacity-80'}`} />
      </div>

      <div className="text-center z-10 mb-4 px-4 h-6">
        {renderStatusText()}
      </div>
      
      {/* Device List */}
      <div className="w-full max-w-md flex-grow overflow-y-auto pb-4 px-4">
        <div className="space-y-3">
            {foundDevices.map(user => {
                const isConnected = connectedIds.has(user.id);
                const isConnecting = connectingId === user.id;

                return (
                    <div key={user.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between transition-all duration-300">
                        {isConnected ? (
                            <>
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                                <span className="text-lg font-medium text-white flex-grow text-right mr-4">{user.name}</span>
                                <button 
                                    onClick={() => onSelectUser(user)}
                                    className="material-button bg-purple-600 text-white px-5 h-10 rounded-full font-medium text-sm tracking-wider uppercase"
                                >
                                    چت
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="p-2 bg-blue-500/20 rounded-full">
                                    <BluetoothIcon className="w-7 h-7 text-blue-400" />
                                </div>
                                <span className="text-base text-gray-300 flex-grow text-right mr-4">{user.bluetoothName}</span>
                                <button
                                    onClick={() => handleConnect(user)}
                                    disabled={isConnecting}
                                    className="material-button bg-blue-600 text-white px-4 h-10 w-32 text-center rounded-full font-medium text-sm uppercase tracking-wider disabled:bg-gray-600 flex items-center justify-center"
                                >
                                    {isConnecting ? <Spinner size={4}/> : 'اتصال'}
                                </button>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};