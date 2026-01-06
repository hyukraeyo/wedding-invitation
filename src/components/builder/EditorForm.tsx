"use client";

import React, { ChangeEvent, useState } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { ChevronDown, ChevronUp, User2, Calendar, MapPin, Image as ImageIcon, MessageSquare, CheckCircle2, Palette, CreditCard, ImagePlus, Trash2 } from 'lucide-react';

// Accordion Item Component
const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children, isCompleted = false }: any) => {
  return (
    <div className="bg-white rounded-xl mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className={`text-forest-green ${isOpen ? 'opacity-100' : 'opacity-70'}`} />}
          <span className={`font-medium text-gray-800 ${isOpen ? 'text-forest-green font-semibold' : ''}`}>{title}</span>
          {isCompleted && !isOpen && <CheckCircle2 size={16} className="text-forest-green/60 ml-2" />}
        </div>
        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="px-5 pb-6 pt-1 border-t border-gray-100/50 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default function EditorForm() {
  const {
    groomName, setGroomName,
    brideName, setBrideName,
    date, setDate,
    time, setTime,
    location, setLocation,
    message, setMessage,
    setImageUrl,
    imageUrl,
    theme,
    setTheme,
    gallery,
    setGallery,
    accounts,
    setAccounts
  } = useInvitationStore();

  // State to track open accordion section
  const [openSection, setOpenSection] = useState<string | null>('basic');

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-1 py-2">
      <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 px-1">청첩장 정보 입력</h2>

      <div className="space-y-1">

        {/* 0. Theme Settings (New Feature) */}
        <AccordionItem
          title="테마 설정"
          icon={Palette}
          isOpen={openSection === 'theme'}
          onToggle={() => handleToggle('theme')}
          isCompleted={true}
        >
          <div className="space-y-6">

            {/* Font */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">글꼴</label>
              <div className="flex gap-2">
                <select
                  value={theme.font}
                  onChange={(e) => setTheme({ font: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-forest-green"
                >
                  <option value="serif">명조체 (Serif)</option>
                  <option value="sans">고딕체 (Sans)</option>
                </select>
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">배경 색상</label>
              <div className="flex gap-3">
                {['#F9F8E6', '#FFEFF4', '#F4F1EA', '#EDF2F7', '#FFFFFF'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setTheme({ backgroundColor: color })}
                    className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${theme.backgroundColor === color ? 'ring-2 ring-forest-green ring-offset-2' : 'border-gray-200'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">강조 색상</label>
              <div className="flex gap-3">
                {['#4A5D45', '#D4AF37', '#9A8C98', '#2C3E50', '#C0392B'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setTheme({ accentColor: color })}
                    className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${theme.accentColor === color ? 'ring-2 ring-forest-green ring-offset-2' : 'border-gray-200'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Pattern */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">배경 패턴</label>
              <div className="flex gap-2">
                {['none', 'flower-sm', 'flower-lg'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setTheme({ pattern: opt as any })}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-all ${theme.pattern === opt
                      ? 'bg-forest-green text-white border-forest-green'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {opt === 'none' ? '없음' : opt === 'flower-sm' ? '작은 꽃' : '큰 꽃'}
                  </button>
                ))}
              </div>
            </div>

            {/* Effect */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">배경 이펙트</label>
              <div className="flex flex-wrap gap-2">
                {['none', 'cherry-blossom', 'snow', 'leaves', 'forsythia', 'babys-breath'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setTheme({ effect: opt as any })}
                    className={`flex-1 min-w-[60px] py-2 text-xs rounded-lg border transition-all ${theme.effect === opt
                      ? 'bg-forest-green text-white border-forest-green'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {opt === 'none' ? '없음' :
                      opt === 'cherry-blossom' ? '벚꽃' :
                        opt === 'snow' ? '눈' :
                          opt === 'leaves' ? '낙엽' :
                            opt === 'forsythia' ? '개나리' : '안개꽃'}
                  </button>
                ))}
              </div>

              {/* Effect Option */}
              {theme.effect !== 'none' && (
                <label className="flex items-center gap-2 cursor-pointer mt-2 pl-1 animate-in fade-in slide-in-from-top-1">
                  <input
                    type="checkbox"
                    checked={theme.effectOnlyOnMain}
                    onChange={(e) => setTheme({ effectOnlyOnMain: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-forest-green focus:ring-forest-green"
                  />
                  <span className="text-xs text-gray-500 hover:text-forest-green transition-colors">메인 화면에만 이펙트 보이게 설정</span>
                </label>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={theme.animateEntrance}
                  onChange={(e) => setTheme({ animateEntrance: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-forest-green focus:ring-forest-green"
                />
                <span className="text-sm text-gray-700 group-hover:text-forest-green transition-colors">스크롤 샤르륵 등장 효과</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={theme.showSubtitleEng}
                  onChange={(e) => setTheme({ showSubtitleEng: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-forest-green focus:ring-forest-green"
                />
                <span className="text-sm text-gray-700 group-hover:text-forest-green transition-colors">영문 소제목 표시</span>
              </label>
            </div>

          </div>
        </AccordionItem>

        {/* 1. Basic Information */}
        <AccordionItem
          title="기본 정보"
          icon={User2}
          isOpen={openSection === 'basic'}
          onToggle={() => handleToggle('basic')}
          isCompleted={!!groomName && !!brideName}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">신랑 이름</label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-green focus:border-forest-green transition-all text-sm"
                placeholder="이름"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">신부 이름</label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-green focus:border-forest-green transition-all text-sm"
                placeholder="이름"
              />
            </div>
          </div>
        </AccordionItem>

        {/* 2. Schedule */}
        <AccordionItem
          title="날짜 및 시간"
          icon={Calendar}
          isOpen={openSection === 'date'}
          onToggle={() => handleToggle('date')}
          isCompleted={!!date && !!time}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-green focus:border-forest-green transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-green focus:border-forest-green transition-all text-sm"
              />
            </div>
          </div>
        </AccordionItem>

        {/* 3. Location */}
        <AccordionItem
          title="예식 장소"
          icon={MapPin}
          isOpen={openSection === 'location'}
          onToggle={() => handleToggle('location')}
          isCompleted={!!location}
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">장소명</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-green focus:border-forest-green transition-all text-sm"
              placeholder="예: 서울신라호텔 영빈관"
            />
          </div>
        </AccordionItem>

        {/* 4. Main Photo */}
        <AccordionItem
          title="메인 사진"
          icon={ImageIcon}
          isOpen={openSection === 'photo'}
          onToggle={() => handleToggle('photo')}
          isCompleted={!!imageUrl}
        >
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-forest-green/40 transition-colors bg-gray-50 group cursor-pointer relative overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon size={20} className="text-gray-400 group-hover:text-forest-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">사진 업로드</p>
                <p className="text-xs text-gray-400 mt-1">클릭하여 이미지를 선택하세요</p>
              </div>
            </div>
            {imageUrl && (
              <div className="absolute inset-0 bg-white items-center justify-center flex">
                <p className="text-sm text-forest-green font-medium flex items-center gap-2">
                  <CheckCircle2 size={16} /> 이미지 업로드 완료
                </p>
                <p className="text-xs text-gray-400 absolute bottom-4">클릭하여 변경</p>
              </div>
            )}
          </div>
        </AccordionItem>

        {/* 5. Message */}
        <AccordionItem
          title="초대 문구"
          icon={MessageSquare}
          isOpen={openSection === 'message'}
          onToggle={() => handleToggle('message')}
          isCompleted={message.length > 0}
        >
          <div className="space-y-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-green focus:border-forest-green transition-all min-h-[160px] resize-y text-sm leading-relaxed"
              placeholder="소중한 분들을 초대하는 글을 남겨주세요."
            />
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">{message.length}자</span>
            </div>
          </div>
        </AccordionItem>

        {/* 6. Gallery */}
        <AccordionItem
          title="갤러리"
          icon={ImagePlus}
          isOpen={openSection === 'gallery'}
          onToggle={() => handleToggle('gallery')}
          isCompleted={gallery.length > 0}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      const newGallery = [...gallery];
                      newGallery.splice(i, 1);
                      setGallery(newGallery);
                    }}
                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  // Mock upload: Add random image
                  const newImg = `https://source.unsplash.com/random/400x400/?wedding,love&sig=${Date.now()}`;
                  setGallery([...gallery, newImg]);
                }}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-forest-green hover:text-forest-green transition-colors"
              >
                <ImagePlus size={20} />
                <span className="text-xs">추가</span>
              </button>
            </div>
            <p className="text-xs text-gray-400">※ 실제 파일 업로드는 추후 구현 예정입니다. 지금은 랜덤 이미지가 추가됩니다.</p>
          </div>
        </AccordionItem>

        {/* 7. Accounts */}
        <AccordionItem
          title="마음 전하실 곳"
          icon={CreditCard}
          isOpen={openSection === 'account'}
          onToggle={() => handleToggle('account')}
          isCompleted={accounts.every(a => a.bank && a.accountNumber)}
        >
          <div className="space-y-6">
            {accounts.map((acc, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  {acc.type === 'groom' ? <span className="text-blue-500">신랑측</span> : <span className="text-pink-500">신부측</span>} 계좌
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="은행명"
                    value={acc.bank}
                    onChange={(e) => {
                      const newAcc = [...accounts];
                      newAcc[i].bank = e.target.value;
                      setAccounts(newAcc);
                    }}
                    className="px-3 py-2 bg-white border rounded text-sm"
                  />
                  <input
                    placeholder="예금주"
                    value={acc.holder}
                    onChange={(e) => {
                      const newAcc = [...accounts];
                      newAcc[i].holder = e.target.value;
                      setAccounts(newAcc);
                    }}
                    className="px-3 py-2 bg-white border rounded text-sm"
                  />
                </div>
                <input
                  placeholder="계좌번호 (- 포함)"
                  value={acc.accountNumber}
                  onChange={(e) => {
                    const newAcc = [...accounts];
                    newAcc[i].accountNumber = e.target.value;
                    setAccounts(newAcc);
                  }}
                  className="w-full px-3 py-2 bg-white border rounded text-sm"
                />
              </div>
            ))}
          </div>
        </AccordionItem>

      </div>
    </div>
  );
}