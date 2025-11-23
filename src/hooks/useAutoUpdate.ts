import { useState, useEffect } from 'react';
import { BUILD_VERSION } from '../version';

export const useAutoUpdate = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(`/nikke-pvp/version.json?t=${new Date().getTime()}`);
        if (!response.ok) return;
        
        const data = await response.json();
        if (data.version && data.version !== BUILD_VERSION) {
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    checkVersion();
  }, []);

  const reload = () => {
    window.location.reload();
  };

  return { isUpdateAvailable, reload };
};
