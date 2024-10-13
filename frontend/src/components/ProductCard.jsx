import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Modal,
  Text,
  useColorModeValue,
  useToast,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { useState } from "react";

function ProductCard({ product }) {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { deleteProduct, updateProduct } = useProductStore();

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (!success) {
      toast({
        title: "error",
        description: message,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
    }
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success } = await updateProduct(pid, updatedProduct);
    onClose();
    if (!success) {
      toast({
        title: "error",
        description: "Error updating product",
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: "product updated successfully",
        status: "success",
        isClosable: true,
      });
    }
  };

  return (
    <Box
      shadow={"lg"}
      rounded={"lg"}
      overflow={"hidden"}
      transition={"all 0.3"}
      _hover={{
        transform: "translatey(-5px)",
        shadow: "xl",
      }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w="full"
        objectFit={"cover"}
      />

      <Box p={4}>
        <Heading as={"h3"} size={"md"} mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight={"bold"} fontSize={"xl"} color={textColor} mb={4}>
          ${product.price}
        </Text>

        <HStack spacing={2}>
          <IconButton icon={<EditIcon />} colorScheme="blue" onClick={onOpen} />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => handleDeleteProduct(product._id)}
            colorScheme="red"
          />
        </HStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                name="name"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    name: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Price"
                name="price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    price: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Image URL"
                name="image"
                value={updatedProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    image: e.target.value,
                  })
                }
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ProductCard;
