import React from 'react';
import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/modal';

interface TripDetailsProps {
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

export const TripDetails: React.FC<TripDetailsProps> = ({ isOpen, onClose, trip }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="xl" overflow="hidden">
        <Image
          src={trip.imageUrl || '/assets/explorer.jpg'}
          alt={`${trip.startLocation} to ${trip.endLocation}`}
          objectFit="cover"
          h="200px"
          w="full"
        />
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold">
            {trip.startLocation} to {trip.endLocation}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TripDetails; 