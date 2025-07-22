
import React from 'react';

const Spinner: React.FC<{ size?: number }> = ({ size = 8 }) => {
  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-white`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    ></div>
  );
};

export default Spinner;
