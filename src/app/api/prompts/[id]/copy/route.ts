import { incrementCopyCount } from "@/actions/prompts";
import { NextRequest, NextResponse } from "next/server";

type Props = {
    params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
    const { id } = await params;

    try {
        await incrementCopyCount(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to track copy" },
            { status: 500 }
        );
    }
}
