// src/components/Navbar.tsx

import React, { useState } from 'react';
import {
  Box,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import Profile from '../Profile/Profile';
import { jwtDecode } from 'jwt-decode';

export const Navbar: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode<{ email: string }>(token) : null;
  const userEmail = decodedToken?.email || 'soph@example.com';

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="white"
      boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)"
      zIndex={1000}
    >
      <Box
        h={16}
        px={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize="xl" fontWeight="bold" color="cyan.600" fontFamily="mono">
          TrailMix
        </Text>
        <Box
          as="button"
          onClick={onOpen}
          cursor="pointer"
          _hover={{ opacity: 0.8 }}
          bg="transparent"
          border="none"
        >
          <Avatar.Root>
            <Avatar.Fallback name={userEmail} fontFamily='mono' />
            <Avatar.Image src={profileImage || undefined} />
          </Avatar.Root>
        </Box>
      </Box>
      <Profile 
        open={open} 
        onClose={onClose} 
        name={userEmail}
        onImageChange={setProfileImage}
      />
    </Box>
  );
};

export default Navbar;
