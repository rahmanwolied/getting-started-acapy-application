'use client';

import { Button } from '@/components/ui/button';
import { requestNidProof } from '../server/services/request-proof';
import { useEffect, useState } from 'react';

export default function SellerLicenceRequest() {
    const [mounted, setMounted] = useState(false);

    async function handleSubmit(formData: FormData) {
        const connectionId =
            document.cookie
                .split('; ')
                .find((row) => row.startsWith('connectionId='))
                ?.split('=')[1] || '';
        const proof = await requestNidProof(formData, connectionId);
        console.log('proof', proof);
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <div className="flex flex-col gap-4 p-4 rounded-md border border-white/20 justify-center items-center">
            <h1 className="text-2xl font-bold">Seller Licence</h1>
            <form className="flex flex-col gap-4" action={handleSubmit}>
                <input type="text" name="company_name" placeholder="Company Name" />
                <input type="text" name="company_address" placeholder="Company Address" />

                <Button type="submit">Seller Licence</Button>
            </form>
        </div>
    );
}
