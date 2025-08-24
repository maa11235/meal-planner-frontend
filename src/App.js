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

// Gradient for Plan2Pantry text
const planGradient = "linear(to-r, #ff595e, #ffca3a, #8ac926, #1982c4)";

function MealPlannerApp() {
  const [mealPlan, setMealPlan] = useState("");

  const handleGroceryLogin = () => {
    setMealPlan("Your grocery store login process will appear here...");
  };

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" minH="100vh">
        {/* Left Sidebar */}
        <Box w="300px" p={6}>
          <VStack align="stretch" spacing={6}>
            <Heading
              size="lg"
              bgGradient={planGradient}
              bgClip="text"
              fontFamily="'Dancing Script', cursive"
            >
              Plan2Pantry
            </Heading>

            <Button colorScheme="teal" onClick={handleGroceryLogin}>
              Grocery Store Login
            </Button>

            <Button colorScheme="teal" variant="outline">
              View Grocery List
            </Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" display="flex" justifyContent="center" alignItems="center">
          {!mealPlan ? (
            <Box w="50%" textAlign="center">
              <Text
                fontSize="xl"
                fontFamily="'Dancing Script', cursive"
                color="white"
              >
                Welcome to{" "}
                <Text
                  as="span"
                  bgGradient={planGradient}
                  bgClip="text"
                  fontWeight="bold"
                >
                  Plan2Pantry
                </Text>
                . The effortless meal planning virtual nutritionist chef that
                takes your meal requests and customizes recipes tailored to
                meet your desires.{" "}
                <Text
                  as="span"
                  bgGradient={planGradient}
                  bgClip="text"
                  fontWeight="bold"
                >
                  Plan2Pantry
                </Text>{" "}
                will generate a grocery list and add the ingredients to your
                grocery cart.
              </Text>

              {/* Grocery store list below the intro */}
              <Text mt={6} fontSize="md" color="white">
                To log into any of the following grocery stores: Kroger, Smyths,
                Dillons, Fred Meyer, Food 4 Less, Metro Market, Ralph's, Jay C
                Food, City Market, King Supers, Gerbes, Marianos, and QFC
              </Text>
            </Box>
          ) : (
            <Text fontSize="lg" color="black">
              {mealPlan}
            </Text>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default MealPlannerApp;

