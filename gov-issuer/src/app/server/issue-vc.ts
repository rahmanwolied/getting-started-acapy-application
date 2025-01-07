'use server';

import { ACAPY_API_URL, BEARER_TOKEN } from '../config';

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
                        name: 'phone_number',
                        value: formData.get('phone_number'),
                    },
                ],
            },
            filter: {
                indy: {
                    cred_def_id: 'KHj6G16TNmUbUU1tfnBkZT:3:CL:2636614:Seller Licence', // You'll need this from your government agent
                    issuer_did: 'KHj6G16TNmUbUU1tfnBkZT', // Government's DID
                    schema_id: 'KHj6G16TNmUbUU1tfnBkZT:2:SellerLicence:1.0', // ID of the schema to use
                    schema_name: 'SellerLicence',
                    schema_version: '1.0',
                },
                ld_proof: {
                    credential: {
                        '@context': ['https://www.w3.org/2018/credentials/v1'],
                        credentialSubject: {
                            companyName: 'Khan',
                            companyAddress: 'Dhaka',
                            companyPhone: '01712345678',
                            companyEmail: 'khan@gmail.com',
                            companyWebsite: 'https://khan.com',
                            type: ['EcommerceSellerLicense'],
                        },
                        description: 'Ecommerce Seller License',
                        issuanceDate: new Date().toISOString(),
                        // "did:peer:1zQmXA7nDSMivVTLoVTpmhUv1krJjhocZLcNiV57KTaV5Pzr"
                        issuer: 'did:peer:4zQmfWo3CTvnaNMMhXEUn7UBR2fUxM6ghPfFh1su6U4kZmxD:z3WEkKLpcfx6gdkXQddQq5ZMs31qkCuCecnWhYb2V8tE1n8mRuPXBuhk9bxzgLj1zaA56ZaxEpzGUr7RV33N6pifLk8tqckkyTxFJdbqKJCkXvDRsMGFtVxf8xviHYkPj9bzhAm8Fo8Gyu9aZeMteMAeDe9efuZScivHQD64mHMxaEmWxqpgArwK3pqnA7hwk3NKCzFvyAj8eCja6pmxnavnT1XvByzmVRrwb3JpQVsJSKUYP2HFRoe5P345Mi8DpKs1qpLZe6r6VkQ8G9hfxbSsoy7Nmmy1quyT7s2BfPoYHns2GwyhZ3MWnNvM1afEMRa9NRD82r5Wqg3QAdccpAWNqjC5kjCqXtc8Lt4dj5HzGCWDKAXc1iYiVY9f3oHnGaQheuFDepWTCKRoAFeNwM7pWCT9cFNJfM5XDeugAUhLHU9UQ2p9qk6ChvanFTUGbtLJ3cF2MQKDETPdjAxv5JNdoYr3oyEegusbbvUa3wjGgYsuNvKKpqwRVN3FDMBXWTRfF4LdjNgkJ5Zdz5d11EVxwPbZhfJqQcrjKS93Wi7bzXscj1pmtR9tV5mE6oeWyR8TxwN5aFt5bfU8qsKNFtkEzzp6GucdVQaFmPUfXPnQofCtbXe488G4hu3t7e',
                        name: 'Ecommerce Seller License',
                        type: ['VerifiableCredential', 'EcommerceSellerLicense'],
                    },
                    options: {
                        proofType: 'Ed25519Signature2018',
                    },
                    additionalProp1: {},
                },
                vc_di: {
                    cred_def_id: 'WgWxqztrNooG92RXvxSTWv:3:CL:20:tag',
                    issuer_did: 'WgWxqztrNooG92RXvxSTWv',
                    schema_id: 'WgWxqztrNooG92RXvxSTWv:2:schema_name:1.0',
                    schema_issuer_did: 'WgWxqztrNooG92RXvxSTWv',
                    schema_name: 'preferences',
                    schema_version: '1.0',
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

async function createCredentialDefinition(schemaId: string) {
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
