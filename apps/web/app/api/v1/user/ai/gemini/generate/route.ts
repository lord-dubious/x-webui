import { NextRequest, NextResponse } from 'next/server';
import { prismaClient as prisma } from '@repo/db/client';
import { getUserFromRequest } from '@/lib/auth';
import { decryptData } from '@/lib/crypto';
import { GoogleGenerativeAI } from "@google/generative-ai";

// POST - Generate content with Gemini (with multimodal support)
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        const body = await request.json();
        const { model, contents } = body;

        // Get user's Gemini config
        const config = await prisma.geminiConfig.findUnique({
            where: { userId: user.id }
        });

        if (!config) {
            return NextResponse.json({
                message: "Gemini configuration not found. Please configure Gemini first."
            }, { status: 400 });
        }

        // Decrypt the API key before use
        const decryptedApiKey = decryptData(config.apiKey);
        const genAI = new GoogleGenerativeAI(decryptedApiKey);
        const geminiModel = genAI.getGenerativeModel({ 
            model: model || config.llmModel 
        });

        const result = await geminiModel.generateContent(contents);

        return NextResponse.json({
            message: "Content generated successfully",
            response: {
                text: result.response.text(),
                candidates: result.response.candidates || []
            }
        });

    } catch(err: any) {
        console.log(err);
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            message: "Failed to generate content with Gemini",
            error: err.message,
        }, { status: 500 });
    }
}
