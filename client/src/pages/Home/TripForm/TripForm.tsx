import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  Text,
  Stack,
  CloseButton,
  HStack,
  Input,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { LocationInput } from './LocationInput/LocationInput'; // Make sure you have this file
import { DeleteIcon } from '@chakra-ui/icons';
import { useDebounce } from '../../../hooks/useDebounce';

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
  additionalUsers: string[];
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
    additionalUsers: [],
  });

  const [newUserEmail, setNewUserEmail] = useState('');
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message: string;
    checking: boolean;
  }>({
    isValid: false,
    message: '',
    checking: false,
  });

  const debouncedEmail = useDebounce(newUserEmail, 500);

  useEffect(() => {
    const validateEmail = async () => {
      if (!debouncedEmail) {
        setEmailValidation({
          isValid: false,
          message: '',
          checking: false,
        });
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(debouncedEmail)) {
        setEmailValidation({
          isValid: false,
          message: 'Please enter a valid email address',
          checking: false,
        });
        return;
      }

      setEmailValidation(prev => ({ ...prev, checking: true }));

      try {
        const response = await fetch(`http://localhost:4000/api/users/check/${encodeURIComponent(debouncedEmail)}`);
        const data = await response.json();

        if (data.exists) {
          setEmailValidation({
            isValid: true,
            message: 'User found',
            checking: false,
          });
        } else {
          setEmailValidation({
            isValid: false,
            message: 'User not found',
            checking: false,
          });
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setEmailValidation({
          isValid: false,
          message: 'Error checking user',
          checking: false,
        });
      }
    };

    validateEmail();
  }, [debouncedEmail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'passengers' ? Number(value) : value,
    }));
  };

  const handleAddUser = () => {
    if (newUserEmail && formData.additionalUsers.length < 10 && emailValidation.isValid) {
      setFormData(prev => ({
        ...prev,
        additionalUsers: [...prev.additionalUsers, newUserEmail]
      }));
      setNewUserEmail('');
      setEmailValidation({
        isValid: false,
        message: '',
        checking: false,
      });
    }
  };

  const handleRemoveUser = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalUsers: prev.additionalUsers.filter((_, i) => i !== index)
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

      const tripData = {
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        budget: formData.budget.toString(),
        tripVibe,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        passengers: formData.passengers,
        activities: formData.activities,
        additionalUsers: formData.additionalUsers
      };

      console.log('Submitting trip data:', tripData);

      const response = await fetch('http://localhost:4000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
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
              <Input
                type="number"
                name="passengers"
                value={formData.passengers}
                onChange={handleInputChange}
                min="1"
                max="10"
                fontFamily="mono"
              />
            </Box>

            {/* Additional Users */}
            <Box>
              <Text mb={2} color="black" fontFamily="mono" fontSize="sm">Additional Users (Optional)</Text>
              <HStack>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Enter email address"
                  fontFamily="mono"
                  size="sm"
                />
                <Button
                  onClick={handleAddUser}
                  disabled={!newUserEmail || formData.additionalUsers.length >= 10 || !emailValidation.isValid}
                  bg="gray.600"
                  color="white"
                  _hover={{ bg: 'gray.700' }}
                  px={3}
                  py={1}
                  fontFamily="mono"
                  size="sm"
                >
                  Add
                </Button>
              </HStack>
              {emailValidation.message && (
                <Text 
                  fontSize="xs" 
                  mt={1} 
                  color={emailValidation.isValid ? 'green.500' : 'red.500'}
                >
                  {emailValidation.checking ? 'Checking...' : emailValidation.message}
                </Text>
              )}
              {formData.additionalUsers.length > 0 && (
                <VStack align="stretch" mt={2} gap={1}>
                  {formData.additionalUsers.map((email, index) => (
                    <HStack key={index} justify="space-between" gap={2}>
                      <Text fontFamily="mono" fontSize="sm">{email}</Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleRemoveUser(index)}
                        fontFamily="mono"
                        px={2}
                      >
                        Remove
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              )}
              {formData.additionalUsers.length >= 10 && (
                <Text color="red.500" fontSize="xs" mt={1}>
                  Maximum 10 additional users reached
                </Text>
              )}
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
