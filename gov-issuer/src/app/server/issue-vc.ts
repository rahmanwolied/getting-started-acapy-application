'use server';

import { ACAPY_API_URL } from '../config';

interface SchemaAttributes {
    name: string;
    attributes: string[];
    version: number;
}

export async function issueVC(formData: FormData) {
    // 1. First create a credential proposal
    const proposalResponse = await fetch(`${ACAPY_API_URL}/issue-credential-2.0/send-proposal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            connection_id: formData.get('connection_id'),
            auto_remove: false,
            credential_preview: {
                '@type': 'issue-credential/2.0/credential-preview',
                attributes: [
                    {
                        name: 'name',
                        value: formData.get('name'),
                    },
                    {
                        name: 'nid',
                        value: formData.get('nid'),
                    },
                    {
                        name: 'trade_license',
                        value: formData.get('trade_license'),
                    },
                    {
                        name: 'expires',
                        value: formData.get('expires'),
                    },
                ],
            },
            filter: {
                indy: {
                    cred_def_id: process.env.CRED_DEF_ID, // You'll need this from your government agent
                    issuer_did: process.env.ISSUER_DID, // Government's DID
                    schema_id: process.env.SCHEMA_ID, // ID of the schema to use
                },
            },
        }),
    });

    if (!proposalResponse.ok) {
        throw new Error('Failed to send credential proposal');
    }

    const proposalData = await proposalResponse.json();

    // Store the credential exchange id for future reference
    const credExId = proposalData.credential_exchange_id;

    return {
        message: 'Credential proposal sent successfully',
        credentialExchangeId: credExId,
    };
}

export async function createSchemaAndCredDef(schemaData: SchemaAttributes) {
    try {
        // Create and register schema
        const schema = await createSchema(schemaData);

        // Create and register credential definition
        const credentialDefinition = await createCredentialDefinition(schema.sent.schema_id);
        console.log('creden', credentialDefinition);
        return {
            schemaId: schema.sent.schema_id,
            credentialDefinitionId: credentialDefinition.id,
        };
    } catch (error) {
        console.error('Error creating schema and credential definition:', error);
        throw error;
    }
}

async function createSchema(schemaData: SchemaAttributes) {
    try {
        const body = {
            attributes: schemaData.attributes,
            schema_name: schemaData.name,
            schema_version: '1.0',
        };
        console.log('body', body);
        const response = await fetch(`${ACAPY_API_URL}/schemas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
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

async function createCredentialDefinition(schemaId: string) {
    try {
        console.log('schemaId', schemaId);
        const response = await fetch(`${ACAPY_API_URL}/credential-definitions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
            body: JSON.stringify({
                schema_id: schemaId,
                tag: 'Seller Identity',
                support_revocation: true,
                revocation_registry_size: 1000,
            }),
        });
        const data = await response.json();
        console.log('data', data);
        if (!response.ok) {
            throw new Error(`Failed to create credential definition: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error('Error creating credential definition:', error);
        throw error;
    }
}
