import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Button,
  Text,
  extendTheme,
  Link,
  Input,
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
              bgGradient={planGradient}
              bgClip="text"
              fontFamily="'Dancing Script', cursive"
            >
              Plan2Pantry
            </Heading>

            {/* Menu Configuration Label */}
            <Heading as="h2" size="md" textAlign="center" color="white">
              Menu Configuration
            </Heading>

            {/* Grocery Store Login Group Box */}
            <Box bg="#003366" p={4} border="none" borderRadius="md">
              <Text mb={3} fontSize="sm" color="white" textAlign="center">
                To log into any of the following grocery stores: Kroger, Smiths,
                Dillons, Fred Meyer, Food 4 Less, Metro Market, Ralph's, Jay C
                Food, City Market, King Supers, Gerbes, Marianos, and QFC.
              </Text>
              <Button colorScheme="teal" onClick={handleGeneratePlan} w="100%">
                Grocery Store Login
              </Button>
            </Box>

            {/* Find a Store & Meal Generator Group Box */}
            <Box bg="#003366" p={4} border="none" borderRadius="md">
              <Text mb={3} fontSize="md" color="white" textAlign="center">
                Find a store near you
              </Text>
              <Input
                placeholder="Enter zip code"
                mb={4}
                bg="white"
                color="black"
              />
              <Text mb={3} fontSize="sm" color="white">
                Write description of meals you would like the genie meal
                generator to create, i.e., sweets for a diabetic with strawberries,
                easy to prepare soul food, high protein and fiber, toddler friendly, etc.
              </Text>
              <Input
                placeholder="Unique meal description"
                bg="white"
                color="black"
              />
            </Box>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" display="flex" justifyContent="center" alignItems="center">
          {!mealPlan ? (
            <Box w="50%">
              <Text
                fontSize="xl"
                fontFamily="'Dancing Script', cursive"
                color="white"
                textAlign="center"
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
                takes your meal requests and customizes recipes tailored to meet
                your desires.{" "}
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

              {/* Grocery Store Info Paragraph (updated) */}
              <Text
                mt={6}
                fontSize="md"
                color="white"
                textAlign="center"
                fontFamily="'Dancing Script', cursive"
              >
                If you haven't already, create an account for Kroger, Smyths,
                Dillons, Fred Meyer, Food 4 Less, Metro Market, Ralph's, Jay C
                Food, City Market, King Supers, Gerbes, Marianos, or QFC.{" "}
                <Link
                  href="https://www.kroger.com"
                  isExternal
                  color="yellow.300"
                  fontWeight="bold"
                >
                  Create Account
                </Link>
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
