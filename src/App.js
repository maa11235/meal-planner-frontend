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
  HStack,
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
  const [storeStatusMessage, setStoreStatusMessage] = useState(""); 
  const [zipCode, setZipCode] = useState("");
  const [stores, setStores] = useState([]);

  // NEW states for meal plan inputs
  const [mealDescription, setMealDescription] = useState(""); 
  const [mealCount, setMealCount] = useState("3"); 
  const [mealTime, setMealTime] = useState("dinner"); 

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // 🛒 Handle login by redirecting to backend login endpoint
  const handleLogin = () => {
    window.location.href = `${backendUrl}/login`;
  };

  // ✨ Handle Generate Plan (calls backend /plan)
  const handleGeneratePlan = async () => {
    try {
      const res = await fetch(`${backendUrl}/plan`, {
        method: "POST",
        credentials: "include", // send cookies for session
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mealDescription, 
          time: mealTime,
          num_meals: parseInt(mealCount, 10),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMealPlan(JSON.stringify(data.plan, null, 2)); // pretty-print JSON plan
      } else {
        setMealPlan(`⚠️ Error: ${data.error || "Failed to generate plan."}`);
      }
    } catch (err) {
      setMealPlan(`⚠️ Error calling backend: ${err.message}`);
    }
  };

  // 🔎 Handle Search Stores
  const handleSearchStores = async () => {
    try {
      const res = await fetch(`${backendUrl}/stores?zip=${zipCode}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setStores(data);
        setStoreStatusMessage(`✨ Behold! I found ${data.length} stores near you.`);
      } else {
        setStoreStatusMessage(`⚠️ ${data.error || "Failed to fetch stores."}`);
      }
    } catch (err) {
      setStoreStatusMessage(`⚠️ Error fetching stores: ${err.message}`);
    }
  };

  // 🔄 Check backend /status for Kroger login
  const checkStatus = async () => {
    try {
      const res = await fetch(`${backendUrl}/status`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.loggedIn || data.logged_in) {
        setIsLoggedIn(true);
        setLoginStatusMessage(
          "✨ Ah, master! You are bound to the marketplace. Next, whisper your culinary desires, and I shall weave them into a meal plan!"
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

  useEffect(() => {
    checkStatus();
  }, [backendUrl]);

  useEffect(() => {
    if (window.location.href.includes("meal-planner.techexamprep.com")) {
      checkStatus();
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" minH="100vh">
        {/* Left Sidebar */}
        <Box w="300px" p={6}>
          <VStack align="stretch" spacing={6}>
            {/* CartGenie Heading */}
            <Heading
              size="lg"
              fontFamily="'Cinzel Decorative', cursive"
              fontWeight="bold"
              color="yellow.300"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <span role="img" aria-label="genie">🧞</span>
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

            {/* Grocery Store Login Group Box */}
            <Box bg="#003366" p={4} border="none" borderRadius="md">
              <Text mb={3} fontSize="sm" color="white" textAlign="center" fontFamily="'Dancing Script', cursive">
                If you haven't already, create an account for Kroger, Smyths,
                Dillons, Fred Meyer, Food 4 Less, Metro Market, Ralph's, Jay C
                Food, City Market, King Supers, Gerbes, Marianos, or QFC.{" "}
                <Link href="https://www.kroger.com" isExternal color="yellow.300" fontWeight="bold">
                  Create Account
                </Link>
              </Text>
              <Button colorScheme="teal" onClick={handleLogin} w="100%">
                Grocery Store Login
              </Button>
            </Box>

            {/* Find a Store & Meal Generator Group Box */}
            <Box bg="#003366" p={4} border="none" borderRadius="md">
              {/* Meal description input */}
              <Input
                placeholder="Unique meal description"
                bg="white"
                color="black"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
              />

              {/* Meals Quantity Selector */}
              <Select
                value={mealCount}
                onChange={(e) => setMealCount(e.target.value)}
                bg="white"
                color="black"
                mt={4}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </Select>

              {/* Meal Time Selector */}
              <Select
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                bg="white"
                color="black"
                mt={2}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </Select>
            </Box>

            {/* Generate Meal Plan */}
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
            <Text fontSize="xl" fontFamily="'Dancing Script', cursive" color="white" textAlign="center">
              Welcome, seeker of flavor... Your wish is my culinary command!
            </Text>
          ) : (
            <Box w="70%" bg="white" color="black" p={4} borderRadius="md" whiteSpace="pre-wrap">
              {mealPlan}
            </Box>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default MealPlannerApp;
