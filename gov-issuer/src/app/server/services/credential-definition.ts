'use server';

import axios from 'axios';
import { ACAPY_API_URL, BEARER_TOKEN } from '../../config';

export async function createCredentialDefinition(schemaId: string, tag: string) {
    try {
        const exists = await axios.get(`${ACAPY_API_URL}/credential-definitions/created`, {
            params: {
                schema_id: schemaId,
            },
        });

        if (exists.data && exists.data.credential_definition_ids.length > 0) {
            return exists.data.credential_definition_ids[0];
        }

        const response = await axios.post(`${ACAPY_API_URL}/credential-definitions`, {
            schema_id: schemaId,
            tag: tag,
            support_revocation: false,
        });

        return response.data.sent.credential_definition_id;
    } catch (error) {
        console.error('Error creating credential definition:', error);
        throw error;
    }
}
