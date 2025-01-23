import Navbar from './components/Navbar';
import CreateConnectionForm from './components/CreateConnectionForm';
import SendNidOffer from './components/SendNIDoffer';
import { createSchemaAndCredDef } from './server/services/schema-cred-def';
import { Button } from '@/components/ui/button';
import { requestNidProof } from './server/services/request-proof';
import SellerLicenceRequest from './components/RequestNidProof';

export default async function Home() {
    const { schemaIds, credentialDefinitionIds } = await createSchemaAndCredDef();
    return (
        <div className="grid grid-cols-3 min-h-screen max-w-7xl mx-auto gap-4 p-4 ">
            <div className="col-span-2">
                <CreateConnectionForm />
            </div>
            <div className="space-y-6 p-4 rounded-lg bg-slate-800 border border-white/20">
                <div>
                    <h1 className="text-xl font-semibold text-white mb-3">Schema IDs</h1>
                    <ul className="space-y-2">
                        {schemaIds.map((id) => (
                            <li
                                key={id}
                                className="text-gray-300 bg-slate-700 p-2 rounded break-all"
                            >
                                {id}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h1 className="text-xl font-semibold text-white mb-3">
                        Credential Definition IDs
                    </h1>
                    <ul className="space-y-2">
                        {credentialDefinitionIds.map((id) => (
                            <li
                                key={id}
                                className="text-gray-300 bg-slate-700 p-2 rounded break-all"
                            >
                                {id}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="col-span-1">
                <SendNidOffer />
            </div>
            <div className="col-span-1">
                <SellerLicenceRequest />
            </div>
        </div>
    );
}
