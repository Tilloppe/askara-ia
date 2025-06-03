import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box w="100vw" h="100vh" bg={bgColor} overflowX="hidden">
      <Flex h="100%">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <Flex direction="column" flex={1} minW={0} maxW="100vw">
          {/* Top Navigation Bar */}
          <Box 
            bg="white" 
            px={6} 
            py={4} 
            borderBottom="1px" 
            borderColor="gray.200"
            flexShrink={0}
            w="100%"
          >
            <Flex justify="space-between" align="center">
              <Box>
                {/* Page title will be set by individual pages */}
              </Box>
              
              {/* User profile/notification area */}
              <Box>
                {/* Will be implemented later */}
              </Box>
            </Flex>
          </Box>
          
          {/* Page Content */}
          <Box flex={1} overflowY="auto" p={6} w="100%" maxW="100%">
            {children}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Layout;
