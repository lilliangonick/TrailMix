
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


export const Login = () => {
  return (
    <Flex minH="100vh" minW="100vw" align="center" justify="center" bg="gray.50" p={6}>
      <VStack align="stretch">
        <Heading
              as="h1"
              size="lg"
              textAlign="center"
              color="cyan.600"
              mb={10}
            >
              trailmix
        </Heading>
        <Box
          w="lg"
          maxW="lg"
          bg="gray.50/50"
          p={10}
          borderRadius="sm"
        >
            <VStack align="stretch" mb={3}>
              <Input
                type="email"
                placeholder="Email"
                variant="flushed"
                borderBottom="1px dashed"
                borderColor="gray.400"
                fontFamily="mono"
              />
              <Input
                type="password"
                placeholder="Password"
                variant="flushed"
                borderBottom="1px dashed"
                borderColor="gray.400"
                fontFamily="mono"
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
              Login
            </Button>

            <Flex justify="space-between" fontSize="sm" color="gray.600">
              <Text fontFamily="mono">
                Forgot password?{' '}
                <ChakraLink color="blue.400" href="#">
                  Reset
                </ChakraLink>
              </Text>
              <Text fontFamily="mono">
                New here?{' '}
                <ChakraLink as={RouterLink} to="/signup" color="blue.400">
                  Sign up
                </ChakraLink>
              </Text>
            </Flex>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Login;