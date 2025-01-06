'use client';

import { issueVC } from '../server/issue-vc';

export default function IssueVC() {
    const handleSubmit = async (formData: FormData) => {
        const result = await issueVC(formData);
        // Handle the result here if needed
    };

    return (
        <div className="flex flex-col gap-4 p-4 rounded-md border border-white/20 justify-center items-center">
            <h1 className="text-2xl font-bold">Issue VC</h1>
            <form className="flex flex-col gap-4" action={handleSubmit}>
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="nid" placeholder="NID" />
                <input type="text" name="trade_license" placeholder="Trade License" />
                <input type="text" name="expires" placeholder="Expires" />
                <input
                    type="hidden"
                    name="connection_id"
                    value={
                        document.cookie
                            .split('; ')
                            .find((row) => row.startsWith('connectionId='))
                            ?.split('=')[1] || ''
                    }
                />
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md w-fit"
                >
                    Issue VC
                </button>
            </form>
        </div>
    );
}
