import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const useSaveLocation = () => {
  const location = useLocation();

  useEffect(() => {
    // Save the current location (route) to localStorage or sessionStorage
    sessionStorage.setItem('lastRoute', location.pathname);
  }, [location]);
};

export default useSaveLocation;
