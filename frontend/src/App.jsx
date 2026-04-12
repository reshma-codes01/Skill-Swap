import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CreateSwapModal from './components/CreateSwapModal';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Requests from './pages/Requests';
import ChatPage from './pages/ChatPage';
import Inbox from './pages/Inbox';

function AppContent() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen font-sans relative flex flex-col transition-colors duration-300">
      <Navbar 
        onLoginClick={() => setAuthOpen(true)} 
        onCreateClick={() => setCreateOpen(true)}
      />
      
      <main className="flex-grow flex flex-col w-full relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home onLoginClick={() => setAuthOpen(true)} />} />
            <Route path="/explore" element={<Explore onLoginClick={() => setAuthOpen(true)} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/chat/:swapId/:otherUserId" element={<ChatPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer 
  onLoginClick={() => setAuthOpen(true)} 
  onCreateClick={() => setCreateOpen(true)} 
/>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
      <CreateSwapModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster theme="system" richColors position="bottom-right" />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
