import React, { useEffect, useRef } from 'react';
import { Input } from '@chakra-ui/react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder,
  name,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = initializeAutocomplete;
    } else {
      initializeAutocomplete();
    }

    function initializeAutocomplete() {
      if (inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['geocode'],
            componentRestrictions: { country: 'us' },
          }
        );

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address);
          } else if (place.name) {
            onChange(place.name);
          }
        });
      }
    }

    return () => {
      if (autocompleteRef.current) {
        autocompleteRef.current = null;
      }
    };
  }, [onChange]);

  return (
    <Input
      ref={inputRef}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      _placeholder={{ color: 'gray.400' }}
      color="black"
      fontFamily="mono"
      required
    />
  );
};
