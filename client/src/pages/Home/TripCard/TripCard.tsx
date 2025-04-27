import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

interface TripCardProps {
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
  onClick?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  // Get only the first term of the destination
  const destination = trip.endLocation.split(',')[0].trim();

  return (
    <Box
      as="button"
      onClick={onClick}
      w="300px"
      h="375px"
      borderRadius="lg"
      boxShadow="xl"
      overflow="hidden"
      position="relative"
      _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
      cursor="pointer"
      p={0}
      m={0}
    >
      <Image
        src={trip.imageUrl || '/assets/explorer.jpg'}
        alt={`${trip.startLocation} to ${trip.endLocation}`}
        objectFit="cover"
        h="full"
        w="full"
        m={0}
        p={0}
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
        p={4}
        color="white"
        textAlign="left"
      >
        <Text fontSize="xl" fontFamily="mono" fontWeight="bold">
          {destination}
        </Text>
      </Box>
    </Box>
  );
};
