import { NextRequest, NextResponse } from 'next/server';
import { prismaClient as prisma } from '@repo/db/client';

// Helper function to get user from session (simplified for now)
async function getUserFromRequest(request: NextRequest) {
    // For now, we'll use a simple approach
    // In production, you'd use proper session management
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        throw new Error('Unauthorized');
    }
    return { id: userId };
}

// GET - Get user's Gemini configuration
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        const config = await prisma.geminiConfig.findUnique({
            where: { userId: user.id },
            select: {
                baseUrl: true,
                llmModel: true,
                embeddingModel: true,
                project: true,
                location: true,
            }
        });

        return NextResponse.json({
            message: "Gemini configuration retrieved",
            config: config || {
                baseUrl: "https://generativelanguage.googleapis.com/v1beta",
                llmModel: "gemini-2.0-flash-exp",
                embeddingModel: "text-embedding-004",
                project: null,
                location: "us-central1"
            }
        });

    } catch(err) {
        console.log(err);
        return NextResponse.json({
            message: "Internal Server Error",
            error: err,
        }, { status: 500 });
    }
}

// POST - Update user's Gemini configuration
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        const body = await request.json();
        const { apiKey, baseUrl, llmModel, embeddingModel, project, location } = body;

        if (!apiKey) {
            return NextResponse.json({
                message: "API key is required"
            }, { status: 400 });
        }

        const config = await prisma.geminiConfig.upsert({
            where: { userId: user.id },
            update: {
                apiKey,
                baseUrl: baseUrl || "https://generativelanguage.googleapis.com/v1beta",
                llmModel: llmModel || "gemini-2.0-flash-exp",
                embeddingModel: embeddingModel || "text-embedding-004",
                project: project || null,
                location: location || "us-central1"
            },
            create: {
                userId: user.id,
                apiKey,
                baseUrl: baseUrl || "https://generativelanguage.googleapis.com/v1beta",
                llmModel: llmModel || "gemini-2.0-flash-exp",
                embeddingModel: embeddingModel || "text-embedding-004",
                project: project || null,
                location: location || "us-central1"
            }
        });

        return NextResponse.json({
            message: "Gemini configuration updated successfully",
            config: {
                baseUrl: config.baseUrl,
                llmModel: config.llmModel,
                embeddingModel: config.embeddingModel,
                project: config.project,
                location: config.location
            }
        });

    } catch(err) {
        console.log(err);
        return NextResponse.json({
            message: "Internal Server Error",
            error: err,
        }, { status: 500 });
    }
}
