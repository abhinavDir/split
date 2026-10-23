import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { MobileDrawer } from './MobileDrawer';
import { AddExpenseModal } from '../expenses/AddExpenseModal';
import { CreateGroupModal } from '../groups/CreateGroupModal';
import { GroupBillPreviewModal } from '../groups/GroupBillPreviewModal';

import { useTheme } from '../../context/ThemeContext';

export function AppLayout() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const location = useLocation();
  const isProfile = location.pathname === '/profile';
  const isFullBleed = location.pathname === '/dashboard' || location.pathname === '/' || isProfile;
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [liveBillData, setLiveBillData] = useState(null);
  const [isLiveBillOpen, setIsLiveBillOpen] = useState(false);

  // Global socket listener: pops up the bill preview on everyone's screen in real time
  useEffect(() => {
    const handleBillPreview = (e) => {
      const data = e.detail;
      if (data) {
        setLiveBillData(data);
        setIsLiveBillOpen(true);
      }
    };

    window.addEventListener('group:bill-preview', handleBillPreview);
    return () => {
      window.removeEventListener('group:bill-preview', handleBillPreview);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isLight ? '#f8fafc' : '#000000',
        color: isLight ? '#0f172a' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      {/* Universal Topbar across all pages (except Profile which has its dedicated header) */}
      {!isProfile && (
        <Topbar
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: isFullBleed ? '0' : '20px 18px 20px 18px',
          maxWidth: isFullBleed ? '100%' : '1440px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <Outlet
          context={{
            onOpenAddExpense: () => setIsAddExpenseOpen(true),
            onOpenCreateGroup: () => setIsCreateGroupOpen(true),
            onOpenMobileDrawer: () => setIsMobileDrawerOpen(true),
          }}
        />
      </main>

      {/* Website Footer on desktop / Watermark on mobile */}
      <Footer />

      {/* Mobile Bottom Navigation (Visible only below 768px via .hidden-desktop) */}
      <MobileNav />

      {/* Slide-in Mobile All-Pages Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        onOpenAddExpense={() => {
          setIsMobileDrawerOpen(false);
          setIsAddExpenseOpen(true);
        }}
        onOpenCreateGroup={() => {
          setIsMobileDrawerOpen(false);
          setIsCreateGroupOpen(true);
        }}
      />

      {/* Global Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />

      {isLiveBillOpen && (
        <GroupBillPreviewModal
          isOpen={isLiveBillOpen}
          onClose={() => setIsLiveBillOpen(false)}
          billData={liveBillData}
        />
      )}
    </div>
  );
}

