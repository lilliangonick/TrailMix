import React from 'react';
import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';

interface TripPopupProps {
  isOpen: boolean;
  onClose: () => void;
  trip: {
    _id: string;
    startLocation: string;
    endLocation: string;
    startDate: string;
    endDate: string;
    passengers: number;
    activities: string[];
    budget: string;
    createdAt: string;
    imageUrl?: string;
  };
}

export const TripPopup: React.FC<TripPopupProps> = ({ isOpen, onClose, trip }) => {
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
      onClick={onClose}
    >
      <Box
        bg="white"
        w="80%"
        maxW="800px"
        h="80%"
        borderRadius="xl"
        boxShadow="2xl"
        position="relative"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          position="absolute"
          top={4}
          right={4}
          zIndex={1}
          onClick={onClose}
          variant="ghost"
          size="sm"
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          _hover={{ color: 'gray.700' }}
        >
          ×
        </Button>
        
        <Box position="relative" h="40%">
          <Image
            src={trip.imageUrl || '/assets/explorer.jpg'}
            alt={`${trip.startLocation} to ${trip.endLocation}`}
            objectFit="cover"
            h="full"
            w="full"
          />
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
            p={4}
          >
            <Text fontSize="2xl" fontWeight="bold" color="white">
              {trip.startLocation} to {trip.endLocation}
            </Text>
          </Box>
        </Box>

        <Box p={6} overflowY="auto" h="60%">
          <VStack align="stretch" gap={4}>
            <HStack justify="space-between">
              <Text fontWeight="medium">Dates:</Text>
              <Text>
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Passengers:</Text>
              <Text>{trip.passengers} {trip.passengers === 1 ? 'person' : 'people'}</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Budget:</Text>
              <Text>{'$'.repeat(parseInt(trip.budget))}</Text>
            </HStack>
            
            <Box h="1px" bg="gray.200" w="full" />
            
            <Box>
              <Text fontWeight="medium" mb={2}>Activities:</Text>
              <Flex gap={2} wrap="wrap">
                {trip.activities.map((activity, index) => (
                  <Badge key={index} colorScheme="cyan" variant="solid" fontSize="sm">
                    {activity}
                  </Badge>
                ))}
              </Flex>
            </Box>
            
            <Box h="1px" bg="gray.200" w="full" />
            
            <Text fontSize="sm" color="gray.500">
              Created on {new Date(trip.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}; 