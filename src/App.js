import React, { useState, useEffect } from "react";
import "./App.css";
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
import FeedbackForm from "./components/FeedbackForm";
import PrivacyNotice from "./components/PrivacyNotice";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from "react-router-dom";

// Theme with dark green background
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#FFFAFA", // snow
        color: "black",
        fontFamily: "'Dancing Script', cursive"
      },
    },
  },
});

// Gradient for CartGenie text
const planGradient = "linear(to-r, #ff595e, #ffca3a, #8ac926, #1982c4)";

// 🆕 Custom hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

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

  // 🆕 state for upload-to-cart message & payload
  const [cartMessage, setCartMessage] = useState("");
  const [cartResponse, setCartResponse] = useState(null); // store /cart response for /report
  const [lastCartPayload, setLastCartPayload] = useState(null); // 🆕 store the exact payload (with instructions) sent to /cart
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  // 🆕 detect mobile
  const isMobile = useIsMobile();

  const handleGeneratePlan = async () => {
    try {
      setLoadingPlan(true);
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
        setCartResponse(null); // reset report data
        setLastCartPayload(null); // reset saved payload

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
      setLoadingPlan(false);
    } catch (err) {
      setMealPlan({ error: `⚠️ Error calling backend: ${err.message}` });
      setLoadingPlan(false);
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
    if (window.location.href.includes("grocerycartgenie.com")) {
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

  // ✨ Build JSON with only checked ingredients, but include instructions in payload
  const buildCheckedPlan = () => {
    if (!mealPlan || !mealPlan.plan) return { meals: [] };
    const meals = mealPlan.plan.map((meal) => {
      const includedIngredients = (meal.ingredients || []).filter((_, idx) =>
        checkedKeys.includes(`meal-${meal.meal_num}-ingredient-${idx}`)
      );
      return {
        meal_num: meal.meal_num,
        name: meal.name,
        instructions: meal.instructions, // ✅ include instructions in payload
        ingredients: includedIngredients,
      };
    });
    return { meals, meal_type: time };
  };

  // 🚀 Upload checked items to /cart
  const handleUploadToCart = async () => {
    setLoadingCart(true);
    const payload = buildCheckedPlan();
    setLastCartPayload(payload); // ✅ remember exactly what we sent (with instructions)
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
        setCartResponse(data); // store response for /report
        setCartMessage(
          "🧞✨ Thy chosen ingredients have flown, as if by magic, into thy cart! " +
            "Rejoice, noble master, for your pantry now awaits its bounty. " +
            "Shouldst thou desire a full scroll of these enchanted provisions, " +
            "press the 'Create Report' button and I shall conjure a complete tome for thee."
        );
      }
      setLoadingCart(false);
    } catch (err) {
      setCartMessage(`⚠️ Error uploading to cart: ${err.message}`);
      setLoadingCart(false);
    }
  };

  // 📝 Handle Create Report
  const handleCreateReport = async () => {
    if (!cartResponse || !mealPlan) {
      setCartMessage("⚠️ No cart data or meal plan available to generate a report.");
      return;
    }
    try {
      const reportBody = {
        ...cartResponse,
        meals: (mealPlan.plan || []).map((meal) => ({
          meal_num: meal.meal_num,
          name: meal.name,
          instructions: meal.instructions,
          ingredients: meal.ingredients || [],
        })),
        meal_type: time,
      };

      const res = await fetch(`${backendUrl}/report`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportBody),
      });

      if (!res.ok) {
        const errData = await res.json();
        setCartMessage(`⚠️ Report failed: ${errData.error || "Unknown error"}`);
      } else {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "meal_plan_report.pdf";
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setCartMessage(`⚠️ Error generating report: ${err.message}`);
    }
  };

  // 🆕 determine whether to show left panel (mobile only)
  const showLeftPanel = !isMobile || (isMobile && (!mealPlan || loadingPlan));
  const showMainPanel = !isMobile || (isMobile && mealPlan && !loadingPlan);

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" minH="100vh">
        {/* Left Sidebar */}
        {showLeftPanel && (
          <Box w={{ base: "100%", md: "325px" }} p={6}>
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
                  color="#003366"
                  fontFamily="'Cinzel Decorative', cursive"
                  fontWeight="bold"
                >
                  GroceryCartGenie
                </Text>
              </Heading>

              {/* Your Recipe Wish Label */}
              <Heading as="h2" size="md" textAlign="center" color="black">
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

                <Text mb={3} fontSize="md" color="white" textAlign="left">
                  Log in and let your pantry be filled with treasures.
                </Text>
                <Button colorScheme="yellow" onClick={handleLogin} w="100%">
                  Grocery Store Login
                </Button>
                {isMobile && loginStatusMessage && (
                  <Text
                    mt={3}
                    fontSize="sm"
                    color="yellow.300"
                    textAlign="center"
                    fontFamily="'Dancing Script', cursive"
                  >
                    {loginStatusMessage}
                  </Text>
                )}
              </Box>

              {/* Find a Store & Meal Generator Group Box */}
              <Box bg="#003366" p={4} border="none" borderRadius="md">
                <Text mb={3} fontSize="md" color="white" textAlign="left">
                  🔮 Reveal your zip code,
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
                    Find Stores
                  </Button>
                </HStack>

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

                <Text mb={3} fontSize="md" color="white" textAlign="left">
                  Shall these creations be for breakfast, lunch,
                  dinner, snacks or desserts?
                </Text>
                <Select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  bg="white"
                  color="black"
                  mb={4}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                </Select>
                <Text mb={3} fontSize="md" color="white" textAlign="left">
                  Describe the delights you seek — For example:
                  <br /> Toddler-friendly treasures
                  <br /> Sweets fit for a diabetic
                  <br /> West African entrees
                  <br /> Meals by [famous chef]
                  <br /> Your wish is my recipe command!
                </Text>
                <Input
                  placeholder="Unique meal description"
                  bg="white"
                  color="black"
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                />

                <Text mb={3} fontSize="md" color="white" textAlign="left">
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
              </Box>

              {/* New Generate Meal Plan Group Box */}
              <Box bg="#003366" p={4} border="none" borderRadius="md">
                <Button colorScheme="yellow" w="100%" onClick={handleGeneratePlan}>
                  Generate Meal Plan
                </Button>
                {loadingPlan && (
                  <div className="spinner-row">
                    <div className="spinner"></div>
                    <span>Conjuring meals...</span>
                  </div>
                )}
              </Box>
            </VStack>
          </Box>
        )}

        {/* Main Content */}
        {showMainPanel && (
          <Box flex="1" display="flex" flexDirection="column" alignItems="center" p={6} position="relative" minH="0">
            <Box w="60%">
              <Text
                fontSize="xl"
                fontFamily="'Dancing Script', cursive"
                color="black"
                textAlign="center"
              >
                Welcome, seeker of flavor, to{" "}
                <span role="img" aria-label="genie">
                  🧞
                </span>{" "}
                <Text
                  as="span"
                  color="#003366"
                  fontWeight="bold"
                  fontFamily="'Cinzel Decorative', cursive"
                >
                  GroceryCartGenie
                </Text>
                . With but a whisper of your desires, I shall summon meals crafted
                to your heart’s delight. From the scrolls of my enchanted cookbook,
                recipes shall appear, tailored to your cravings. And lo! I shall
                conjure forth a grocery list and place every needed treasure
                directly into your cart. Your wish is my culinary command!
              </Text>
              {!isMobile && loginStatusMessage && (
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

              {!isMobile && storeStatusMessage && (
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

            {mealPlan && !mealPlan.error && (
              <Text
                mt={4}
                fontSize="md"
                color="yellow.300"
                textAlign="center"
                fontFamily="'Dancing Script', cursive"
              >
                ✨ Now, master! Mark the ingredients ye desire in thy cart,  
                and uncheck those treasures already resting within thy pantry.
              </Text>
            )}

            {mealPlan && !mealPlan.error && (
              <>
                <Box
                  w={{ base: "100%", md: "40%" }}   // full width on mobile, 40% on desktop
                  bg="white"
                  p={4}
                  borderRadius="md"
                  mt={4}
                  alignSelf={{ base: "flex-start", md: "center" }} // left align on mobile
                >
                  <Tree
                    checkable
                    selectable={false}
                    expandedKeys={expandedKeys}
                    checkedKeys={checkedKeys}
                    onCheck={(keys) => setCheckedKeys(keys)}
                    onExpand={(keys) => setExpandedKeys(keys)}
                    treeData={buildTreeNodes(mealPlan)}
                    style={{ color: "black", fontSize: "16px", wordWrap: "break-word" }}
                  />

                  {/* 🆕 Meal instructions below the tree */}
                  {(mealPlan.plan || []).map((meal) => (
                    <Box key={`meal-instructions-${meal.meal_num}`} mt={4}>
                      <Text fontWeight="bold" color="black">
                        {meal.name}
                      </Text>
                      <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                        {meal.instructions}
                      </Text>
                    </Box>
                  ))}
                </Box>

                <Button mt={4} colorScheme="teal" onClick={handleUploadToCart}>
                  Upload to Cart
                </Button>
                {loadingCart && (
                  <div className="spinner-row">
                    <div className="spinner"></div>
                    <span>Summoning your cart...</span>
                  </div>
                )}
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
                    <Button mt={3} colorScheme="yellow" onClick={handleCreateReport}>
                      Create Report
                    </Button>
                  </>
                )}
              </>
            )}

            {mealPlan && mealPlan.error && (
              <Text fontSize="lg" color="red.300" mt={6}>
                {mealPlan.error}
              </Text>
            )}
            <Box mt="auto" textAlign="center">
              {/* Updated privacy link */}
              <RouterLink to="/privacy">
                <Text as="span" color="yellow.300" fontWeight="bold" cursor="pointer">
                  privacy
                </Text>
              </RouterLink>
            </Box>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
}

// Wrap the app with Router
export default function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MealPlannerApp />} />
        <Route path="/privacy" element={<PrivacyNotice />} />
      </Routes>
    </Router>
  );
}
