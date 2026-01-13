
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage, SignupPage } from './pages/Auth';
import { StudioPage } from './pages/Studio';
import { CharactersPage } from './pages/Characters';
import { AssetsPage } from './pages/Assets';
import { CreativePage } from './pages/Creative';
import { SavedPromptsPage } from './pages/SavedPrompts';
import { mockStore } from './services/mockStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = mockStore.getUser();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/" element={<Navigate to="/studio" replace />} />
        
        <Route path="/studio" element={
          <ProtectedRoute>
            <StudioPage />
          </ProtectedRoute>
        } />
        
        <Route path="/creative" element={
          <ProtectedRoute>
            <CreativePage />
          </ProtectedRoute>
        } />
        
        <Route path="/assets" element={
          <ProtectedRoute>
            <AssetsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/characters" element={
          <ProtectedRoute>
            <CharactersPage />
          </ProtectedRoute>
        } />

        <Route path="/saved-prompts" element={
          <ProtectedRoute>
            <SavedPromptsPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
