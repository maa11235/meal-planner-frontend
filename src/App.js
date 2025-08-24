// src/App.js
import React from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = colorMode === "light" ? "green.50" : "green.900";
  const cardColor = colorMode === "light" ? "white" : "gray.800";

  return (
    <ChakraProvider>
      <Flex height="100vh" bg={bgColor}>
        {/* Sidebar (left) */}
        <Box
          w="300px"
          p={6}
          borderRight="1px solid"
          borderColor={colorMode === "light" ? "green.200" : "green.700"}
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="md">Meal Planner</Heading>
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              size="sm"
            />
          </Flex>

          <VStack spacing={4} align="stretch">
            <Box bg={cardColor} p={3} borderRadius="md" shadow="sm">
              <Text fontSize="sm" mb={1}>
                Enter Meal Type
              </Text>
              <Input placeholder="e.g. vegetarian" />
            </Box>

            <Box bg={cardColor} p={3} borderRadius="md" shadow="sm">
              <Text fontSize="sm" mb={1}>
                Notes / Preferences
              </Text>
              <Textarea placeholder="No seafood, gluten-free, etc." />
            </Box>

            <Button colorScheme="teal" width="full">
              Generate Plan
            </Button>
          </VStack>
        </Box>

        {/* Main Content (right) */}
        <Box flex="1" p={8} overflowY="auto">
          <Box bg={cardColor} p={6} borderRadius="md" shadow="sm">
            <Heading size="lg" mb={4}>
              Your Weekly Plan
            </Heading>
            <Text color="gray.500">
              The generated meal plan will appear here once you submit your
              preferences.
            </Text>
          </Box>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
