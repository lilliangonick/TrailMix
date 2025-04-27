import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';

export const TripForm = () => {
  const [formData, setFormData] = useState({
    startLocation: { address: '', lat: 0, lng: 0 },
    endLocation: { address: '', lat: 0, lng: 0 },
    budget: '2',
    tripVibe: 'foodie',
    startDate: '',
    endDate: ''
  });

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Please login first',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      const response = await fetch('http://localhost:4000/api/trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Trip created successfully!',
          status: 'success',
          duration: 3000,
        });
        // Reset form
        setFormData({
          startLocation: { address: '', lat: 0, lng: 0 },
          endLocation: { address: '', lat: 0, lng: 0 },
          budget: '2',
          tripVibe: 'foodie',
          startDate: '',
          endDate: ''
        });
      } else {
        throw new Error(data.error || 'Failed to create trip');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create trip',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Start Location</FormLabel>
          <Input
            name="startLocation.address"
            value={formData.startLocation.address}
            onChange={handleChange}
            placeholder="Enter start address"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>End Location</FormLabel>
          <Input
            name="endLocation.address"
            value={formData.endLocation.address}
            onChange={handleChange}
            placeholder="Enter end address"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Budget</FormLabel>
          <Select name="budget" value={formData.budget} onChange={handleChange}>
            <option value="1">$</option>
            <option value="2">$$</option>
            <option value="3">$$$</option>
            <option value="4">$$$$</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Trip Vibe</FormLabel>
          <Select name="tripVibe" value={formData.tripVibe} onChange={handleChange}>
            <option value="foodie">Foodie</option>
            <option value="explorer">Explorer</option>
            <option value="shopper">Shopper</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full">
          Create Trip
        </Button>
      </VStack>
    </Box>
  );
}; 