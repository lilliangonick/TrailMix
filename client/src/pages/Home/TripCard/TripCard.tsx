import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

interface TripCardProps {
  imageSrc: string;
  title: string;
  onClick?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ imageSrc, title, onClick }) => (
  <Box
    w="300px"
    h="375px" // 4:5 aspect ratio (300 * 1.25)
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    cursor={onClick ? 'pointer' : 'default'}
    onClick={onClick}
    _hover={onClick ? { boxShadow: 'lg' } : undefined}
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
      <Text fontWeight="bold" fontSize="lg" color="white">
        {title}
      </Text>
    </Box>
  </Box>
);

export default TripCard;
