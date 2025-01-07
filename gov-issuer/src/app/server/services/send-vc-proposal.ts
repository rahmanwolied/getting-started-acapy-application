'use server';

import { ACAPY_API_URL, BEARER_TOKEN } from '../../config';

export async function sendVCProposal(formData: FormData) {
    try {
        // 1. First create a credential proposal
        const proposalResponse = await fetch(
            `${ACAPY_API_URL}/issue-credential-2.0/send-proposal`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
                body: JSON.stringify({
                    // connection_id: formData.get('connection_id'),
                    connection_id: '2b0de431-01f0-4d8c-bb59-789a07dba35f',
                    auto_remove: false,
                    comment: 'Seller License Credential Proposal',
                    trace: false,
                    credential_preview: {
                        '@type': 'issue-credential/2.0/credential-preview',
                        attributes: [
                            {
                                name: 'name',
                                // value: formData.get('name'),
                                value: 'Khan',
                            },
                            {
                                name: 'nid',
                                // value: formData.get('nid'),
                                value: '1234567890',
                            },
                            {
                                name: 'phone_number',
                                // value: formData.get('phone_number'),
                                value: '1234567890',
                            },
                        ],
                    },
                    filter: {
                        indy: {
                            cred_def_id: 'KHj6G16TNmUbUU1tfnBkZT:3:CL:2636614:Seller Licence',
                            issuer_did: 'KHj6G16TNmUbUU1tfnBkZT',
                            schema_id: 'KHj6G16TNmUbUU1tfnBkZT:2:SellerLicence:1.0',
                            schema_name: 'SellerLicence',
                            schema_version: '1.0',
                            schema_issuer_did: 'KHj6G16TNmUbUU1tfnBkZT',
                        },
                        ld_proof: {
                            credential: {
                                '@context': ['https://www.w3.org/2018/credentials/v1'],
                                credentialSubject: {
                                    companyName: 'Khan',
                                    companyAddress: 'Dhaka',
                                    companyPhone: '1234567890',
                                    companyEmail: 'khan@gmail.com',
                                    companyWebsite: 'https://khan.com',
                                    type: ['EcommerceSellerLicense'],
                                },
                                description: 'Ecommerce Seller License',
                                issuanceDate: new Date().toISOString(),
                                issuer: 'did:peer:4zQmfWo3CTvnaNMMhXEUn7UBR2fUxM6ghPfFh1su6U4kZmxD:z3WEkKLpcfx6gdkXQddQq5ZMs31qkCuCecnWhYb2V8tE1n8mRuPXBuhk9bxzgLj1zaA56ZaxEpzGUr7RV33N6pifLk8tqckkyTxFJdbqKJCkXvDRsMGFtVxf8xviHYkPj9bzhAm8Fo8Gyu9aZeMteMAeDe9efuZScivHQD64mHMxaEmWxqpgArwK3pqnA7hwk3NKCzFvyAj8eCja6pmxnavnT1XvByzmVRrwb3JpQVsJSKUYP2HFRoe5P345Mi8DpKs1qpLZe6r6VkQ8G9hfxbSsoy7Nmmy1quyT7s2BfPoYHns2GwyhZ3MWnNvM1afEMRa9NRD82r5Wqg3QAdccpAWNqjC5kjCqXtc8Lt4dj5HzGCWDKAXc1iYiVY9f3oHnGaQheuFDepWTCKRoAFeNwM7pWCT9cFNJfM5XDeugAUhLHU9UQ2p9qk6ChvanFTUGbtLJ3cF2MQKDETPdjAxv5JNdoYr3oyEegusbbvUa3wjGgYsuNvKKpqwRVN3FDMBXWTRfF4LdjNgkJ5Zdz5d11EVxwPbZhfJqQcrjKS93Wi7bzXscj1pmtR9tV5mE6oeWyR8TxwN5aFt5bfU8qsKNFtkEzzp6GucdVQaFmPUfXPnQofCtbXe488G4hu3t7e',
                                name: 'Ecommerce Seller License',
                                type: ['VerifiableCredential', 'EcommerceSellerLicense'],
                                identifier: '1234567890',
                            },
                            options: {
                                proofType: 'Ed25519Signature2018',
                                proofPurpose: 'assertionMethod',
                                created: new Date().toISOString(),
                            },
                        },
                    },
                }),
            }
        );

        if (!proposalResponse.ok) {
            throw new Error('Failed to send credential proposal', {
                cause: proposalResponse.statusText,
            });
        }

        const proposalData = await proposalResponse.json();
        console.log(proposalData);
        // Store the credential exchange id for future reference
        const credExId = proposalData.cred_ex_id;
        const threadId = proposalData.thread_id;

        return {
            message: 'Credential proposal sent successfully',
            credentialExchangeId: credExId,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}
