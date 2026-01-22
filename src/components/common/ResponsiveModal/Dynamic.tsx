import dynamic from 'next/dynamic';

export const DynamicResponsiveModal = dynamic(
    () => import('./ResponsiveModal').then(mod => mod.ResponsiveModal),
    { ssr: false }
);
