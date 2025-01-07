'use server';

import { createSchema, type SchemaAttributes } from './schema';
import { createCredentialDefinition } from './credential-definition';

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
