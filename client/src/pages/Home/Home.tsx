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

export const Home = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [trips, setTrips] = useState([
    {
      id: 1,
      title: "Yosemite",
      image: "../../../assets/yosemite.jpg",
    },
  ]);

  return (
    <Box minH='100vh' minW='100vw'>
      <Navbar/>        
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
                  onClick={onOpen}
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
                  />
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </Flex>
      <TripForm isOpen={open} onClose={onClose} />
    </Box>
  );
};

export default Home;