import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  Stack,
  CloseButton,
  HStack,
} from '@chakra-ui/react';

interface TripFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  passengers: number;
  activities: string[];
  budget: string;
}

export const TripForm: React.FC<TripFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    startLocation: '',
    endLocation: '',
    startTime: '',
    endTime: '',
    passengers: 1,
    activities: [],
    budget: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
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
        <Heading size="xl" color="cyan.600" mb={6}>
          Plan Your Trip
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={4} align="stretch">
            <Box>
              <Text mb={2} color="black" fontFamily="mono">Start Location</Text>
              <Input
                name="startLocation"
                fontFamily="mono"
                color="black" 
                value={formData.startLocation}
                onChange={handleInputChange}
                placeholder="Enter start location"
                required
              />
            </Box>

            <Box>
              <Text mb={2} color="black" fontFamily="mono">End Location</Text>
              <Input
                name="endLocation"
                fontFamily="mono"
                color="black"
                value={formData.endLocation}
                onChange={handleInputChange}
                placeholder="Enter end location"
                required
              />
            </Box>

            <Box>
              <Text mb={2} color="black" fontFamily="mono">Start Time</Text>
              <Input
                name="startTime"
                fontFamily="mono"
                type="datetime-local"
                color="black"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text mb={2} color="black" fontFamily="mono">End Time</Text>
              <Input
                name="endTime"
                fontFamily="mono"
                type="datetime-local"
                color="black"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text mb={2} color="black" fontFamily="mono">Number of Passengers</Text>
              <Input
                name="passengers"
                fontFamily="mono"
                type="number"
                color="black"
                min={1}
                max={10}
                value={formData.passengers}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text mb={2} color="black" fontFamily="mono">Activities</Text>
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
                      setFormData((prev: FormData) => ({ ...prev, activities: newActivities }));
                    }}
                  />
                  <label htmlFor="shopping" style={{ fontFamily: 'Space Mono', color: 'black', fontSize: '14px' }}> Shopping</label>
                </Box>
                <Box>
                  <input
                    type="checkbox"
                    id="activities"
                    name="activities"
                    value="nature"
                    onChange={(e) => {
                      const newActivities = e.target.checked
                        ? [...formData.activities, e.target.value]
                        : formData.activities.filter(a => a !== e.target.value);
                      setFormData((prev: FormData) => ({ ...prev, activities: newActivities }));
                    }}
                  />
                  <label htmlFor="activities" style={{ fontFamily: 'Space Mono', color: 'black', fontSize: '14px' }}> Nature</label>
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
                      setFormData((prev: FormData) => ({ ...prev, activities: newActivities }));
                    }}
                  />
                  <label htmlFor="food" style={{ fontFamily: 'Space Mono', color: 'black', fontSize: '14px' }}> Food</label>
                </Box>
              </Stack>
            </Box>

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
                    onClick={() => setFormData((prev: FormData) => ({ ...prev, budget: level.toString() }))}
                    fontFamily="mono"
                  >
                    {'$'.repeat(level)}
                  </Button>
                ))}
              </HStack>
            </Box>

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