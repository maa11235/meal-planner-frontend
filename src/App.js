import React, { useState, useEffect } from "react";
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
  Select,
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

// Gradient for CartGenie text
const planGradient = "linear(to-r, #ff595e, #ffca3a, #8ac926, #1982c4)";

function MealPlannerApp() {
  const [mealPlan, setMealPlan] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStatusMessage, setLoginStatusMessage] = useState("");
  const backendUrl = "http://localhost:5000"; // adjust to your backend URL

  const handleGeneratePlan = () => {
    setMealPlan("Your customized meal plan will appear here...");
  };

  // 🔄 Always check backend /status for Kroger login
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/status`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.loggedIn) {
          setIsLoggedIn(true);
          setLoginStatusMessage(
            "✨ Ah, master! You are already bound to the marketplace. Next, whisper your culinary desires, and I shall weave them into a meal plan!"
          );
        } else {
          setIsLoggedIn(false);
          setLoginStatusMessage(
            "⚠️ Alas! You are not yet bound to the marketplace. Press the Grocery Store Login button, and the gates shall open!"
          );
        }
      } catch (err) {
        setLoginStatusMessage(`⚠️ Error checking login: ${err.message}`);
      }
    };
    checkStatus();
  }, [backendUrl]);

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" minH="100vh">
        {/* Left Sidebar */}
        <Box w="300px" p={6}>
          <VStack align="stretch" spacing={6}>
            {/* CartGenie Heading with Emoji */}
            <Heading
              size="lg"
              fontFamily="'Cinzel Decorative', cursive"
              fontWeight="bold"
              color="yellow.300"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <span role="img" aria-label="genie">
                🧞
              </span>
              <Text
                as="span"
                bgGradient={planGradient}
                bgClip="text"
                fontFamily="'Cinzel Decorative', cursive"
                fontWeight="extrabold"
              >
                CartGenie
              </Text>
            </Heading>

            {/* Your Recipe Wish Label */}
            <Heading as="h2" size="md" textAlign="center" color="white">
              Your Wish Shall Be Loaded To Your Grocery Cart
            </Heading>

            {/* Grocery Store Login Group Box */}
            <Box bg="#003366" p={4} border="none" borderRadius="md">
              {/* Moved Create Account Text + Link here */}
              <Text
                mb={3}
                fontSize="sm"
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

              <Text mb={3} fontSize="sm" color="white" textAlign="center">
                Whisper your wish, and I shall open the gates to your chosen
                marketplace! Log in and let your pantry be filled with treasures.
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
                Speak your wish, and I, the Genie of Meals, shall craft it!
                Describe the delights you seek — perhaps sweets fit for a
                diabetic with strawberries, comforting soul food made easy,
                high-protein feasts full of fiber, or even toddler-friendly
                treasures. Your wish is my recipe command!
              </Text>
              <Input
                placeholder="Unique meal description"
                bg="white"
                color="black"
              />

              {/* Meals Quantity Selector */}
              <Text mt={4} mb={2} fontSize="sm" color="white">
                How many feasts shall I conjure from my mystical cookbook?
              </Text>
              <Select defaultValue="3" bg="white" color="black" mb={4}>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Select>

              {/* Meal Type Selector */}
              <Text mb={2} fontSize="sm" color="white">
                Shall these creations be dawn’s delights, midday marvels, or
                evening banquets?
              </Text>
              <Select defaultValue="dinner" bg="white" color="black">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </Select>
            </Box>

            {/* New Generate Meal Plan Group Box */}
            <Box bg="#003366" p={4} border="none" borderRadius="md">
              <Button colorScheme="yellow" w="100%" onClick={handleGeneratePlan}>
                Generate Meal Plan
              </Button>
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
                Welcome, seeker of flavor, to{" "}
                <span role="img" aria-label="genie">
                  🧞
                </span>{" "}
                <Text
                  as="span"
                  bgGradient={planGradient}
                  bgClip="text"
                  fontWeight="bold"
                  fontFamily="'Cinzel Decorative', cursive"
                >
                  CartGenie
                </Text>
                . With but a whisper of your desires, I shall summon meals
                crafted to your heart’s delight. From the scrolls of my enchanted
                cookbook, recipes shall appear, tailored to your cravings. And
                lo! I shall conjure forth a grocery list and place every needed
                treasure directly into your cart. Your wish is my culinary
                command!
              </Text>

              {/* Login Status Message */}
              {loginStatusMessage && (
                <Text
                  mt={6}
                  fontSize="md"
                  color="yellow.300"
                  textAlign="center"
                  fontFamily="'Dancing Script', cursive"
                >
                  {loginStatusMessage}
                </Text>
              )}
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
