import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import theme from './theme/theme';
import AppRoutes from './routes';

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Router>
          <AppRoutes />
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
