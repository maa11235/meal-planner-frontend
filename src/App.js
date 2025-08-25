// src/App.js
import React from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Text,
  Button,
  Heading,
  Input,
} from "@chakra-ui/react";

function MealPlannerApp() {
  return (
    <ChakraProvider>
      <Box display="flex" minH="100vh" bg="green.900" color="white">
        {/* Left Sidebar */}
        <Box
          w="300px"
          p={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {/* Menu Configuration */}
          <VStack spacing={4} align="center" mb={8}>
            <Heading as="h2" size="md" color="white">
              Menu Configuration
            </Heading>
            <Input placeholder="Enter meal type (e.g., Dinner)" />
            <Input placeholder="Enter number of people" />
            <Input placeholder="Enter dietary preferences" />
          </VStack>

          {/* Grocery Store Login Group Box */}
          <Box
            bg="blue.900"   // Deep sea blue background
            p={6}
            w="100%"
            border="none"   // No border
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" mb={4} color="white">
              To log into any of the following grocery stores: Kroger, Smyths,
              Dillons, Fred Meyer, Food 4 Less, Metro Market, Ralph's, Jay C
              Food, City Market, King Supers, Gerbes, Marianos, and QFC.
            </Text>
            <Button colorScheme="orange" w="100%">
              Grocery Store Login
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          flex="1"
          p={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box maxW="50%" textAlign="center">
            <Text
              fontSize="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, red.400, orange.400, yellow.400, green.400)"
              bgClip="text"
            >
              Welcome to Plan2Pantry.
            </Text>
            <Text fontSize="lg" color="white" mt={4}>
              The effortless meal planning virtual nutritionist chef that takes
              your meal requests and customizes recipes tailored to meet your
              desires. <br />
              <br />
              <Text
                as="span"
                bgGradient="linear(to-r, red.400, orange.400, yellow.400, green.400)"
                bgClip="text"
                fontWeight="bold"
              >
                Plan2Pantry
              </Text>{" "}
              will generate a grocery list and add the ingredients to your
              grocery cart.
            </Text>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default MealPlannerApp;
