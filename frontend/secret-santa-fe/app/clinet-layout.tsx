'use client';
import Snowfall from 'react-snowfall';
import { useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden'; // disable page scrolling
        return () => {
            document.body.style.overflow = prev; // restore on unmount
        };
    }, []);
    return (
        <div
            style={{
                backgroundImage: "url('/bgch.png')",
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                minHeight: '100vh'
            }}
        >
            <Snowfall />
            {children}
        </div>
    );
}