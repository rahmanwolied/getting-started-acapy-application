import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log('==================== webhook data ==================');
        console.log(data);
        console.log('==================== webhook data ==================');
        // Process the webhook payload

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
