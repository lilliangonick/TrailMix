import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();



  const handleLogin = async () => {
    console.log(password)
    console.log(email)
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json()

      if (response.ok) {
        console.log('Login succesful')
        localStorage.setItem('token', data.token); 
        navigate('/home');
      } else {
        console.log(data.message)
        setErrorMessage(data.message || 'Invalid credentials');
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  }

  return (
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
                color="black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                _focus={{ boxShadow: "none", borderBottom: "2px dashed", borderColor: "gray.400" }}
              />
              <Input
                type="password"
                placeholder="Password"
                variant="flushed"
                borderBottom="1px dashed"
                borderColor="gray.400"
                fontFamily="mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color="black"
                _focus={{ boxShadow: "none", borderBottom: "2px dashed", borderColor: "gray.400" }}
              />
            </VStack>
            
            {errorMessage && (
            <Text color="red.500" fontSize="sm" mb={2} fontFamily="mono">
              {errorMessage}
            </Text>
          )}

            <Button bg="cyan.600" 
              width="full" 
              mt={4} 
              _hover={{
                bg: "cyan.700",
              }}
              fontFamily="mono"
              mb={3}
              onClick={handleLogin}>
              Login
            </Button>

            <Flex justify="space-between" fontSize="sm" color="gray.600">
            <Text fontFamily="mono">
                New here?{' '}
                <ChakraLink href='/signup' color="blue.400">
                  Sign up
                </ChakraLink>
              </Text>
              <Text fontFamily="mono">
                Forgot password?{' '}
                <ChakraLink color="blue.400" href="/resetpwd">
                  Reset
                </ChakraLink>
              </Text>
            </Flex>
          </VStack>
        </Box>
    </Flex>
  );
};

export default Login;