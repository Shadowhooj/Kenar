import React, { useState } from 'react';
import { BluetoothIcon, LocationIcon } from './icons';
import Spinner from './Spinner';

// Augment the Navigator interface to include the Web Bluetooth API property.
// This is necessary because the standard TypeScript DOM library does not
// include this experimental API by default.
declare global {
  interface Navigator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bluetooth: any;
  }
}

interface PermissionsViewProps {
  onGranted: () => void;
}

export const PermissionsView: React.FC<PermissionsViewProps> = ({ onGranted }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleGrantAccess = async () => {
    setIsRequesting(true);
    try {
        // Check for API support
        if (!navigator.geolocation) {
            alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی کند.");
            setIsRequesting(false);
            return;
        }
        if (!navigator.bluetooth) {
            alert("مرورگر شما از بلوتوث وب پشتیبانی نمی کند. لطفا از کروم در دسکتاپ یا اندروید استفاده کنید.");
            setIsRequesting(false);
            return;
        }

        // 1. Request Location Permission. It's often a prerequisite for Bluetooth scanning.
        await new Promise<void>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Location permission granted:', position);
                    resolve();
                },
                (error) => {
                    // This will be caught by the outer try-catch block
                    reject(error);
                }
            );
        });

        // 2. Request Bluetooth Permission. This triggers a device chooser prompt.
        // Granting permission here allows the app to scan for devices.
        console.log('Requesting Bluetooth device...');
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
        });
        console.log('Bluetooth permission granted for device:', device.name);
        
        // If we reach here, both permissions were granted.
        onGranted();

    } catch (error) {
        let message = 'برای استفاده از برنامه، دسترسی ها ضروری است. لطفا صفحه را رفرش کرده و دوباره تلاش کنید.';
        if (error instanceof DOMException && (error.name === 'User-cancelled' || error.name === 'NotFoundError')) {
             message = 'شما درخواست دسترسی بلوتوث را لغو کردید. برای ادامه، لطفا دسترسی را تایید کنید.';
        } else if (error instanceof GeolocationPositionError) {
             message = 'دسترسی به موقعیت مکانی رد شد. این دسترسی برای پیدا کردن دستگاه های بلوتوث لازم است.';
        }
        console.error('Permission request failed:', error);
        alert(message);
        setIsRequesting(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">دسترسی های مورد نیاز</h1>
        <p className="text-gray-300 mb-8">
          برای پیدا کردن دوستان در نزدیکی شما، «کنار» به دسترسی های زیر نیاز دارد:
        </p>

        <div className="space-y-6 text-right mb-12">
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="flex-shrink-0 bg-purple-500/20 p-3 rounded-full">
              <LocationIcon className="w-7 h-7 text-purple-300" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">موقعیت مکانی</h2>
              <p className="text-gray-400">
                برای اسکن دستگاه های بلوتوث در اطراف شما لازم است. ما موقعیت شما را ذخیره نمیکنیم.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="flex-shrink-0 bg-blue-500/20 p-3 rounded-full">
              <BluetoothIcon className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">بلوتوث</h2>
              <p className="text-gray-400">
                برای اتصال به سایر کاربران و شروع چت استفاده می شود.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGrantAccess}
          disabled={isRequesting}
          className="material-button w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-4 px-4 rounded-full transition-colors duration-300 flex items-center justify-center"
        >
          {isRequesting ? (
            <>
              <Spinner size={6} />
              <span className="mr-3">در حال درخواست...</span>
            </>
          ) : (
            'ادامه و اعطای دسترسی'
          )}
        </button>
      </div>
    </div>
  );
};