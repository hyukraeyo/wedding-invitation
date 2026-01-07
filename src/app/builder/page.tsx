"use client";

import React, { useState } from 'react';
import InvitationCanvas from '@/components/preview/InvitationCanvas';
import EditorForm from '@/components/builder/EditorForm';
import LoginModal from '@/components/auth/LoginModal';

import Header from '@/components/common/Header';

export default function BuilderPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <main className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden">
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Common Header */}
      <Header onSave={() => setIsLoginModalOpen(true)} />

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Editor */}
        <section className="w-[400px] lg:w-[480px] h-full border-r border-gray-200 bg-white shadow-xl z-20 flex flex-col">
          <div className="flex-1 overflow-hidden p-6 bg-gray-50/50">
            <EditorForm />
          </div>
        </section>

        {/* Right Panel: Preview */}
        <section className="flex-1 h-full bg-gray-200 flex items-center justify-center p-8 relative">
          <div className="absolute inset-0 pattern-grid-lg text-gray-300/[0.2] mask-gradient" />

          <div className="flex flex-col items-center gap-6 z-0 transform scale-[0.85] lg:scale-95 transition-transform duration-500">

            {/* Hyper-realistic iPhone 15 Pro Frame */}
            <div className="relative">
              {/* Physical Buttons (Positioned relative to the frame) */}
              <div className="absolute top-[110px] -left-[2px] w-[3px] h-[32px] bg-[#2d2d2d] rounded-l-md shadow-sm opacity-100"></div> {/* Action Button */}
              <div className="absolute top-[160px] -left-[2px] w-[3px] h-[60px] bg-[#2d2d2d] rounded-l-md shadow-sm opacity-100"></div> {/* Vol Up */}
              <div className="absolute top-[230px] -left-[2px] w-[3px] h-[60px] bg-[#2d2d2d] rounded-l-md shadow-sm opacity-100"></div> {/* Vol Down */}
              <div className="absolute top-[190px] -right-[2px] w-[3px] h-[90px] bg-[#2d2d2d] rounded-r-md shadow-sm opacity-100"></div> {/* Power */}

              {/* Main Device Frame (Titanium Look) */}
              <div className="relative h-[852px] w-[393px] bg-black rounded-[55px] shadow-[0_0_2px_2px_rgba(255,255,255,0.1),inset_0_0_0_2px_#525252,inset_0_0_0_6px_#000000] ring-1 ring-black/40">

                {/* Screen Bezel (Inner Black Border) */}
                <div className="absolute inset-[3px] bg-black rounded-[50px] overflow-hidden">

                  {/* Dynamic Island Area */}
                  <div className="absolute top-0 w-full h-full pointer-events-none z-50">
                    {/* Island itself */}
                    <div className="absolute top-[11px] left-1/2 -translate-x-1/2 h-[35px] w-[120px] bg-black rounded-[20px] flex items-center justify-center z-50 transition-all duration-300">
                      <div className="w-full h-full relative overflow-hidden rounded-[20px] flex items-center justify-between px-3">
                        {/* Selfie Camera */}
                        <div className="w-[12px] h-[12px] rounded-full bg-[#111] opacity-60 ml-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="absolute top-0 w-full h-[54px] z-40 flex justify-between items-end px-7 pb-2 pointer-events-none">
                    <div className="text-white text-[15px] font-semibold tracking-wide pl-2">9:41</div>
                    <div className="flex items-center gap-1.5 pr-2">
                      {/* Signal */}
                      <div className="flex items-end gap-[2px] h-[12px]">
                        <div className="w-[3px] h-[4px] bg-white rounded-[1px]"></div>
                        <div className="w-[3px] h-[6px] bg-white rounded-[1px]"></div>
                        <div className="w-[3px] h-[9px] bg-white rounded-[1px]"></div>
                        <div className="w-[3px] h-[12px] bg-white/30 rounded-[1px]"></div>
                      </div>

                      {/* Battery */}
                      <div className="ml-1 w-[22px] h-[11px] border-[1px] border-white/40 rounded-[3px] relative flex items-center p-[1px]">
                        <div className="h-full w-[60%] bg-white rounded-[1px]"></div>
                        <div className="absolute -right-[3px] top-[3px] h-[3px] w-[1.5px] bg-white/40 rounded-r-[1px]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Screen Content */}
                  <div className="w-full h-full bg-white relative">
                    <InvitationCanvas />
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full z-50 opacity-100 pointer-events-none mix-blend-difference"></div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 font-medium text-sm tracking-wide mt-2">
              MOBILE PREVIEW
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}