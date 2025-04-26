import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  Stack,
  CloseButton,
} from '@chakra-ui/react';

interface TripFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripForm: React.FC<TripFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    startTime: '',
    endTime: '',
    passengers: 1,
    activities: [] as string[],
    budget: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log(formData);
    onClose();
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
        <Heading size="lg" color="black" mb={6}>
          Plan Your Trip
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={4} align="stretch">
            <Box>
              <Text mb={2} color="black">Start Location</Text>
              <Input
                name="startLocation"
                value={formData.startLocation}
                onChange={handleInputChange}
                placeholder="Enter start location"
                required
              />
            </Box>

            <Box>
              <Text mb={2}>End Location</Text>
              <Input
                name="endLocation"
                value={formData.endLocation}
                onChange={handleInputChange}
                placeholder="Enter end location"
                required
              />
            </Box>

            <Box>
              <Text mb={2}>Start Time</Text>
              <Input
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text mb={2}>End Time</Text>
              <Input
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text mb={2}>Number of Passengers</Text>
              <Input
                name="passengers"
                type="number"
                min={1}
                max={10}
                value={formData.passengers}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text mb={2}>Activities</Text>
              <Stack gap={2}>
                <Box>
                  <input
                    type="checkbox"
                    id="shopping"
                    name="activities"
                    value="shopping"
                    onChange={(e) => {
                      const newActivities = e.target.checked
                        ? [...formData.activities, e.target.value]
                        : formData.activities.filter(a => a !== e.target.value);
                      setFormData(prev => ({ ...prev, activities: newActivities }));
                    }}
                  />
                  <label htmlFor="shopping"> Shopping</label>
                </Box>
                <Box>
                  <input
                    type="checkbox"
                    id="activities"
                    name="activities"
                    value="activities"
                    onChange={(e) => {
                      const newActivities = e.target.checked
                        ? [...formData.activities, e.target.value]
                        : formData.activities.filter(a => a !== e.target.value);
                      setFormData(prev => ({ ...prev, activities: newActivities }));
                    }}
                  />
                  <label htmlFor="activities"> Activities</label>
                </Box>
                <Box>
                  <input
                    type="checkbox"
                    id="food"
                    name="activities"
                    value="food"
                    onChange={(e) => {
                      const newActivities = e.target.checked
                        ? [...formData.activities, e.target.value]
                        : formData.activities.filter(a => a !== e.target.value);
                      setFormData(prev => ({ ...prev, activities: newActivities }));
                    }}
                  />
                  <label htmlFor="food"> Food</label>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Text mb={2}>Budget ($)</Text>
              <Input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Enter your budget"
                required
              />
            </Box>

            <Button
              type="submit"
              colorScheme="cyan"
              size="lg"
              width="full"
              mt={6}
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