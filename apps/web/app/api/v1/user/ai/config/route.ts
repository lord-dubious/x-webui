import { NextRequest, NextResponse } from 'next/server';
import { prismaClient as prisma } from '@repo/db/client';
import { getUserFromRequest } from '@/lib/auth';

// GET - Get user's OpenAI configuration
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        const config = await prisma.openAIConfig.findUnique({
            where: { userId: user.id },
            select: {
                baseUrl: true,
                llmModel: true,
                embeddingModel: true,
            }
        });

        return NextResponse.json({
            message: "OpenAI configuration retrieved",
            config: config || {
                baseUrl: "https://api.openai.com/v1",
                llmModel: "gpt-4",
                embeddingModel: "text-embedding-3-small"
            }
        });

    } catch(err: any) {
        console.log(err);
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            message: "Internal Server Error",
            error: err.message,
        }, { status: 500 });
    }
}

// POST - Update user's OpenAI configuration
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        const body = await request.json();
        const { apiKey, baseUrl, llmModel, embeddingModel } = body;

        if (!apiKey) {
            return NextResponse.json({
                message: "API key is required"
            }, { status: 400 });
        }

        const config = await prisma.openAIConfig.upsert({
            where: { userId: user.id },
            update: {
                apiKey,
                baseUrl: baseUrl || "https://api.openai.com/v1",
                llmModel: llmModel || "gpt-4",
                embeddingModel: embeddingModel || "text-embedding-3-small"
            },
            create: {
                userId: user.id,
                apiKey,
                baseUrl: baseUrl || "https://api.openai.com/v1",
                llmModel: llmModel || "gpt-4",
                embeddingModel: embeddingModel || "text-embedding-3-small"
            }
        });

        return NextResponse.json({
            message: "OpenAI configuration updated successfully",
            config: {
                baseUrl: config.baseUrl,
                llmModel: config.llmModel,
                embeddingModel: config.embeddingModel
            }
        });

    } catch(err: any) {
        console.log(err);
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            message: "Internal Server Error",
            error: err.message,
        }, { status: 500 });
    }
}
