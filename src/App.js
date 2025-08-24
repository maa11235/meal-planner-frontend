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

  return (
    <ChakraProvider>
      <Flex height="100vh">
        {/* Sidebar (left) */}
        <Box
          w="300px"
          bg={colorMode === "light" ? "gray.100" : "gray.900"}
          p={6}
          borderRight="1px solid"
          borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
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
            <Box>
              <Text fontSize="sm" mb={1}>
                Enter Meal Type
              </Text>
              <Input placeholder="e.g. vegetarian" />
            </Box>

            <Box>
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
          <Heading size="lg" mb={4}>
            Your Weekly Plan
          </Heading>
          <Text color="gray.500">
            The generated meal plan will appear here once you submit your
            preferences.
          </Text>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
