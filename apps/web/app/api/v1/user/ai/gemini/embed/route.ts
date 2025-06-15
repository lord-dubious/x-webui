import { NextRequest, NextResponse } from 'next/server';
import { prismaClient as prisma } from '@repo/db/client';
import { getUserFromRequest } from '@/lib/auth';
import { GoogleGenerativeAI } from "@google/generative-ai";

// POST - Generate embeddings with Gemini
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        const body = await request.json();
        const { model, content } = body;

        // Get user's Gemini config
        const config = await prisma.geminiConfig.findUnique({
            where: { userId: user.id }
        });

        if (!config) {
            return NextResponse.json({
                message: "Gemini configuration not found. Please configure Gemini first."
            }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(config.apiKey);
        
        // For embeddings, use the embedding model directly
        const result = await genAI.getGenerativeModel({ 
            model: model || config.embeddingModel 
        }).embedContent(content);

        return NextResponse.json({
            message: "Embedding generated successfully",
            embedding: {
                values: result.embedding.values
            }
        });

    } catch(err: any) {
        console.log(err);
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            message: "Failed to generate embedding with Gemini",
            error: err.message,
        }, { status: 500 });
    }
}
