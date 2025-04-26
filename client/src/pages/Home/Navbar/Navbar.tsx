// src/components/Navbar.tsx

import React from 'react';
import {
  Flex,
  Heading,
  Spacer,
  Link as ChakraLink,
  Avatar,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <Flex
      as="nav"
      w="100%"
      px={6}
      py={4}
      align="center"
      bg="white"
      boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Heading
        size="md"
        color="cyan.600"
      >
        Trailmix
      </Heading>

      <Spacer />

      <ChakraLink
        as={RouterLink}
        href="#"
        display="flex"
        alignItems="center"
        _focus={{
            boxShadow: 'none',
            outline: 'none',
          }}
      >
        <Avatar.Root>
          <Avatar.Fallback name="soph zhu" fontFamily='mono' />
          <Avatar.Image src="#" />
        </Avatar.Root>
      </ChakraLink>
    </Flex>
  );
};

export default Navbar;
