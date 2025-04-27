import React, { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Text,
  Stack,
  CloseButton,
  HStack,
} from '@chakra-ui/react';
import { LocationInput } from './LocationInput/LocationInput'; // Make sure you have this file

interface TripFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  passengers: number;
  activities: string[];
  budget: string;
}

export const TripForm: React.FC<TripFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    startLocation: '',
    endLocation: '',
    startDate: '',
    endDate: '',
    passengers: 1,
    activities: [],
    budget: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'passengers' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate budget
      if (!['1', '2', '3', '4'].includes(formData.budget)) {
        throw new Error('Please select a valid budget level (1-4)');
      }

      // Convert activities to tripVibe
      const tripVibe = formData.activities.includes('food') ? 'foodie' :
                      formData.activities.includes('nature') ? 'explorer' :
                      formData.activities.includes('shopping') ? 'shopper' : 'explorer';

      const response = await fetch('http://localhost:4000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          startLocation: formData.startLocation,
          endLocation: formData.endLocation,
          budget: formData.budget.toString(),
          tripVibe,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          passengers: formData.passengers,
          activities: formData.activities
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create trip');
      }

      const data = await response.json();
      console.log('Trip created:', data);
      onClose();
    } catch (error: any) {
      console.error('Error creating trip:', error);
      alert(error.message || 'Failed to create trip. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        maxW="2xl"
        w="full"
        maxH="90vh"
        overflowY="auto"
        position="relative"
      >
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={onClose}
        />
        <Heading size="xl" color="cyan.600" mb={6}>
          Plan Your Trip
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap={4} align="stretch">

            {/* Start Location */}
            <Box>
              <Text mb={2} color="black" fontFamily="mono">Start Location</Text>
              <LocationInput
                name="startLocation"
                value={formData.startLocation}
                onChange={(value) => setFormData((prev) => ({ ...prev, startLocation: value }))}
                placeholder="Enter start location"
              />
            </Box>

            {/* End Location */}
            <Box>
              <Text mb={2} color="black" fontFamily="mono">End Location</Text>
              <LocationInput
                name="endLocation"
                value={formData.endLocation}
                onChange={(value) => setFormData((prev) => ({ ...prev, endLocation: value }))}
                placeholder="Enter end location"
              />
            </Box>

            {/* Start Time */}
            <Box>
              <Text mb={2} color="black" fontFamily="mono">Start Date</Text>
              <input
                type="datetime-local"
                color="black"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                style={{ 
                  fontFamily: 'Space Mono', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid lightgray', 
                  width: '100%',
                  backgroundColor: 'white',
                  color: 'black'
                }}
                required
              />
            </Box>

            {/* End Time */}
            <Box>
              <Text mb={2} color="black" fontFamily="mono">End Date</Text>
              <input
                type="datetime-local"
                color="black"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                style={{ 
                  fontFamily: 'Space Mono', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid lightgray', 
                  width: '100%',
                  backgroundColor: 'white',
                  color: 'black'
                }}
                required
              />
            </Box>

            {/* Number of Passengers */}
            <Box>
              <Text mb={2} color="black" fontFamily="mono">Number of Passengers</Text>
              <input
                type="number"
                name="passengers"
                color="black"
                min={1}
                max={10}
                value={formData.passengers}
                onChange={handleInputChange}
                style={{ 
                  fontFamily: 'Space Mono', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid lightgray', 
                  width: '100%',
                  backgroundColor: 'white',
                  color: 'black'
                }}
                required
              />
            </Box>

            {/* Activities */}
            <Box>
              <Text mb={2} color="black" fontFamily="mono">Activities</Text>
              <Stack gap={2}>
                {['shopping', 'nature', 'food'].map((activity) => (
                  <Box key={activity}>
                    <input
                      type="checkbox"
                      id={activity}
                      name="activities"
                      value={activity}
                      onChange={(e) => {
                        const newActivities = e.target.checked
                          ? [...formData.activities, e.target.value]
                          : formData.activities.filter(a => a !== e.target.value);
                        setFormData((prev) => ({ ...prev, activities: newActivities }));
                      }}
                    />
                    <label htmlFor={activity} style={{ fontFamily: 'Space Mono', color: 'black', fontSize: '14px' }}>
                      {' '}{activity.charAt(0).toUpperCase() + activity.slice(1)}
                    </label>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Budget */}
            <Box>
              <Text mb={2} color="black" fontFamily="mono">Price Point</Text>
              <HStack gap={2}>
                {[1, 2, 3, 4].map((level) => (
                  <Button
                    key={level}
                    variant="outline"
                    colorScheme="cyan"
                    bg={formData.budget === level.toString() ? 'cyan.600' : 'gray.50'}
                    color={formData.budget === level.toString() ? 'white' : 'cyan.600'}
                    _hover={{
                      bg: formData.budget === level.toString() ? 'cyan.600' : 'cyan.50',
                      border: '0px'
                    }}
                    onClick={() => setFormData((prev) => ({ ...prev, budget: level.toString() }))}
                    fontFamily="mono"
                  >
                    {'$'.repeat(level)}
                  </Button>
                ))}
              </HStack>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="cyan"
              size="lg"
              width="full"
              mt={4}
              fontSize="xl"
              fontFamily="mono"
              border="0px"
              color="white"
              bg="cyan.600"
              h="50px"
              boxShadow="sm"
              _hover={{
                transform: 'translateY(-2px)',
                bg: 'cyan.700'
              }}
              transition="all 0.2s"
            >
              Plan Trip
            </Button>

          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default TripForm;
