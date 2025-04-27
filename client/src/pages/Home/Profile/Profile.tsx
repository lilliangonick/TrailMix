import React, { useRef, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  CloseButton,
  Avatar,
  Input,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  open: boolean;
  onClose: () => void;
  name: string;
  onImageChange?: (image: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ open, onClose, name, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setImage(imageData);
        onImageChange?.(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!open) return null;

  return (
    <Box
      position="fixed"
      top={0}
      right={0}
      w="300px"
      h="100vh"
      bg="white"
      boxShadow="lg"
      zIndex={1000}
    >
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <CloseButton onClick={onClose} />
      </Box>
      
      <Box p={6}>
        <VStack gap={4} align="stretch">
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <Avatar.Root size="2xl">
              <Avatar.Fallback name={name} fontFamily='mono' />
              <Avatar.Image src={image || "#"} />
            </Avatar.Root>
            <Text fontSize="xl" color="black" fontWeight="bold" mt={4}>{name}</Text>
            <Text
              as="button"
              bg="transparent"
              fontSize="11px"
              color="gray.500"
              border="none"
              fontFamily="mono"
              _hover={{ color: 'gray.700' }}
              onClick={() => fileInputRef.current?.click()}
            >
              Change Photo
            </Text>
            <Input
              type="file"
              accept="image/*"
              display="none"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </Box>
          
          <Box h="1px" bg="gray.200" />
          
          <Button 
            bg="cyan.600" 
            color="white" 
            fontFamily='mono' 
            variant="solid" 
            justifyContent="center"
            _hover={{ bg: 'cyan.700' }}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Profile; 