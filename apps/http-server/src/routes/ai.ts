import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import { prisma } from "../config";
import axios from "axios";


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
aiRouter.post("/config", async(req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const { apiKey, baseUrl, llmModel, embeddingModel } = req.body;

        if (!apiKey) {
            return res.status(400).json({
                message: "API key is required"
            });
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
aiRouter.post("/models", async(req, res) => {
    try {
        const { apiKey, baseUrl } = req.body;

        if (!apiKey) {
            return res.status(400).json({
                message: "API key is required"
            });
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

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to fetch models. Please check your API key and base URL.",
            error: err.response?.data || err.message,
        });
    }
});

export default aiRouter;