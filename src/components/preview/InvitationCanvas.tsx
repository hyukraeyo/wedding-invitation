"use client";

import React from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Calendar, MapPin, Heart, Clock } from 'lucide-react';
import Image from 'next/image';

export default function InvitationCanvas() {
  const { groomName, brideName, date, time, location, message, imageUrl, theme, gallery, accounts } = useInvitationStore();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // Dynamic Styles
  const containerStyle = {
    backgroundColor: theme.backgroundColor,
    color: theme.accentColor,
    borderRadius: '40px',
  };

  const fontClass = theme.font === 'serif' ? 'font-serif' : 'font-sans';
  const accentColor = theme.accentColor;

  return (
    <div className="w-full h-full bg-white">
      <div
        className={`w-full h-full relative flex flex-col items-center transition-colors duration-500 ${fontClass}`}
        style={{ backgroundColor: theme.backgroundColor, color: theme.accentColor }}
      >
        {/* Pattern Overlay */}
        {theme.pattern !== 'none' && (
          <div className={`absolute inset-0 pointer-events-none opacity-10 bg-repeat
             ${theme.pattern === 'flower-sm' ? 'bg-[url("https://www.transparenttextures.com/patterns/flower-trail.png")]' : ''}
             ${theme.pattern === 'flower-lg' ? 'bg-[url("https://www.transparenttextures.com/patterns/floral-linen.png")]' : ''}
           `} />
        )}

        {/* Effect Overlay */}
        {theme.effect !== 'none' && (
          <div className={`absolute inset-0 pointer-events-none z-20 overflow-hidden ${theme.effectOnlyOnMain ? 'h-[400px]' : 'h-full'}`}>

            {/* Snow Effect */}
            {theme.effect === 'snow' && Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-[-20px] text-white/80 animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${2 + Math.random() * 3}s`, // Faster fall
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${8 + Math.random() * 8}px`,
                  textShadow: '0 0 5px rgba(255,255,255,0.8)'
                }}
              >•</div>
            ))}

            {/* Cherry Blossom Effect */}
            {theme.effect === 'cherry-blossom' && Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-[-20px] text-pink-300/70 animate-fall-sway"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${14 + Math.random() * 10}px`
                }}
              >🌸</div>
            ))}

            {/* Leaves Effect */}
            {theme.effect === 'leaves' && Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-[-20px] text-amber-700/60 animate-fall-tumbling"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${16 + Math.random() * 8}px`
                }}
              >🍂</div>
            ))}

            {/* Forsythia Effect (Yellow Flowers) */}
            {theme.effect === 'forsythia' && Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-[-20px] text-yellow-400/70 animate-fall-sway"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${5 + Math.random() * 4}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${12 + Math.random() * 8}px`
                }}
              >🌼</div>
            ))}

            {/* Baby's Breath Effect (Small White Clusters, Floating) */}
            {theme.effect === 'babys-breath' && Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-[-20px] text-white/40 animate-float-slow"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${8 + Math.random() * 8}s`, // Very slow
                  animationDelay: `${Math.random() * 8}s`,
                  fontSize: `${8 + Math.random() * 6}px`
                }}
              >☁️</div>
            ))}

          </div>
        )}

        {/* Dynamic Frame Border */}
        <div className="absolute inset-4 border rounded-[32px] pointer-events-none opacity-50 z-20" style={{ borderColor: accentColor }}></div>

        {/* Scrollable Content Area */}
        <div className={`w-full h-full overflow-y-auto scrollbar-hide z-10 ${theme.animateEntrance ? 'animate-in slide-in-from-bottom-4 fade-in duration-1000' : ''}`}>

          {/* Top Section: Illustration / Image */}
          <div className="w-full h-[400px] relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: `${accentColor}20` }}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Couple"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center opacity-50" style={{ color: accentColor }}>
                <Heart size={64} strokeWidth={1} />
                <span className="mt-4 italic text-lg opacity-70">Your Photo Here</span>
              </div>
            )}
          </div>

          {/* Names Section */}
          <div className="px-8 pt-12 text-center">
            {theme.showSubtitleEng && (
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-60 mb-3" style={{ color: accentColor }}>
                Wedding Invitation
              </div>
            )}
            <div className="text-3xl font-medium tracking-wide flex justify-center items-center gap-3">
              <span>{groomName}</span>
              <span className="text-xl opacity-60">&</span>
              <span>{brideName}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-16 h-[1px] mx-auto my-10 opacity-30" style={{ backgroundColor: accentColor }}></div>

          {/* Message Section */}
          <div className="px-10 text-center">
            <p className="whitespace-pre-wrap leading-relaxed opacity-90 text-sm">
              {message}
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-16 mb-20 px-6 flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full border opacity-80 flex items-center justify-center mb-2" style={{ borderColor: `${accentColor}50`, color: accentColor }}>
                <Calendar size={20} />
              </div>
              <div className="text-lg font-medium">{formatDate(date)}</div>
              <div className="text-sm opacity-80 flex items-center gap-1">
                <Clock size={12} /> {time}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-4">
              <div className="w-12 h-12 rounded-full border opacity-80 flex items-center justify-center mb-2" style={{ borderColor: `${accentColor}50`, color: accentColor }}>
                <MapPin size={20} />
              </div>
              <div className="text-lg text-center leading-tight font-medium">
                {location}
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          {gallery.length > 0 && (
            <div className="mb-20 px-4 w-full">
              <h3 className="text-center font-serif text-xl mb-6 opacity-90">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {gallery.map((img, i) => (
                  <div key={i} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                    <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account Section */}
          <div className="mb-24 px-6 w-full space-y-4">
            <h3 className="text-center font-serif text-xl mb-6 opacity-90">마음 전하실 곳</h3>

            {accounts.map((acc, idx) => (
              <div key={idx} className="w-full">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-white/50 backdrop-blur-sm" style={{ borderColor: `${accentColor}30` }}>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-bold opacity-60 ml-1">{acc.type === 'groom' ? '신랑측' : '신부측'}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{acc.bank}</span>
                      <span className="text-sm opacity-80">{acc.accountNumber}</span>
                    </div>
                    <span className="text-xs opacity-60 ml-1">예금주: {acc.holder}</span>
                  </div>
                  <button
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                    onClick={() => alert(`복사되었습니다: ${acc.bank} ${acc.accountNumber}`)}
                  >
                    <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">복사</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Area */}
          <div className="pb-12 px-8">
            <button
              className="w-full py-4 border rounded-full text-sm hover:opacity-80 transition-all duration-300 uppercase tracking-wider"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              보내는 마음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}