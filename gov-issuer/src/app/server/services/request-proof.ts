import axios from 'axios';
import { ACAPY_API_URL } from '@/app/config';
import { createSchemaAndCredDef } from './schema-cred-def';
import { sendSellerLicence } from './send-seller-licence';

export async function requestNidProof(formData: FormData, connectionId: string) {
    const { schemaIds, credentialDefinitionIds } = await createSchemaAndCredDef();

    if (!connectionId) {
        throw new Error('No connection ID found');
    }

    const credDefId = credentialDefinitionIds[0];

    const body = {
        auto_remove: false,
        auto_verify: false,
        comment: 'Proof request for NID',
        connection_id: connectionId,
        presentation_request: {
            indy: {
                name: 'Proof request',
                nonce: '12',
                requested_attributes: {
                    name: {
                        name: 'name',
                        restrictions: [
                            {
                                cred_def_id: credDefId,
                            },
                        ],
                    },
                },
                requested_predicates: {},
                version: '1.0',
            },
        },
        trace: true,
    };

    try {
        const response = await axios.post(`${ACAPY_API_URL}/present-proof-2.0/send-request`, body);

        if (response.status !== 200) {
            throw new Error(`Failed to send proof request: ${response.statusText}`);
        }

        const presentationExchangeId = response.data.pres_ex_id;

        console.log(presentationExchangeId);

        return await pollForProof(formData, presentationExchangeId, connectionId);
    } catch (error) {
        console.error('Error sending proof request:', error);
    }
}

const pollForProof = async (
    formData: FormData,
    presentationExchangeId: string,
    connectionId: string
) => {
    const verifyPresentation = async () => {
        try {
            const recordResponse = await axios.get(
                `${ACAPY_API_URL}/present-proof-2.0/records/${presentationExchangeId}`
            );
            let state = recordResponse.data.state;

            console.log(state);
            if (state === 'presentation-received') {
                const verifyResponse = await axios.post(
                    `${ACAPY_API_URL}/present-proof-2.0/records/${presentationExchangeId}/verify-presentation`
                );
                console.log('verifyResponse', verifyResponse.data);

                if (verifyResponse.data.verified) {
                    await sendSellerLicence(formData, connectionId);
                }
            }

            return false;
        } catch (error) {
            console.error('Error verifying presentation:', error);
            return false;
        }
    };

    const poll = async () => {
        const isVerified = await verifyPresentation();
        if (!isVerified) {
            setTimeout(poll, 2000);
        } else {
            return true;
        }
    };

    return await poll();
};
