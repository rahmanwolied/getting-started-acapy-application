'use server';

import axios from 'axios';
import { ACAPY_API_URL, BEARER_TOKEN } from '../../config';

export interface SchemaAttributes {
    name: string;
    attributes: string[];
    version: number;
    tag?: string;
}

export async function createSchema(schemaData: SchemaAttributes) {
    try {
        const body = {
            attributes: schemaData.attributes,
            schema_name: schemaData.name,
            schema_version: '1.0',
        };
        const exists = await axios.get(`${ACAPY_API_URL}/schemas/created`, {
            params: {
                schema_name: schemaData.name,
            },
        });

        if (exists.data && exists.data.schema_ids.length > 0) {
            return exists.data.schema_ids[0];
        }

        const response = await axios.post(`${ACAPY_API_URL}/schemas`, body);

        return response.data.sent.schema_id;
    } catch (error) {
        console.error('Error creating schema:', error);
        throw error;
    }
}
