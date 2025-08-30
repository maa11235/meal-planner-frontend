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
import Tree from "rc-tree";
import "rc-tree/assets/index.css";

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
  const [mealPlan, setMealPlan] = useState(null); // store JSON
  const [checkedKeys, setCheckedKeys] = useState([]); // rc-tree checked state
  const [expandedKeys, setExpandedKeys] = useState([]); // rc-tree expanded state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStatusMessage, setLoginStatusMessage] = useState("");
  const [storeStatusMessage, setStoreStatusMessage] = useState(""); // NEW separate message for store count
  const [zipCode, setZipCode] = useState("");
  const [stores, setStores] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // NEW states for meal plan request
  const [mealDescription, setMealDescription] = useState("");
  const [mealCount, setMealCount] = useState("3");
  const [time, setTime] = useState("dinner");

  // 🆕 state for upload-to-cart message
  const [cartMessage, setCartMessage] = useState("");

  const handleGeneratePlan = async () => {
    try {
      const res = await fetch(`${backendUrl}/plan`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mealDescription,
          num_meals: parseInt(mealCount, 10),
          time: time,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMealPlan(data); // store entire response
        setCartMessage(""); // clear any previous cart message

        // Automatically expand all meals and ingredients
        const allExpanded = [];
        const allChecked = [];
        (data.plan || []).forEach((meal) => {
          allExpanded.push(`meal-${meal.meal_num}`);
          allExpanded.push(`meal-${meal.meal_num}-ingredients`);
          allChecked.push(`meal-${meal.meal_num}`);
          allChecked.push(`meal-${meal.meal_num}-ingredients`);
          meal.ingredients.forEach((_, idx) => {
            allExpanded.push(`meal-${meal.meal_num}-ingredient-${idx}`);
            allChecked.push(`meal-${meal.meal_num}-ingredient-${idx}`);
          });
        });
        setExpandedKeys(allExpanded);
        setCheckedKeys(allChecked); // ✅ default all boxes checked
      } else {
        setMealPlan({ error: data.error || "Failed to generate plan." });
      }
    } catch (err) {
      setMealPlan({ error: `⚠️ Error calling backend: ${err.message}` });
    }
  };

  // 🛒 Handle login by redirecting to backend login endpoint
  const handleLogin = () => {
    window.location.href = `${backendUrl}/login`;
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

  // 🔄 Convert backend meal plan JSON into rc-tree nodes
  const buildTreeNodes = (planData) => {
    if (!planData || !planData.plan) return [];
    return (planData.plan || []).map((meal) => ({
      key: `meal-${meal.meal_num}`,
      title: `Meal ${meal.meal_num}: ${meal.name}`,
      children: [
        {
          key: `meal-${meal.meal_num}-ingredients`,
          title: "🛒 Ingredients",
          children: (meal.ingredients || []).map((ing, idx) => ({
            key: `meal-${meal.meal_num}-ingredient-${idx}`,
            title: `${ing.amount} ${ing.name}`,
            isLeaf: true,
          })),
        },
      ],
    }));
  };

  // ✨ Build JSON with only checked ingredients
  const buildCheckedPlan = () => {
    if (!mealPlan || !mealPlan.plan) return { meals: [] };
    const meals = mealPlan.plan.map((meal) => {
      const includedIngredients = (meal.ingredients || []).filter((_, idx) =>
        checkedKeys.includes(`meal-${meal.meal_num}-ingredient-${idx}`)
      );
      return {
        meal_num: meal.meal_num,
        name: meal.name,
        ingredients: includedIngredients,
      };
    });
    return { meals, meal_type: time };
  };

  // 🚀 Upload checked items to /cart
  const handleUploadToCart = async () => {
    const payload = buildCheckedPlan();
    try {
      const res = await fetch(`${backendUrl}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setCartMessage(`⚠️ Upload failed: ${data.error || "Unknown error"}`);
      } else {
        setCartMessage(
          "🧞✨ Thy chosen ingredients have flown, as if by magic, into thy cart! " +
          "Rejoice, noble master, for your pantry now awaits its bounty. " +
          "Shouldst thou desire a full scroll of these enchanted provisions, " +
          "press the 'Create Report' button and I shall conjure a complete tome for thee."
        );
      }
    } catch (err) {
      setCartMessage(`⚠️ Error uploading to cart: ${err.message}`);
    }
  };

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
              <Text
                mb={3}
                fontSize="sm"
                color="white"
                textAlign="center"
                fontFamily="'Dancing Script', cursive"
              >
                If you haven't already, create an account for Kroger, Smiths,
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
              <Button colorScheme="teal" onClick={handleLogin} w="100%">
                Grocery Store Login
              </Button>
            </Box>

            {/* Find a Store & Meal Generator Group Box */}
            <Box bg="#003366" p={4} border="none" borderRadius="md">
              <Text mb={3} fontSize="md" color="white" textAlign="left">
                🔮 Seek ye a marketplace near thy dwelling? Reveal your zip code,
                and I shall conjure its presence!
              </Text>
              <HStack mb={4}>
                <Input
                  placeholder="Enter zip code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  bg="white"
                  color="black"
                  flex="2"
                />
                <Button colorScheme="yellow" onClick={handleSearchStores} flex="1.2">
                  Search Stores
                </Button>
              </HStack>

              {/* Dropdown for stores if found */}
              {stores.length > 0 && (
                <Select placeholder="Select a store" bg="white" color="black" mb={4}>
                  {stores.map((store) => (
                    <option key={store.locationId} value={store.locationId}>
                      {store.name} - {store.address?.addressLine1},{" "}
                      {store.address?.city}, {store.address?.state}{" "}
                      {store.address?.zipCode}
                    </option>
                  ))}
                </Select>
              )}

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
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
              />

              {/* Meals Quantity Selector */}
              <Text mt={4} mb={2} fontSize="sm" color="white">
                How many feasts shall I conjure from my mystical cookbook?
              </Text>
              <Select
                value={mealCount}
                onChange={(e) => setMealCount(e.target.value)}
                bg="white"
                color="black"
                mb={4}
              >
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
              <Select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                bg="white"
                color="black"
              >
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
        <Box flex="1" display="flex" flexDirection="column" alignItems="center" p={6}>
          <Box w="60%">
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
              . With but a whisper of your desires, I shall summon meals crafted
              to your heart’s delight. From the scrolls of my enchanted cookbook,
              recipes shall appear, tailored to your cravings. And lo! I shall
              conjure forth a grocery list and place every needed treasure
              directly into your cart. Your wish is my culinary command!
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

            {/* Store Status Message */}
            {storeStatusMessage && (
              <Text
                mt={4}
                fontSize="md"
                color="yellow.300"
                textAlign="center"
                fontFamily="'Dancing Script', cursive"
              >
                {storeStatusMessage}
              </Text>
            )}
          </Box>

          {/* Genie instruction above tree */}
          {mealPlan && !mealPlan.error && (
            <Text
              mt={4}
              fontSize="md"
              color="yellow.200"
              textAlign="center"
              fontFamily="'Dancing Script', cursive"
            >
              ✨ Now, master! Mark the ingredients ye desire in thy cart,  
              and uncheck those treasures already resting within thy pantry.
            </Text>
          )}

          {/* Meal Plan Tree BELOW the labels */}
          {mealPlan && !mealPlan.error && (
            <>
              <Box w="40%" bg="white" p={4} borderRadius="md" mt={4}>
                <Tree
                  checkable
                  selectable={false}
                  expandedKeys={expandedKeys}
                  checkedKeys={checkedKeys}
                  onCheck={(keys) => setCheckedKeys(keys)}
                  onExpand={(keys) => setExpandedKeys(keys)}
                  treeData={buildTreeNodes(mealPlan)}
                  style={{ color: "black", fontSize: "16px" }}
                />
              </Box>

              {/* Upload to Cart Button */}
              <Button mt={4} colorScheme="teal" onClick={handleUploadToCart}>
                Upload to Cart
              </Button>

              {/* 🆕 Cart Genie Message */}
              {cartMessage && (
                <>
                  <Text
                    mt={3}
                    fontSize="md"
                    color="yellow.300"
                    textAlign="center"
                    fontFamily="'Dancing Script', cursive"
                  >
                    {cartMessage}
                  </Text>
                  <Button mt={3} colorScheme="yellow">
                    Create Report
                  </Button>
                </>
              )}
            </>
          )}

          {/* Error message */}
          {mealPlan && mealPlan.error && (
            <Text fontSize="lg" color="red.300" mt={6}>
              {mealPlan.error}
            </Text>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default MealPlannerApp;

