import React from "react";
import { Box, Text, Link } from "@chakra-ui/react";

export default function PrivacyNotice() {
  return (
    <Box
      mt={8}
      p={4}
      borderRadius="md"
      bg="rgba(0,0,0,0.4)"
      color="white"
      fontSize="sm"
      textAlign="center"
    >
      <Text mb={2} fontWeight="bold">
        Privacy Notice
      </Text>
      <Text mb={1}>
        At GroceryCartGenie, your privacy and security are important. We use secure session cookies to keep you logged in. 
        When you log in with Kroger, we store a temporary, encrypted access token to add items to your cart on your behalf; 
        we never see your Kroger password, and tokens expire automatically.
      </Text>
      <Text mb={1}>
        Any feedback you provide is stored and linked to your session to help improve the app. 
        We do not share your personal information with third parties.
      </Text>
      <Text>
        Learn more at{" "}
        <Link href="https://www.grocerycartgenie.com/privacy" isExternal color="yellow.300">
          our Privacy Page
        </Link>
        .
      </Text>
    </Box>
  );
}
