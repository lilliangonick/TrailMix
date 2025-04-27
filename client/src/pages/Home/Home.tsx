import React, { useState, useEffect } from 'react';
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
import { TripCard } from './TripCard/TripCard';
import TripForm from './TripForm/TripForm';
import { TripPopup } from './TripPopup/TripPopup';
import { getLocationImage } from '../../utils/locationImage';

interface Trip {
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
}

export const Home = () => {
  const { open: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { open: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:4000/api/trips', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }

        const data = await response.json();
        
        // Fetch images for each trip
        const tripsWithImages = await Promise.all(
          data.map(async (trip: Trip) => {
            const imageUrl = await getLocationImage(trip.endLocation);
            return { ...trip, imageUrl };
          })
        );
        
        setTrips(tripsWithImages);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    onDetailsOpen();
  };

  const handleTripCreated = async () => {
    onFormClose();
    // Refresh trips list
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:4000/api/trips', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }

      const data = await response.json();
      
      // Fetch images for each trip
      const tripsWithImages = await Promise.all(
        data.map(async (trip: Trip) => {
          const imageUrl = await getLocationImage(trip.endLocation);
          return { ...trip, imageUrl };
        })
      );
      
      setTrips(tripsWithImages);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  return (
    <Box minH='100vh' minW='100vw'>
      <Navbar/>
      <VStack>
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
            <VStack gap={11} align="center" paddingTop="15vh">
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
                    key={trip._id}
                    trip={trip}
                    onClick={() => handleTripClick(trip)}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </Flex>
      </VStack>

      <TripForm isOpen={isFormOpen} onClose={handleTripCreated} />
      {selectedTrip && (
        <TripPopup
          isOpen={isDetailsOpen}
          onClose={onDetailsClose}
          trip={selectedTrip}
        />
      )}
    </Box>
  );
};

export default Home;