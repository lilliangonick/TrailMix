import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

interface TripCardProps {
  imageSrc: string;
  title: string;
  onClick?: () => void;
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

const TripCard: React.FC<TripCardProps> = ({ imageSrc, title, onClick, trip }) => (
  <Box
    w="300px"
    h="375px"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    cursor="pointer"
    onClick={onClick}
    _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
    position="relative"
  >
    <Image
      src={imageSrc}
      alt={title}
      objectFit="cover"
      w="100%"
      h="100%"
    />
    <Box
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      p="4"
      bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
    >
      <Text fontWeight="bold" fontSize="lg" color="white" fontFamily="mono">
        {title}
      </Text>
    </Box>
  </Box>
);

export default TripCard;
