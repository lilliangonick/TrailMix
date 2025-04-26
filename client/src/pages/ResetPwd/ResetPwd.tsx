
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
import bg from '../../assets/trailmixbg.png';


export const ResetPwd = () => {
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
              Send Email
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

export default ResetPwd;