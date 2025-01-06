'use client';
import Image from 'next/image';
import { useState } from 'react';
import QRCode from 'qrcode';

export default function CreateConnectionForm() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [connectionId, setConnectionId] = useState<string | null>(null);

    const handleConnection = async () => {
        try {
            const response = await fetch('http://localhost:8021/connections/create-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const connectionID = data.connection_id;
                const inviteURL = JSON.stringify(data.invitation_url, null, 4);

                // Generate QR code
                const qrCodeDataUrl = await QRCode.toDataURL(inviteURL);
                setQrCodeUrl(qrCodeDataUrl);
                setConnectionId(connectionID);
                console.log({ qrCodeDataUrl });
                // Here you would handle displaying the QR code in your UI

                // For now just logging the data
                console.log({
                    connectionID,
                    qrCodeDataUrl,
                });
            } else {
                console.log(response);
                console.error('API service unavailable');
            }
        } catch (err) {
            console.error('Failed to generate invitation:', err);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <form className="flex flex-col gap-4" action={async () => await handleConnection()}>
                <h1 className="text-2xl font-bold">Create Connection</h1>
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
                >
                    Submit
                </button>
            </form>
            {qrCodeUrl && (
                <div className="flex justify-center">
                    <Image src={qrCodeUrl} alt="Connection QR Code" width={450} height={450} />
                </div>
            )}
        </div>
    );
}
