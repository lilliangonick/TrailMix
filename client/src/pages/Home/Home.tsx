import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import TripCard from './TripCard/TripCard';
import TripForm from './TripForm/TripForm';
import TripDetails from './TripDetails/TripDetails';

interface Trip {
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
}

export const Home = () => {
  const { open: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { open: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 1,
      title: "Yosemite",
      image: "../../../assets/yosemite.jpg",
    },
  ]);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    onDetailsOpen();
  };

  return (
    <Box minH='100vh' minW='100vw'>
      <Navbar/>
      <VStack>
        <Heading
          as="h1"
          size="lg"
          textAlign="center"
          color="cyan.600"
        >
          My Trips
        </Heading>
        <Flex 
          minH="100vh" 
          minW="100vw" 
          align="center top" 
          justify="center"
          bgImage={`url('/assets/trailmixbg.png')`} 
          bgPos="center top"
          bgRepeat="no-repeat" 
          p={6}
        >
          <Box
            w="full"
            maxW="6xl"
            p={14}
          >
            <VStack gap={8} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
                {/* Start New Trip Card */}
                <Box
                  as="button"
                  onClick={onFormOpen}
                  w="300px"
                  h="375px"
                  bg="white/50"
                  border="1px dashed gray"
                  borderRadius="md"
                  boxShadow="md"
                  _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                  cursor="pointer"
                  textAlign="center"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Heading fontSize="2xl" color="cyan.600" mb={2}>
                    New Trip
                  </Heading>
                  <Text fontSize="sm" color="gray.600" fontFamily="mono">
                    plan your next adventure
                  </Text>
                </Box>

                {/* Existing Trip Cards */}
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    imageSrc={trip.image}
                    title={trip.title}
                    onClick={() => handleTripClick(trip)}
                    trip={trip}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </Flex>
      </VStack>
      <TripForm isOpen={isFormOpen} onClose={onFormClose} />
      {selectedTrip && (
        <TripDetails 
          isOpen={isDetailsOpen} 
          onClose={onDetailsClose} 
          trip={selectedTrip} 
        />
      )}
    </Box>
  );
};

export default Home;