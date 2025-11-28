import React from 'react';
import { Sidebar } from './layout/Sidebar';
import { Topbar } from './layout/Topbar';
import { MobileNav } from './layout/MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans transition-colors">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Main content with padding-bottom for mobile nav */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
};
