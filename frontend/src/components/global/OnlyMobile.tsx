// src/components/global/OnlyMobile.tsx
import React, { useEffect, useState } from 'react';

const OnlyMobile: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-center p-4">
        <p className="text-xl font-semibold text-gray-700">
          Este app está disponível apenas para dispositivos móveis.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnlyMobile;
