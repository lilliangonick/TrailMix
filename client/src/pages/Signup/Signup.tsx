
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


export const Signup = () => {
  return (
    <Flex minH="100vh" minW="100vw" align="center" justify="center" bg="green.100" p={6}>
        <Box
          w="lg"
          maxW="lg"
          bg="gray.50/50"
          p={14}
          borderRadius="sm"
        >
          <VStack align="stretch">
          <Heading
                as="h1"
                size="lg"
                textAlign="center"
                color="cyan.600"
                mb={10}
              >
                Trailmix
          </Heading>
            <VStack align="stretch" mb={3}>
              <Input
                type="email"
                placeholder="Email"
                variant="flushed"
                borderBottom="1px dashed"
                borderColor="gray.400"
                fontFamily="mono"
                _focus={{ boxShadow: "none", borderBottom: "2px dashed", borderColor: "gray.400" }}
              />
              <Input
                type="password"
                placeholder="Password"
                variant="flushed"
                borderBottom="1px dashed"
                borderColor="gray.400"
                fontFamily="mono"
                _focus={{ boxShadow: "none", borderBottom: "2px dashed", borderColor: "gray.400" }}
              />
              <Input
                type="password"
                placeholder="Re-type your password"
                variant="flushed"
                borderBottom="1px dashed"
                borderColor="gray.400"
                fontFamily="mono"
                _focus={{ boxShadow: "none", borderBottom: "2px dashed", borderColor: "gray.400" }}
              />
            </VStack>

            <Button bg="cyan.600" 
              width="full" 
              mt={4} 
              _hover={{
                bg: "cyan.700",
              }}
              fontFamily="mono"
              mb={3}>
              Sign Up
            </Button>

            <Flex justify="space-between" fontSize="sm" color="gray.600">
              <Text fontFamily="mono">
                Have an account already?{' '}
                <ChakraLink as={RouterLink} to="/" color="blue.400">
                  Back to Login
                </ChakraLink>
              </Text>
            </Flex>
          </VStack>
        </Box>
    </Flex>
  );
};

export default Signup;