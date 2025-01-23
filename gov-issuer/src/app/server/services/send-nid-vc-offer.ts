'use server';

import axios from 'axios';
import { ACAPY_API_URL } from '../../config';
import { createSchemaAndCredDef } from './schema-cred-def';

export async function sendNidOffer(formData: FormData, connectionId: string) {
    const { schemaIds, credentialDefinitionIds } = await createSchemaAndCredDef();

    console.log(connectionId);

    const defId = credentialDefinitionIds[0];
    try {
        // 1. First create a credential proposal
        const response = await axios.post(`${ACAPY_API_URL}/issue-credential-2.0/send`, {
            connection_id: connectionId,
            // connection_id: '2b0de431-01f0-4d8c-bb59-789a07dba35f',
            auto_remove: false,
            auto_issue: true,
            comment: 'NID Credential Offer',
            trace: false,
            cred_def_id: defId,
            credential_preview: {
                '@type': 'issue-credential/2.0/credential-preview',
                attributes: [
                    {
                        name: 'name',
                        value: formData.get('name'),
                        // value: 'Khan',
                    },
                    {
                        name: 'age',
                        value: formData.get('age'),
                        // value: '1234567890',
                    },
                    {
                        name: 'phone',
                        value: formData.get('phone'),
                        // value: '1234567890',
                    },
                ],
            },

            filter: {
                indy: {
                    cred_def_id: defId,
                },
            },
        });

        if (response.status !== 200) {
            console.error('Failed to send credential proposal', response.data.message);
            return;
        }
        console.log('response', response.data);
    } catch (error: any) {
        console.error(error.response);
    }
}
//https://us-east2.public.mediator.indiciotech.io/message?oob=eyJAaWQiOiIyNzFmYTZiYS0xYmUxLTQ0ZDEtYjZlZi01ZmM2ODcyZTY4NmYiLCJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJoYW5kc2hha2VfcHJvdG9jb2xzIjpbImh0dHBzOi8vZGlkY29tbS5vcmcvZGlkZXhjaGFuZ2UvMS4wIl0sImFjY2VwdCI6WyJkaWRjb21tL2FpcDEiLCJkaWRjb21tL2FpcDI7ZW52PXJmYzE5Il0sImxhYmVsIjoiQ2xvdWQgTWVkaWF0b3IiLCJzZXJ2aWNlcyI6W3siaWQiOiIjaW5saW5lIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtnczZNd1lCM1lnVG9aWEd3a25xQzM1MmNiSHR4SnNpM3pYWmZGMXQyZk5rVCN6Nk1rZ3M2TXdZQjNZZ1RvWlhHd2tucUMzNTJjYkh0eEpzaTN6WFpmRjF0MmZOa1QiXSwic2VydmljZUVuZHBvaW50IjoiaHR0cHM6Ly91cy1lYXN0Mi5wdWJsaWMubWVkaWF0b3IuaW5kaWNpb3RlY2guaW8vbWVzc2FnZSJ9LHsiaWQiOiIjaW5saW5lIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtnczZNd1lCM1lnVG9aWEd3a25xQzM1MmNiSHR4SnNpM3pYWmZGMXQyZk5rVCN6Nk1rZ3M2TXdZQjNZZ1RvWlhHd2tucUMzNTJjYkh0eEpzaTN6WFpmRjF0MmZOa1QiXSwic2VydmljZUVuZHBvaW50Ijoid3NzOi8vd3MudXMtZWFzdDIucHVibGljLm1lZGlhdG9yLmluZGljaW90ZWNoLmlvL3dzIn1dfQ==
