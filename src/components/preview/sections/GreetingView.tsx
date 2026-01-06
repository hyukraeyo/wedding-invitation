import React from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function GreetingView() {
    const { greetingTitle, message } = useInvitationStore();

    if (!message) return null;

    return (
        <div className="py-16 px-8 text-center bg-white/30 backdrop-blur-sm mx-4 rounded-3xl shadow-sm border border-white/50">
            <div className="space-y-6">
                {greetingTitle && (
                    <h2 className="text-forest-green font-medium text-lg tracking-widest uppercase mb-4 opacity-80">
                        {greetingTitle}
                    </h2>
                )}
                <div className="text-sm leading-8 text-gray-600 whitespace-pre-wrap font-serif">
                    {message}
                </div>
            </div>
        </div>
    );
}
