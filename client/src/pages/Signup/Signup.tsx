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
import bg from '../../assets/trailmixbg.png';


export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (password !== retypePassword) {
        setError('Passwords do not match.');
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Error creating profile');
      } else {
        setSuccess('Account created successfully! You can now log in.');
        setEmail('');
        setPassword('');
        setRetypePassword('');
        navigate('/home');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error('Signup error:', err);
    }
  }

  return (
    <Flex minH="100vh" 
    minW="100vw" 
    align="center" 
    justify="center" 
    bgImage={`url(${bg})`} 
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
                color="black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                _focus={{ boxShadow: "none", borderBottom: "2px dashed", borderColor: "gray.400" }}
              />
              <Input
                type="password"
                placeholder="Re-type your password"
                variant="flushed"
                borderBottom="1px dashed"
                borderColor="gray.400"
                fontFamily="mono"
                color="black"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                _focus={{ boxShadow: "none", borderBottom: "2px dashed", borderColor: "gray.400" }}
              />
            </VStack>

            {error && (
              <Text color="red.500" fontSize="sm" fontFamily="mono" mb={2}>
                {error}
              </Text>
            )}
            {success && (
              <Text color="green.500" fontSize="sm" fontFamily="mono" mb={2}>
                {success}
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
              onClick={handleSignup}
              >
              Sign Up
            </Button>

            <Flex justify="space-between" fontSize="sm" color="gray.600">
              <Text fontFamily="mono">
                Have an account already?{' '}
                <ChakraLink href="/" color="blue.400">
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