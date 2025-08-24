import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Button,
  Text,
  extendTheme,
} from "@chakra-ui/react";

// Theme with dark green background
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#2e7d32", // Dark leafy green
        color: "white",
      },
    },
  },
});

function MealPlannerApp() {
  const [mealPlan, setMealPlan] = useState("");

  const handleGeneratePlan = () => {
    setMealPlan("Your customized meal plan will appear here...");
  };

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" minH="100vh">
        {/* Left Sidebar */}
        <Box w="300px" p={6}>
          <VStack align="stretch" spacing={6}>
            <Heading
              size="lg"
              bgGradient="linear(to-r, #ff595e, #ffca3a, #8ac926, #1982c4)"
              bgClip="text"
              fontFamily="'Dancing Script', cursive"
            >
              Plan2Pantry
            </Heading>
            <Button colorScheme="teal" onClick={handleGeneratePlan}>
              Generate Meal Plan
            </Button>
            <Button colorScheme="teal" variant="outline">
              View Grocery List
            </Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" p={10}>
          {!mealPlan ? (
            <Text
              fontSize="xl"
              fontFamily="'Dancing Script', cursive"
              color="white"
            >
              Welcome to <b>Plan2Pantry</b>. The effortless meal planning chef
              that listens to your input and customizes recipes tailored to meet
              your desires. It will generate a grocery list and add the
              ingredients to your grocery cart.
            </Text>
          ) : (
            <Text fontSize="lg" color="white">
              {mealPlan}
            </Text>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default MealPlannerApp;
