'use server';

import { ACAPY_API_URL, BEARER_TOKEN } from '../../config';

export async function createCredentialDefinition(schemaId: string) {
    try {
        console.log('schemaId', schemaId);
        const response = await fetch(`${ACAPY_API_URL}/credential-definitions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
            body: JSON.stringify({
                schema_id: schemaId,
                tag: 'Seller Identity',
                support_revocation: true,
                revocation_registry_size: 1000,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create credential definition: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('data', data);

        return data;
    } catch (error) {
        console.error('Error creating credential definition:', error);
        throw error;
    }
}
