import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { SectionContainer } from '@/components/common/FormPrimitives';

export const GreetingSkeleton = () => (
    <SectionContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton style={{ width: '60px', height: '14px' }} />
                <Skeleton style={{ width: '100%', height: '42px', borderRadius: '12px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton style={{ width: '40px', height: '14px' }} />
                <Skeleton style={{ width: '100%', height: '42px', borderRadius: '12px' }} />
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
            <Skeleton style={{ width: '40px', height: '14px' }} />
            <Skeleton style={{ width: '100%', height: '160px', borderRadius: '12px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
            <Skeleton style={{ width: '40px', height: '14px' }} />
            <Skeleton style={{ width: '100%', height: '120px', borderRadius: '12px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
            <Skeleton style={{ width: '60px', height: '14px' }} />
            <Skeleton style={{ width: '100%', height: '42px', borderRadius: '12px' }} />
        </div>
    </SectionContainer>
);

export const MainScreenSkeleton = () => (
    <SectionContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton style={{ width: '60px', height: '14px' }} />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Skeleton style={{ width: '100px', height: '125px', borderRadius: '12px', flexShrink: 0 }} />
                <Skeleton style={{ width: '100%', height: '42px', borderRadius: '12px' }} />
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
            <Skeleton style={{ width: '40px', height: '14px' }} />
            <div style={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} style={{ width: '140px', height: '200px', borderRadius: '16px', flexShrink: 0 }} />
                ))}
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
            <Skeleton style={{ width: '60px', height: '14px' }} />
            <Skeleton style={{ width: '100%', height: '42px', borderRadius: '12px' }} />
        </div>
    </SectionContainer>
);

export const GallerySkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton style={{ width: '80px', height: '14px' }} />
            </div>
            <Skeleton style={{ width: '100px', height: '32px', borderRadius: '16px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[...Array(9)].map((_, i) => (
                <Skeleton key={i} style={{ width: '100%', aspectRatio: '1', borderRadius: '12px' }} />
            ))}
        </div>
    </div>

);
