/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { FeaturePage } from './pages/FeaturePage';
import { Practice } from './pages/Practice';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { HistoryPage } from './pages/History';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { UserProfile } from './types';

const DEFAULT_USER: UserProfile = {
  name: `EQ玩家_${Math.floor(Math.random() * 10000)}`,
  avatar: '✨',
  usageCount: 0,
  practiceCount: 0,
  eqDimensions: {
    selfAwareness: 50,
    selfRegulation: 50,
    socialAwareness: 50,
    socialRegulation: 50,
    sceneAdaptation: 50,
    expression: 50,
  },
};


export default function App() {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('eq_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem('eq_user', JSON.stringify(user));
  }, [user]);

  return (
    <BrowserRouter>
      <AppRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  );
}

function AppRoutes({ user, setUser }: { user: UserProfile, setUser: (u: UserProfile) => void }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#333333] font-sans selection:bg-blue-100">
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/feature/:type" element={<FeaturePage user={user} setUser={setUser} />} />
            <Route path="/practice" element={<Practice user={user} setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


