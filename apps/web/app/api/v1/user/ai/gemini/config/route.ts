import { NextRequest, NextResponse } from 'next/server';
import { prismaClient as prisma } from '@repo/db/client';
import { getUserFromRequest } from '@/lib/auth';
import { encryptData } from '@/lib/crypto';
import { validateUrl, validateApiKey, validateModelName } from '@/lib/validation';

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

        // Validate API key format
        if (!validateApiKey(apiKey, 'gemini')) {
            return NextResponse.json({
                message: "Invalid API key format"
            }, { status: 400 });
        }

        // Validate base URL if provided
        if (baseUrl && !validateUrl(baseUrl)) {
            return NextResponse.json({
                message: "Invalid or unsafe base URL"
            }, { status: 400 });
        }

        // Validate model names
        if (llmModel && !validateModelName(llmModel)) {
            return NextResponse.json({
                message: "Invalid LLM model name"
            }, { status: 400 });
        }

        if (embeddingModel && !validateModelName(embeddingModel)) {
            return NextResponse.json({
                message: "Invalid embedding model name"
            }, { status: 400 });
        }

        // Encrypt the API key before storing
        const encryptedApiKey = encryptData(apiKey);

        const config = await prisma.geminiConfig.upsert({
            where: { userId: user.id },
            update: {
                apiKey: encryptedApiKey,
                baseUrl: baseUrl || "https://generativelanguage.googleapis.com/v1beta",
                llmModel: llmModel || "gemini-1.5-flash", // Use stable model
                embeddingModel: embeddingModel || "text-embedding-004",
                project: project || null,
                location: location || "us-central1"
            },
            create: {
                userId: user.id,
                apiKey: encryptedApiKey,
                baseUrl: baseUrl || "https://generativelanguage.googleapis.com/v1beta",
                llmModel: llmModel || "gemini-1.5-flash", // Use stable model
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
