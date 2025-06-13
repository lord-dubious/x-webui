# OpenAI-Compatible API Support

This application now supports custom OpenAI-compatible endpoints with dynamic model fetching. You can use any OpenAI-compatible API provider, including local models, other cloud providers, or custom endpoints.

## Features

### ✨ **What's New**

- **Custom Base URL Support**: Use any OpenAI-compatible endpoint
- **Dynamic Model Fetching**: Automatically fetch available models from your API
- **Separate Model Selection**: Choose different models for LLM and embedding tasks
- **Persistent Configuration**: Your settings are saved per user account
- **Real-time Validation**: API key and endpoint validation before saving

### 🔧 **Supported Providers**

This implementation works with any OpenAI-compatible API, including:

- **OpenAI** (default): `https://api.openai.com/v1`
- **Local Models**: 
  - Ollama: `http://localhost:11434/v1`
  - LM Studio: `http://localhost:1234/v1`
  - Text Generation WebUI: `http://localhost:5000/v1`
- **Cloud Providers**:
  - Azure OpenAI: `https://your-resource.openai.azure.com/openai/deployments/your-deployment`
  - Anthropic Claude (via proxy)
  - Google Gemini (via proxy)
  - Any other OpenAI-compatible endpoint

## How to Use

### 1. **Access Configuration**

Navigate to **Dashboard → Integrations → OpenAI Configuration**

### 2. **Configure Your API**

1. **Base URL**: Enter your API endpoint URL
   - Default: `https://api.openai.com/v1`
   - For local: `http://localhost:11434/v1` (Ollama example)
   - For custom: Your provider's endpoint

2. **API Key**: Enter your API key for the service

3. **Fetch Models**: Click "Fetch Available Models" to load available models

4. **Select Models**:
   - **LLM Model**: Choose the model for chat/text generation
   - **Embedding Model**: Choose the model for text embeddings

5. **Save Configuration**: Click "Save Configuration" to apply settings

### 3. **Model Selection**

The application automatically categorizes models:

- **LLM Models**: Models containing 'gpt', 'claude', 'llama', 'mistral', 'gemini' or not containing 'embedding'
- **Embedding Models**: Models containing 'embedding' or 'embed'

## API Endpoints

### Backend Endpoints Added

- `GET /api/v1/user/ai/config` - Get user's OpenAI configuration
- `POST /api/v1/user/ai/config` - Save user's OpenAI configuration  
- `POST /api/v1/user/ai/models` - Fetch available models from endpoint

### Database Schema

New `OpenAIConfig` model stores per-user configuration:

```prisma
model OpenAIConfig {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  
  apiKey String
  baseUrl String @default("https://api.openai.com/v1")
  llmModel String @default("gpt-4")
  embeddingModel String @default("text-embedding-3-small")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  userId String @db.ObjectId @unique
  user User @relation(fields: [userId], references: [id])
}
```

## Examples

### Ollama Setup

1. Install and run Ollama locally
2. Pull models: `ollama pull llama2` and `ollama pull nomic-embed-text`
3. Configure in app:
   - Base URL: `http://localhost:11434/v1`
   - API Key: `ollama` (or any value)
   - LLM Model: `llama2`
   - Embedding Model: `nomic-embed-text`

### Azure OpenAI Setup

1. Get your Azure OpenAI endpoint and key
2. Configure in app:
   - Base URL: `https://your-resource.openai.azure.com/openai/deployments/your-deployment`
   - API Key: Your Azure API key
   - Select your deployed models

### LM Studio Setup

1. Start LM Studio with API server
2. Configure in app:
   - Base URL: `http://localhost:1234/v1`
   - API Key: `lm-studio` (or any value)
   - Select loaded models

## Technical Implementation

### Frontend Changes

- Updated `aiContext.tsx` with new configuration state and methods
- Enhanced `open-ai.tsx` component with model selection UI
- Added dynamic model fetching and validation
- Persistent configuration storage

### Backend Changes

- New API routes for configuration and model fetching
- Database schema updates for per-user settings
- OpenAI client configuration with custom base URLs
- Model categorization and filtering

### Security

- API keys are stored securely in the database
- Frontend validation before API calls
- Error handling for invalid endpoints
- No API keys exposed in client-side code

## Troubleshooting

### Common Issues

1. **"Failed to fetch models"**
   - Check if your API endpoint is accessible
   - Verify API key is correct
   - Ensure endpoint follows OpenAI API format

2. **"No embedding models found"**
   - Some providers may not have embedding models
   - Try using OpenAI for embeddings with custom LLM

3. **"API key is invalid"**
   - Verify the API key format for your provider
   - Check if the endpoint requires authentication

### Model Compatibility

- Ensure your chosen models support the required features
- LLM models should support chat completions
- Embedding models should support text embeddings
- Some local models may have different parameter requirements

## Migration

Existing users will automatically use default OpenAI settings. To migrate:

1. Go to Integrations page
2. Your existing API key will be preserved
3. Configure custom endpoint if desired
4. Select preferred models
5. Save new configuration

---

**Note**: This feature maintains backward compatibility with existing OpenAI configurations while adding support for any OpenAI-compatible API provider.
