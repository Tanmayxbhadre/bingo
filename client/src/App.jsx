import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { RoomPage } from './pages/RoomPage.jsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.jsx';
import { PlayfulBackground } from './components/PlayfulBackground.jsx';
import { FloatingReactions } from './components/FloatingReactions.jsx';

export default function App() {
  return (
    <GameProvider>
      <PlayfulBackground />
      <FloatingReactions />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomCode" element={<RoomPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

