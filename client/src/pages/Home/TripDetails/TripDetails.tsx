import React from 'react';
import {
  Box,
  Heading,
  Text,
  CloseButton,
  VStack,
  HStack,
  Image,
  useDisclosure,
} from '@chakra-ui/react';

interface TripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  trip: {
    id: number;
    title: string;
    image: string;
    startLocation?: string;
    endLocation?: string;
    startTime?: string;
    endTime?: string;
    passengers?: number;
    activities?: string[];
    budget?: string;
  };
}

export const TripDetails: React.FC<TripDetailsProps> = ({ isOpen, onClose, trip }) => {
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
        
        <VStack align="stretch" gap={6}>
          <Image
            src={trip.image}
            alt={trip.title}
            borderRadius="md"
            objectFit="cover"
            h="200px"
            w="full"
          />
          
          <Heading size="xl" color="cyan.600" fontFamily="mono">
            {trip.title}
          </Heading>

          {trip.startLocation && trip.endLocation && (
            <Box>
              <Text fontSize="sm" color="gray.500" fontFamily="mono">Route</Text>
              <Text fontFamily="mono">
                {trip.startLocation} → {trip.endLocation}
              </Text>
            </Box>
          )}

          {trip.startTime && trip.endTime && (
            <Box>
              <Text fontSize="sm" color="gray.500" fontFamily="mono">Duration</Text>
              <Text fontFamily="mono">
                {new Date(trip.startTime).toLocaleDateString()} - {new Date(trip.endTime).toLocaleDateString()}
              </Text>
            </Box>
          )}

          {trip.passengers && (
            <Box>
              <Text fontSize="sm" color="gray.500" fontFamily="mono">Passengers</Text>
              <Text fontFamily="mono">{trip.passengers} people</Text>
            </Box>
          )}

          {trip.activities && trip.activities.length > 0 && (
            <Box>
              <Text fontSize="sm" color="gray.500" fontFamily="mono">Activities</Text>
              <HStack gap={2} wrap="wrap">
                {trip.activities.map((activity, index) => (
                  <Text
                    key={index}
                    fontFamily="mono"
                    bg="gray.100"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {activity}
                  </Text>
                ))}
              </HStack>
            </Box>
          )}

          {trip.budget && (
            <Box>
              <Text fontSize="sm" color="gray.500" fontFamily="mono">Budget</Text>
              <Text fontFamily="mono">{'$'.repeat(parseInt(trip.budget))}</Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default TripDetails; 