// src/App.js
import React from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <ChakraProvider>
      <Box bg={colorMode === "light" ? "gray.50" : "gray.800"} minH="100vh">
        {/* Header */}
        <Box
          as="header"
          bg={colorMode === "light" ? "teal.500" : "teal.600"}
          color="white"
          py={4}
          px={6}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="md">Plan2Pantry</Heading>
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="white"
          />
        </Box>

        {/* Main content */}
        <Container maxW="md" py={10}>
          <VStack
            spacing={6}
            p={8}
            bg={colorMode === "light" ? "white" : "gray.700"}
            boxShadow="lg"
            rounded="xl"
          >
            <Heading size="lg" textAlign="center">
              Weekly Meal Planner
            </Heading>
            <Text textAlign="center" color="gray.500">
              Click below to generate a personalized meal plan for the week.
            </Text>

            <Button colorScheme="teal" size="lg" w="full">
              Generate Meal Plan
            </Button>

            <Box
              w="full"
              p={4}
              border="1px"
              borderColor="gray.200"
              rounded="md"
              minH="100px"
            >
              <Text fontSize="sm" color="gray.400">
                Meal plan results will appear here...
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
