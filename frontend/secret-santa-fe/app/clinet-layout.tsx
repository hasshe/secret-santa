'use client';
import Snowfall from 'react-snowfall';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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