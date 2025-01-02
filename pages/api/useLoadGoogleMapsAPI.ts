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
      script.onload = () => {
        setIsLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load the Google Maps API script.");
      };
      document.head.appendChild(script);
    } else if (window.google) {
      // Ensure Google Maps is available
      setIsLoaded(true);
    }
  }, [apiKey, libraries]);

  return isLoaded;
};
