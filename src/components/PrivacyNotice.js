// components/PrivacyNotice.js
import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export default function PrivacyNotice() {
  return (
    <Box p={6} minH="100vh" bg="#2e7d32" color="white">
      <VStack align="start" spacing={4}>
        <Heading size="lg">Privacy Information</Heading>

        <Heading size="md">Cookies & Sessions</Heading>
        <Text>
          We use a secure session cookie to keep you logged in. It does not store personal data.
        </Text>

        <Heading size="md">Kroger Login</Heading>
        <Text>We use Kroger’s official login system (OAuth).</Text>
        <Text>We never see your Kroger password.</Text>
        <Text>With your permission, we can add items to your Kroger cart.</Text>
        <Text>Tokens expire in ~1 hour, and we do not store long-term refresh tokens.</Text>

        <Heading size="md">Data Storage</Heading>
        <Text>Your Kroger access token is stored securely (encrypted).</Text>
        <Text>Feedback you provide is stored and linked to your session ID.</Text>

        <Heading size="md">Data Retention</Heading>
        <Text>Tokens expire automatically.</Text>
        <Text>Feedback may be kept indefinitely to help us improve the app.</Text>
      </VStack>
    </Box>
  );
}
