'use server';
import { sendVCProposal } from './services/send-vc-proposal';
import { createSchemaAndCredDef } from './services/schema-cred-def';
import type { SchemaAttributes } from './services/schema';

export { sendVCProposal, createSchemaAndCredDef, SchemaAttributes };
