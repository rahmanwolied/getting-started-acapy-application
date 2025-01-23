'use server';

import { createSchema, type SchemaAttributes } from './schema';
import { createCredentialDefinition } from './credential-definition';

const schemas: SchemaAttributes[] = [
    {
        name: 'NID',
        attributes: ['name', 'age', 'phone'],
        version: 1,
        tag: 'NID',
    },
    {
        name: 'Seller License',
        attributes: ['company_name', 'company_address'],
        version: 1,
        tag: 'Seller License',
    },
    {
        name: 'Platform VC',
        attributes: ['user_id', 'user_name'],
        version: 1,
        tag: 'Platform VC',
    },
];

export async function createSchemaAndCredDef() {
    try {
        const schemaIds: string[] = [];
        const credentialDefinitionIds: string[] = [];
        for (const _schema of schemas) {
            const schemaId = await createSchema(_schema);
            schemaIds.push(schemaId);

            const credentialDefinition = await createCredentialDefinition(schemaId, _schema.tag!);
            credentialDefinitionIds.push(credentialDefinition);
        }

        return {
            schemaIds,
            credentialDefinitionIds,
        };
    } catch (error) {
        console.error('Error creating schema and credential definition:', error);
        return {
            schemaIds: [],
            credentialDefinitionIds: [],
        };
    }
}
