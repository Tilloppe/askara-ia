import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { Spinner, Box, Heading, Text } from '@chakra-ui/react';

// Composant de chargement avec gestion d'erreur
const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
    <Spinner size="xl" />
  </Box>
);

// Boundary d'erreur
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Erreur capturée:', error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <Box p={4}>
        <Heading size="xl">Une erreur est survenue</Heading>
        <Text mt={4}>Veuillez recharger la page ou réessayer plus tard.</Text>
      </Box>
    );
  }

  return <>{children}</>;
};

// Lazy load pages avec gestion d'erreur améliorée
const lazyWithRetry = (componentImport: any) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Erreur de chargement du module:', error);
      throw error;
    }
  });

// Chargement différé des pages
const Login = lazyWithRetry(() => import('./pages/Login'));
const HelpCenterPage = lazyWithRetry(() => import('./pages/HelpCenterPage'));
const HelpFaqPage = lazyWithRetry(() => import('./pages/help/FaqPage'));
const HelpSupportPage = lazyWithRetry(() => import('./pages/help/SupportPage'));
const HelpVideosPage = lazyWithRetry(() => import('./pages/help/VideosPage'));
const HelpDocumentationPage = lazyWithRetry(() => import('./pages/help/DocumentationPage'));
const HelpDepannagePage = lazyWithRetry(() => import('./pages/help/DepannagePage'));
const HelpAstucePage = lazyWithRetry(() => import('./pages/help/AstucePage'));
const HelpGuidePage = lazyWithRetry(() => import('./pages/help/GuidePage'));
const CommunityPage = lazyWithRetry(() => import('./pages/CommunityPage'));
const UpdatesPage = lazyWithRetry(() => import('./pages/UpdatesPage'));
const Logout = lazyWithRetry(() => import('./pages/Logout'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Patients = lazyWithRetry(() => import('./pages/Patients'));
const NewPatient = lazyWithRetry(() => import('./pages/NewPatient'));
const Contacts = lazyWithRetry(() => import('./pages/Contacts'));
const NewContact = lazyWithRetry(() => import('./pages/NewContact'));
const Documents = lazyWithRetry(() => import('./pages/Documents'));
const DocumentDetail = lazyWithRetry(() => import('./pages/DocumentDetail'));
const PricingPage = lazyWithRetry(() => import('./pages/PricingPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const HelpAndSupportPage = lazyWithRetry(() => import('./pages/HelpAndSupportPage'));
const DocumentationPage = lazyWithRetry(() => import('./pages/DocumentationPage'));
const ProfilePage = lazyWithRetry(() => import('./pages/ProfilePage'));
const TeamPage = lazyWithRetry(() => import('./pages/TeamPage'));
const SoftwareGatewayPage = lazyWithRetry(() => import('./pages/SoftwareGatewayPage'));
const IconTestPage = lazyWithRetry(() => import('./pages/IconTestPage'));
const DocumentCustomization = lazyWithRetry(() => import('./pages/DocumentCustomization'));

// Layout protégé avec gestion du chargement
const ProtectedLayout = () => (
  <Layout>
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </Suspense>
  </Layout>
);

// Composant pour les routes protégées
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Vérifier si l'utilisateur est authentifié via localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Composant pour les routes publiques (comme login, 404, etc.)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  // Si l'utilisateur est déjà connecté, on le redirige vers le tableau de bord
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Route de connexion */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        {/* Route de déconnexion */}
        <Route path="/logout" element={<Logout />} />
        
        {/* Layout protégé */}
        <Route element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients">
            <Route index element={<Patients />} />
            <Route path="new" element={<NewPatient />} />
          </Route>
          <Route path="contacts">
            <Route index element={<Contacts />} />
            <Route path="new" element={<NewContact />} />
          </Route>
          <Route path="documents" element={<Documents />} />
          <Route path="documents/:id" element={<DocumentDetail />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="help">
            <Route index element={<HelpCenterPage />} />
            <Route path="faq" element={<HelpFaqPage />} />
            <Route path="support" element={<HelpSupportPage />} />
            <Route path="videos" element={<HelpVideosPage />} />
            <Route path="legacy" element={<HelpAndSupportPage />} />
            <Route path="documentation" element={<HelpDocumentationPage />} />
            <Route path="depannage" element={<HelpDepannagePage />} />
            <Route path="astuce" element={<HelpAstucePage />} />
            <Route path="guide" element={<HelpGuidePage />} />
          </Route>
          <Route path="community" element={<CommunityPage />} />
          <Route path="updates" element={<UpdatesPage />} />
          <Route path="documentation" element={<DocumentationPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="equipe" element={<TeamPage />} />
          <Route path="software-gateway" element={<SoftwareGatewayPage />} />
          <Route path="passerelle" element={<Navigate to="/software-gateway" replace />} />
          <Route path="test-icons" element={<IconTestPage />} />
          <Route path="personnalisation" element={<DocumentCustomization />} />
          {/* Ajoutez ici d'autres routes protégées au besoin */}
        </Route>
        
        {/* Page 404 - Doit être la dernière route */}
        <Route
          path="*"
          element={
            <ErrorBoundary>
              <Box p={4}>
                <Heading size="xl">404 - Page non trouvée</Heading>
                <Text mt={4}>La page que vous recherchez n'existe pas ou a été déplacée.</Text>
              </Box>
            </ErrorBoundary>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
