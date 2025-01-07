'use server';

import { ACAPY_API_URL, BEARER_TOKEN } from '../../config';

export interface SchemaAttributes {
    name: string;
    attributes: string[];
    version: number;
}

export async function createSchema(schemaData: SchemaAttributes) {
    try {
        const body = {
            attributes: schemaData.attributes,
            schema_name: schemaData.name,
            schema_version: '1.0',
        };
        const response = await fetch(`${ACAPY_API_URL}/schemas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Failed to create schema: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('data', data);
        return data;
    } catch (error) {
        console.error('Error creating schema:', error);
        throw error;
    }
}
