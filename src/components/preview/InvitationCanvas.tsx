import React from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import MainScreenView from './sections/MainScreenView';
import CalendarSectionView from './sections/CalendarSectionView';
import NamesView from './sections/NamesView';
import GreetingView from './sections/GreetingView';
import LocationView from './sections/LocationView';
import GalleryView from './sections/GalleryView';
import AccountsView from './sections/AccountsView';
import EffectsOverlay from './sections/EffectsOverlay';

const InvitationCanvas = () => {
  const { theme } = useInvitationStore();

  const fontClass = theme.font === 'serif' ? 'font-serif' : 'font-sans';

  return (
    <div className="w-full h-full bg-white relative shadow-2xl overflow-hidden md:max-w-[430px] md:mx-auto">
      <div
        className={`w-full h-full relative flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors duration-500 ${fontClass}`}
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <EffectsOverlay />

        {/* 1. Main Screen */}
        <MainScreenView />

        {/* 2. Message / Greeting */}
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
          <GreetingView />
        </div>

        {/* 3. Detailed Names */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
          <NamesView />
        </div>

        {/* 4. Calendar & D-Day */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-backwards">
          <CalendarSectionView />
        </div>

        {/* 5. Location */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900 fill-mode-backwards px-6 pb-10">
          <LocationView />
        </div>

        {/* 6. Gallery */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000 fill-mode-backwards">
          <GalleryView />
        </div>

        {/* 7. Accounts */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000 fill-mode-backwards pb-10">
          <AccountsView />
        </div>

        {/* Footer Padding */}
        <div className="h-20 flex items-center justify-center text-xs text-black/20 pb-10">
          Designed by Antigravity
        </div>
      </div>
    </div>
  );
};

export default InvitationCanvas;