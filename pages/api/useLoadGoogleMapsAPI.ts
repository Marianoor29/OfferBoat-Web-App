import { useState, useEffect } from "react";

export const useLoadGoogleMapsAPI = (apiKey: string, libraries: string[]) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(",")}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, [apiKey, libraries]);

  return isLoaded;
};
