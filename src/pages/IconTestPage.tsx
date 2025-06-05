import { Box, VStack, Heading } from '@chakra-ui/react';
import IconTest from '../components/IconTest';

const IconTestPage = () => {
  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={6}>Test des icônes</Heading>
        <IconTest />
      </VStack>
    </Box>
  );
};

export default IconTestPage;
