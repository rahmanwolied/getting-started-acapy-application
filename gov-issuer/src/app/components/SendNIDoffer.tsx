'use client';

import { useState, useEffect } from 'react';
import { sendNidOffer } from '../server/issue-vc';
import { Button } from '@/components/ui/button';

export default function SendNidOffer() {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const connectionId =
            document.cookie
                .split('; ')
                .find((row) => row.startsWith('connectionId='))
                ?.split('=')[1] || '';
        await sendNidOffer(formData, connectionId);
        setIsLoading(false);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex flex-col gap-4 p-4 rounded-md border border-white/20 justify-center items-center">
            <h1 className="text-2xl font-bold">Send Nid Offer</h1>
            <form className="flex flex-col gap-4" action={handleSubmit}>
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="phone" placeholder="Phone Number" />
                <input type="text" name="age" placeholder="Age" />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Nid Offer'}
                </Button>
            </form>
        </div>
    );
}
