import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  RadioGroup,
  HStack,
  Radio,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";

export default function FeedbackForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [rating, setRating] = useState("3");
  const [category, setCategory] = useState("Bug");
  const [comments, setComments] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: parseInt(rating, 10),
          category,
          comments,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Feedback submitted!",
          description: "Thank you for helping us improve.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setComments("");
        setRating("3");
        setCategory("Bug");
        onClose();
      } else {
        toast({
          title: "Error submitting feedback",
          description: result.error || "Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Unable to reach server.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button
        size="sm"
        colorScheme="cyan"
        variant="outline"
        mt={2}
        onClick={onOpen}
      >
        Leave Feedback
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="white" color="black">
          <ModalHeader>Submit Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Rating */}
            <FormControl mb={4}>
              <FormLabel>⭐ Rating</FormLabel>
              <RadioGroup onChange={setRating} value={rating}>
                <HStack spacing={4}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Radio key={num} value={String(num)}>
                      {num}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroup>
            </FormControl>

            {/* Category */}
            <FormControl mb={4}>
              <FormLabel>📂 Category</FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Bug">Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="UX">User Experience</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            {/* Comments */}
            <FormControl>
              <FormLabel>📝 Comments</FormLabel>
              <Textarea
                placeholder="Enter your feedback here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
