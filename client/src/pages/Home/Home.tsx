
import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Text,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import TripCard from './TripCard/TripCard';

export const Home = () => {
  return (
    <Box
        minH='100vh'
        minW='100vw'>
        <Navbar/>
        <Flex minH="100vh" 
        minW="100vw" 
        align="center" 
        justify="center" 
        bgImage={`url('/assets/trailmixbg.png')`} 
        bgPos="center top"
        bgRepeat="no-repeat" 
        p={6}>
            <Box
            w="lg"
            maxW="lg"
            bg="gray.50/77"
            p={14}
            borderRadius="sm"
            >
                <VStack align="stretch">
                    <TripCard imageSrc='/assets/yosemite.jpg' title="trip {1}" />
                </VStack>
            </Box>
        </Flex>
    </Box>
  );
};

export default Home;