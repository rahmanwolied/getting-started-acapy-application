'use client';

import { useState, useEffect } from 'react';
import { sendVCProposal } from '../server/issue-vc';

export default function SendVCProposal() {
    const [mounted, setMounted] = useState(false);
    const handleSubmit = async (formData: FormData) => {
        const result = await sendVCProposal(formData);
        // Handle the result here if needed
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex flex-col gap-4 p-4 rounded-md border border-white/20 justify-center items-center">
            <h1 className="text-2xl font-bold">Send VC Proposal</h1>
            <form className="flex flex-col gap-4" action={handleSubmit}>
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="nid" placeholder="NID" />
                <input type="text" name="phone_number" placeholder="Phone Number" />
                <input
                    type="hidden"
                    name="connection_id"
                    value={
                        document.cookie
                            .split('; ')
                            .find((row) => row.startsWith('connectionId='))
                            ?.split('=')[1] || ''
                    }
                />
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md w-fit"
                >
                    Send VC Proposal
                </button>
            </form>
        </div>
    );
}
