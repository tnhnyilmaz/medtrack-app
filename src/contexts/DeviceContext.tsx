import React, { createContext, useContext, useEffect, useState } from 'react';

type DeviceContextType = {
  deviceName: string | null;
  isConnected: boolean;
  connectDevice: (deviceName: string) => void;
  disconnectDevice: () => void;
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectDevice = (name: string) => {
    setDeviceName(name);
    setIsConnected(true);
    console.log(`✓ Cihaz Bağlandı: ${name}`);
  };

  const disconnectDevice = () => {
    console.log(`✗ Cihaz Bağlantısı Kesildi: ${deviceName}`);
    setDeviceName(null);
    setIsConnected(false);
  };

  return (
    <DeviceContext.Provider
      value={{ deviceName, isConnected, connectDevice, disconnectDevice }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within DeviceProvider');
  }
  return context;
}
