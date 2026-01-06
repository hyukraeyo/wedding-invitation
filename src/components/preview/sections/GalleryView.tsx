import React from 'react';
import Image from 'next/image';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function GalleryView() {
    const { gallery } = useInvitationStore();

    if (!gallery || gallery.length === 0) return null;

    return (
        <div className="py-16 px-6 bg-white/50">
            <h3 className="text-center font-serif text-xl mb-8 text-gray-800 tracking-widest">GALLERY</h3>
            <div className="grid grid-cols-2 gap-2">
                {gallery.map((img, i) => (
                    <div key={i} className={`relative rounded-lg overflow-hidden ${i % 3 === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}>
                        <Image
                            src={img}
                            alt={`Gallery ${i + 1}`}
                            fill
                            className="object-cover transition-transform hover:scale-105 duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
