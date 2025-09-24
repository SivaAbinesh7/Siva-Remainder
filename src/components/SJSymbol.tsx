import React from 'react';

interface SJSymbolProps {
  className?: string;
  size?: number;
}

const SJSymbol: React.FC<SJSymbolProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
    >
      {/* Custom SJ Symbol based on your uploaded image */}
      <path d="M20 25 L20 20 L45 20 L45 25 L35 25 L35 75 L35 80 L30 80 L30 75 L30 25 Z" />
      <path d="M50 35 C40 35 35 40 35 50 C35 60 40 65 50 65 L65 65 C70 65 75 70 75 75 C75 80 70 85 65 85 L50 85 L50 90 L65 90 C75 90 80 85 80 75 C80 65 75 60 65 60 L50 60 C45 60 40 55 40 50 C40 45 45 40 50 40 L65 40 L65 35 Z" />
      <circle cx="45" cy="15" r="3" />
    </svg>
  );
};

export default SJSymbol;