'use client';

import { useState } from 'react';
import { createSchemaAndCredDef } from '../server/issue-vc';

export default function CreateSchemaForm() {
    const [attributes, setAttributes] = useState<string[]>(['']);
    const [schemaName, setSchemaName] = useState('');
    const [version, setVersion] = useState('1.0');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        schemaId?: string;
        credentialDefinitionId?: string;
        error?: string;
    } | null>(null);

    const handleAddAttribute = () => {
        setAttributes([...attributes, '']);
    };

    const handleRemoveAttribute = (index: number) => {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
    };

    const handleAttributeChange = (index: number, value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index] = value;
        setAttributes(newAttributes);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            // Filter out empty attributes
            const filteredAttributes = attributes.filter((attr) => attr.trim() !== '');

            const response = await createSchemaAndCredDef({
                name: schemaName,
                attributes: filteredAttributes,
                version: Number(version),
            });

            setResult({
                schemaId: response.schemaId,
                credentialDefinitionId: response.credentialDefinitionId,
            });
        } catch (error) {
            setResult({ error: error instanceof Error ? error.message : 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Create Schema Definition</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Schema Name
                        <input
                            type="text"
                            value={schemaName}
                            onChange={(e) => setSchemaName(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="e.g., BusinessLicense"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Version
                        <input
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="1.0"
                        />
                    </label>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">Attributes</label>
                    {attributes.map((attribute, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={attribute}
                                onChange={(e) => handleAttributeChange(index, e.target.value)}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Attribute name"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveAttribute(index)}
                                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddAttribute}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Add Attribute
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                    {loading ? 'Creating...' : 'Create Schema'}
                </button>
            </form>

            {result && (
                <div className="mt-6 p-4 rounded-md border">
                    {result.error ? (
                        <div className="text-red-600">{result.error}</div>
                    ) : (
                        <div className="space-y-2">
                            <h3 className="font-medium">Schema Created Successfully!</h3>
                            <div className="text-sm break-all">
                                <p>
                                    <strong>Schema ID:</strong> {result.schemaId}
                                </p>
                                <p>
                                    <strong>Credential Definition ID:</strong>{' '}
                                    {result.credentialDefinitionId}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
