import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

interface TripCardProps {
  imageSrc: string;
  title: string;
  onClick?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ imageSrc, title, onClick }) => (
  <Box
    maxW="sm"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    cursor={onClick ? 'pointer' : 'default'}
    onClick={onClick}
    _hover={onClick ? { boxShadow: 'lg' } : undefined}
  >
    <Image
      src={imageSrc}
      alt={title}
      objectFit="cover"
      w="100%"
      h="200px"
    />
    <Box p="4">
      <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
        {title}
      </Text>
    </Box>
  </Box>
);

export default TripCard;
