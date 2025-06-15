import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import { prisma } from "../config";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";


const aiRouter:Router = Router();

aiRouter.use(authMiddleware);

aiRouter.post("/getcontext", async(req, res) => {
    const embeddingVector:number[] = req.body.embeddingVector;
    const botId:string = req.body.botId;
    console.log("botId",botId);

    const pipeline = [
        {
          $search: {
            index: "Tweet_Search", // your Atlas Search index name
            knnBeta: {
              vector: embeddingVector,  // your query vector
              path: "embedding",
              k: 10,
            },
          },
        },
        {
          $match: {
            botId: botId,  // Filter results for the specific botId
          },
        },
        {
          $project: {
            tweet_id: 1,
            text: 1,
            likes: 1,
            retweets: 1,
            comments: 1,
            timestamp: 1,
            score: { $meta: "searchScore" },
          },
        },
      ];
    

    try {

        const result = await prisma.$runCommandRaw({
            aggregate:"bottweets",
            pipeline,
            cursor:{}
        }) as any

        const tweets = result.cursor?.firstBatch ;
     
        res.status(200).json({
            message:"Context Retrieved Successfully",
            context:tweets
        })

    }catch(err){
        console.log(err);
      res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });


    }

})

aiRouter.get("/getbots", async(req, res) => {

    try {

        const bots = await prisma.bot.findMany();

        res.status(200).json({
            message:"Bots Found",
            bots
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err,
          });

    }
})

// Get user's OpenAI configuration
aiRouter.get("/config", async(req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;

        const config = await prisma.openAIConfig.findUnique({
            where: { userId },
            select: {
                baseUrl: true,
                llmModel: true,
                embeddingModel: true,
                // Don't return the API key for security
            }
        });

        res.status(200).json({
            message: "Configuration retrieved",
            config: config || {
                baseUrl: "https://api.openai.com/v1",
                llmModel: "gpt-4",
                embeddingModel: "text-embedding-3-small"
            }
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err,
        });
    }
});

// Update user's OpenAI configuration
aiRouter.post("/config", authMiddleware, async(req, res): Promise<void> => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const { apiKey, baseUrl, llmModel, embeddingModel } = req.body;

        if (!apiKey) {
            res.status(400).json({
                message: "API key is required"
            });
            return;
        }

        const config = await prisma.openAIConfig.upsert({
            where: { userId },
            update: {
                apiKey,
                baseUrl: baseUrl || "https://api.openai.com/v1",
                llmModel: llmModel || "gpt-4",
                embeddingModel: embeddingModel || "text-embedding-3-small"
            },
            create: {
                userId,
                apiKey,
                baseUrl: baseUrl || "https://api.openai.com/v1",
                llmModel: llmModel || "gpt-4",
                embeddingModel: embeddingModel || "text-embedding-3-small"
            }
        });

        res.status(200).json({
            message: "Configuration updated successfully",
            config: {
                baseUrl: config.baseUrl,
                llmModel: config.llmModel,
                embeddingModel: config.embeddingModel
            }
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err,
        });
    }
});

// Fetch available models from OpenAI-compatible endpoint
aiRouter.post("/models", authMiddleware, async(req, res): Promise<void> => {
    try {
        const { apiKey, baseUrl } = req.body;

        if (!apiKey) {
            res.status(400).json({
                message: "API key is required"
            });
            return;
        }

        const modelsUrl = `${baseUrl || "https://api.openai.com/v1"}/models`;

        const response = await axios.get(modelsUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const models = response.data.data || [];

        // Separate embedding models first (more specific)
        const embeddingModels = models.filter((model: any) =>
            model.id.includes('embedding') ||
            model.id.includes('embed')
        );

        // Then filter LLM models (exclude embedding models and include known LLM patterns)
        const llmModels = models.filter((model: any) => {
            const isEmbedding = model.id.includes('embedding') || model.id.includes('embed');
            const isKnownLLM = model.id.includes('gpt') ||
                              model.id.includes('claude') ||
                              model.id.includes('llama') ||
                              model.id.includes('mistral') ||
                              model.id.includes('gemini') ||
                              model.id.includes('chat') ||
                              model.id.includes('instruct');

            // Include if it's a known LLM pattern and not an embedding model
            // Or if it's not an embedding model and doesn't look like a specialized model
            return !isEmbedding && (isKnownLLM || (!model.id.includes('whisper') && !model.id.includes('tts')));
        });

        res.status(200).json({
            message: "Models fetched successfully",
            models: {
                llm: llmModels,
                embedding: embeddingModels,
                all: models
            }
        });

    } catch(err: any) {
        console.log(err);
        res.status(500).json({
            message: "Failed to fetch models. Please check your API key and base URL.",
            error: err.response?.data || err.message,
        });
    }
});

// Get user's Gemini configuration
aiRouter.get("/gemini/config", authMiddleware, async(req, res): Promise<void> => {
    try {
        //@ts-ignore
        const userId = req.userId;

        const config = await prisma.geminiConfig.findUnique({
            where: { userId },
            select: {
                baseUrl: true,
                llmModel: true,
                embeddingModel: true,
                project: true,
                location: true,
                // Don't return the API key for security
            }
        });

        res.status(200).json({
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
        res.status(500).json({
            message: "Internal Server Error",
            error: err,
        });
    }
});

// Update user's Gemini configuration
aiRouter.post("/gemini/config", authMiddleware, async(req, res): Promise<void> => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const { apiKey, baseUrl, llmModel, embeddingModel, project, location } = req.body;

        if (!apiKey) {
            res.status(400).json({
                message: "API key is required"
            });
            return;
        }

        const config = await prisma.geminiConfig.upsert({
            where: { userId },
            update: {
                apiKey,
                baseUrl: baseUrl || "https://generativelanguage.googleapis.com/v1beta",
                llmModel: llmModel || "gemini-2.0-flash-exp",
                embeddingModel: embeddingModel || "text-embedding-004",
                project: project || null,
                location: location || "us-central1"
            },
            create: {
                userId,
                apiKey,
                baseUrl: baseUrl || "https://generativelanguage.googleapis.com/v1beta",
                llmModel: llmModel || "gemini-2.0-flash-exp",
                embeddingModel: embeddingModel || "text-embedding-004",
                project: project || null,
                location: location || "us-central1"
            }
        });

        res.status(200).json({
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
        res.status(500).json({
            message: "Internal Server Error",
            error: err,
        });
    }
});

// Fetch available models from Gemini API
aiRouter.post("/gemini/models", authMiddleware, async(req, res): Promise<void> => {
    try {
        const { apiKey } = req.body;

        if (!apiKey) {
            res.status(400).json({
                message: "API key is required"
            });
            return;
        }

        // For now, return a static list of common Gemini models
        // The older version of @google/generative-ai doesn't have listModels
        const models = [
            {
                name: "models/gemini-1.5-flash",
                displayName: "Gemini 1.5 Flash",
                description: "Fast and versatile performance across a diverse variety of tasks",
                inputTokenLimit: 1048576,
                outputTokenLimit: 8192,
                supportedGenerationMethods: ["generateContent", "countTokens"]
            },
            {
                name: "models/gemini-1.5-pro",
                displayName: "Gemini 1.5 Pro",
                description: "Complex reasoning tasks requiring more intelligence",
                inputTokenLimit: 2097152,
                outputTokenLimit: 8192,
                supportedGenerationMethods: ["generateContent", "countTokens"]
            },
            {
                name: "models/gemini-pro",
                displayName: "Gemini Pro",
                description: "Best for scaling across a wide range of reasoning and creative tasks",
                inputTokenLimit: 30720,
                outputTokenLimit: 2048,
                supportedGenerationMethods: ["generateContent", "countTokens"]
            },
            {
                name: "models/text-embedding-004",
                displayName: "Text Embedding 004",
                description: "Obtain a distributed representation of a text",
                inputTokenLimit: 2048,
                outputTokenLimit: 1,
                supportedGenerationMethods: ["embedContent"]
            }
        ];

        // Separate embedding models and LLM models
        const embeddingModels = models.filter((model: any) =>
            model.name.includes('embedding') ||
            model.name.includes('embed')
        );

        const llmModels = models.filter((model: any) => {
            const isEmbedding = model.name.includes('embedding') || model.name.includes('embed');
            const isGenerative = model.name.includes('gemini') ||
                               model.name.includes('flash') ||
                               model.name.includes('pro');
            return !isEmbedding && isGenerative;
        });

        res.status(200).json({
            message: "Gemini models fetched successfully",
            models: {
                llm: llmModels.map((model: any) => ({
                    id: model.name.split('/').pop(),
                    name: model.name,
                    displayName: model.displayName,
                    description: model.description,
                    inputTokenLimit: model.inputTokenLimit,
                    outputTokenLimit: model.outputTokenLimit,
                    supportedGenerationMethods: model.supportedGenerationMethods
                })),
                embedding: embeddingModels.map((model: any) => ({
                    id: model.name.split('/').pop(),
                    name: model.name,
                    displayName: model.displayName,
                    description: model.description,
                    inputTokenLimit: model.inputTokenLimit,
                    outputTokenLimit: model.outputTokenLimit,
                    supportedGenerationMethods: model.supportedGenerationMethods
                })),
                all: models.map((model: any) => ({
                    id: model.name.split('/').pop(),
                    name: model.name,
                    displayName: model.displayName,
                    description: model.description,
                    inputTokenLimit: model.inputTokenLimit,
                    outputTokenLimit: model.outputTokenLimit,
                    supportedGenerationMethods: model.supportedGenerationMethods
                }))
            }
        });

    } catch(err: any) {
        console.log(err);
        res.status(500).json({
            message: "Failed to fetch Gemini models. Please check your API key.",
            error: err.message,
        });
    }
});

// Generate content with Gemini (with multimodal support)
aiRouter.post("/gemini/generate", authMiddleware, async(req, res): Promise<void> => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const { model, contents } = req.body;

        // Get user's Gemini config
        const config = await prisma.geminiConfig.findUnique({
            where: { userId }
        });

        if (!config) {
            res.status(400).json({
                message: "Gemini configuration not found. Please configure Gemini first."
            });
            return;
        }

        const genAI = new GoogleGenerativeAI(config.apiKey);
        const geminiModel = genAI.getGenerativeModel({ model: model || config.llmModel });

        const result = await geminiModel.generateContent(contents);

        res.status(200).json({
            message: "Content generated successfully",
            response: {
                text: result.response.text(),
                candidates: result.response.candidates || []
            }
        });

    } catch(err: any) {
        console.log(err);
        res.status(500).json({
            message: "Failed to generate content with Gemini",
            error: err.message,
        });
    }
});

// Generate embeddings with Gemini
aiRouter.post("/gemini/embed", authMiddleware, async(req, res): Promise<void> => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const { model, content } = req.body;

        // Get user's Gemini config
        const config = await prisma.geminiConfig.findUnique({
            where: { userId }
        });

        if (!config) {
            res.status(400).json({
                message: "Gemini configuration not found. Please configure Gemini first."
            });
            return;
        }

        const genAI = new GoogleGenerativeAI(config.apiKey);

        // For embeddings, use the embedding model directly
        const result = await genAI.getGenerativeModel({
            model: model || config.embeddingModel
        }).embedContent(content);

        res.status(200).json({
            message: "Embedding generated successfully",
            embedding: {
                values: result.embedding.values
            }
        });

    } catch(err: any) {
        console.log(err);
        res.status(500).json({
            message: "Failed to generate embedding with Gemini",
            error: err.message,
        });
    }
});

export default aiRouter;