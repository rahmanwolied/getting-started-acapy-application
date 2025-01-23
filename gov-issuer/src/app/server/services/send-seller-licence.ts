'use server';

import axios from 'axios';
import { ACAPY_API_URL } from '../../config';
import { createSchemaAndCredDef } from './schema-cred-def';

export async function sendSellerLicence(formData: FormData, connectionId: string) {
    const { schemaIds, credentialDefinitionIds } = await createSchemaAndCredDef();

    console.log(connectionId);

    const defId = credentialDefinitionIds[1];
    try {
        // 1. First create a credential proposal
        const response = await axios.post(`${ACAPY_API_URL}/issue-credential-2.0/send`, {
            connection_id: connectionId,
            // connection_id: '2b0de431-01f0-4d8c-bb59-789a07dba35f',
            auto_remove: false,
            auto_issue: true,
            comment: 'Seller Licence Credential Offer',
            trace: false,
            cred_def_id: defId,
            credential_preview: {
                '@type': 'issue-credential/2.0/credential-preview',
                attributes: [
                    {
                        name: 'company_name',
                        value: formData.get('company_name'),
                        // value: 'Khan',
                    },
                    {
                        name: 'company_address',
                        value: formData.get('company_address'),
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
