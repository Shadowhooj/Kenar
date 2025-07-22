import React from 'react';

// Material Design: flip_camera_android
export const CameraFlipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.47 13.47L9 12v3.53l-1.53-1.53c-.31-.31-.85-.09-.85.35v1.29c0 .28.22.5.5.5h3.79l-1.53 1.53c-.31.31-.09.85.35.85h1.29c.28 0 .5-.22.5-.5v-3.79l1.53 1.53c.31.31.85.09.85-.35v-1.29c0-.28-.22-.5-.5-.5h-3.79l1.53-1.53c.31-.31.09-.85-.35-.85h-1.29c-.28 0-.5.22-.5.5v3.79L9 12c0-.44-.54-.66-.85-.35zM20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </svg>
);

// Material Design: chat_bubble
export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);

// Material Design: send
export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z" />
  </svg>
);

// Material Design: arrow_forward_ios (repurposed for RTL back)
export const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"/>
  </svg>
);

// Material Design: auto_awesome
export const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9c-.47 0-.92.12-1.32.32l-3-3c.2-.4.32-.85.32-1.32 0-1.1-.9-2-2-2s-2 .9-2 2c0 .47.12.92.32 1.32l-3 3c-.4-.2-.85-.32-1.32-.32-1.1 0-2 .9-2 2s.9 2 2 2c.47 0 .92-.12 1.32-.32l3 3c-.2.4-.32.85-.32 1.32 0 1.1.9 2 2 2s2-.9 2-2c0-.47-.12-.92-.32-1.32l3-3c.4.2.85.32 1.32.32 1.1 0 2-.9 2-2s-.9-2-2-2zM5 11c-.47 0-.92-.12-1.32-.32l-3-3C.48 7.28.6 6.83.6 6.36c0-1.1.9-2 2-2s2 .9 2 2c0 .47-.12.92-.32 1.32l3 3c.4-.2.85-.32 1.32-.32.55 0 1.05.22 1.41.59L17 5.41c-.37-.37-.59-.86-.59-1.41 0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2c-.55 0-1.05-.22-1.41-.59L9.59 13A2.99 2.99 0 0 1 5 11z" />
    </svg>
);

// Material Design: close
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
);

// Material Design: photo_camera
export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3.2"/>
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
);

// Material Design: location_on
export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);

// Material Design: bluetooth
export const BluetoothIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
    </svg>
);

// Material Design: flashlight_off
export const FlashlightOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 5.27L3.28 4L20 20.72L18.73 22l-4.73-4.73V19H10v-5.73L3.73 7H2v-1.73zM18 5V2h-4v3h4zM14 7h-4l4-4h4v3c-1.3 0-2.4.84-2.82 2h-1.18zM6 2h8v2H6V2z"/>
  </svg>
);

// Material Design: flashlight_on
export const FlashlightOnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 2h12v3H6zm12 5H6v14h12V7zm-5 12h-2v-7h2v7z"/>
  </svg>
);

// Material Design: share
export const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);