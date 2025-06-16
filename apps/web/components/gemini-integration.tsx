"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Button } from './ui/button'
import Input from './ui/input'
import { CircleCheck, CircleX, Sparkles } from 'lucide-react';
import { UseAi } from '@/lib/aiContext';
import { useNotification } from './notification/notificationContext';
import ToolTip from './ui/tooltip';

const GeminiIntegration = () => {
  const apiKeyRef = useRef(null);
  const projectRef = useRef(null);

  const {
    checkValidAPI,
    isGeminiAuthenticated,
    removeApiKey,
    geminiConfig,
    availableGeminiModels,
    fetchGeminiModels,
    saveGeminiConfig
  } = UseAi();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingModels, setFetchingModels] = useState<boolean>(false);
  const {showNotification} = useNotification();

  // Local state for form inputs
  const [localConfig, setLocalConfig] = useState({
    baseUrl: geminiConfig.baseUrl,
    llmModel: geminiConfig.llmModel,
    embeddingModel: geminiConfig.embeddingModel,
    project: geminiConfig.project || "",
    location: geminiConfig.location
  });

  // Update local config when geminiConfig changes
  useEffect(() => {
    setLocalConfig({
      baseUrl: geminiConfig.baseUrl,
      llmModel: geminiConfig.llmModel,
      embeddingModel: geminiConfig.embeddingModel,
      project: geminiConfig.project || "",
      location: geminiConfig.location
    });
  }, [geminiConfig]);

  const handleFetchModels = async () => {
    //@ts-expect-error because of the Input
    const key = apiKeyRef.current?.value;

    if(!key) {
      showNotification({
        message:"API Key is required",
        type:"negative"
      })
      return;
    }

    setFetchingModels(true);
    const success = await fetchGeminiModels(key);
    if (success) {
      showNotification({
        message:"Gemini models fetched successfully",
        type:"positive"
      });
    }
    setFetchingModels(false);
  };

  const ValidateAndSaveConfig = async () => {
    //@ts-expect-error because of the Input
    const key = apiKeyRef.current?.value;
    //@ts-expect-error because of the Input
    const project = projectRef.current?.value;

    if(!key) {
      showNotification({
        message:"API Key is required",
        type:"negative"
      })
      return;
    }

    setLoading(true);

    // console.debug("Validating Gemini API Key and saving configuration");

    // First validate the API key
    const isValid = await checkValidAPI(key, undefined, 'gemini');

    if(isValid) {
      // Save the complete configuration
      const success = await saveGeminiConfig({
        apiKey: key,
        baseUrl: localConfig.baseUrl,
        llmModel: localConfig.llmModel,
        embeddingModel: localConfig.embeddingModel,
        project: project || undefined,
        location: localConfig.location
      });

      if (success) {
        showNotification({
          message:"Gemini configuration saved successfully",
          type:"positive"
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className='max-w-1/3 border p-6 rounded-md relative flex flex-col min-h-[400px]'>
      <div className="tooltip absolute right-4">
        <ToolTip>Integrate Google Gemini AI for advanced multimodal capabilities</ToolTip>
      </div>

      <div className="flex gap-2 items-center text-customPurple">
        {isGeminiAuthenticated ? (
          <p className="flex gap-2 items-center text-customPurple">
            <CircleCheck className="" size={20} />
            Connected Successfully
          </p>
        ) : (
          <div className="flex gap-2 items-center text-red-500">
            <CircleX className="" size={20} />
            Not Connected
          </div>
        )}
      </div>

      <Sparkles 
        size={100}
        className='my-4 text-customPurple'
      />
      
      <h1 className="text-2xl font-bold py-2">Integrate Google Gemini</h1>
      <p className="flex-wrap dark:text-gray-300 text-gray-500 text-sm pb-4">
        Connect your Google Gemini API to enable advanced multimodal AI capabilities including image and video understanding for enhanced tweet generation.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project ID (Optional)</label>
          <Input
            ref={projectRef}
            type="text"
            placeholder="your-google-cloud-project-id"
            disabled={isGeminiAuthenticated}
            className={` ${isGeminiAuthenticated && "cursor-not-allowed"}`}
            defaultValue={localConfig.project}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Your Google Cloud Project ID for Vertex AI access
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <Input
            ref={apiKeyRef}
            type="password"
            placeholder="Enter Your Gemini API Key Here"
            disabled={isGeminiAuthenticated}
            className={` ${isGeminiAuthenticated && "cursor-not-allowed"}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-customPurple hover:underline">Google AI Studio</a>
          </p>
        </div>

        {!isGeminiAuthenticated && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleFetchModels}
            loading={fetchingModels}
          >
            Fetch Available Models
          </Button>
        )}

        {/* Model Selection */}
        {(availableGeminiModels.llm.length > 0 || availableGeminiModels.embedding.length > 0) && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">LLM Model</label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={localConfig.llmModel}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, llmModel: e.target.value }))}
                disabled={isGeminiAuthenticated}
              >
                {availableGeminiModels.llm.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.displayName || model.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Embedding Model</label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={localConfig.embeddingModel}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, embeddingModel: e.target.value }))}
                disabled={isGeminiAuthenticated}
              >
                {availableGeminiModels.embedding.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.displayName || model.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {isGeminiAuthenticated ? (
        <div className="space-y-2 mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>LLM Model:</strong> {geminiConfig.llmModel}</p>
            <p><strong>Embedding Model:</strong> {geminiConfig.embeddingModel}</p>
            {geminiConfig.project && <p><strong>Project:</strong> {geminiConfig.project}</p>}
            <p><strong>Location:</strong> {geminiConfig.location}</p>
          </div>
          <Button
            variant="primary"
            className="bg-red-500 dark:!bg-red-500 dark:text-white w-full bg-opacity-100 mt-auto"
            onClick={() => removeApiKey('gemini')}
            loading={loading}
          >
            <CircleX size={24} /> Disconnect
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          className="flex items-center my-2 w-full mt-4"
          onClick={ValidateAndSaveConfig}
          loading={loading}
          disabled={!localConfig.llmModel || !localConfig.embeddingModel}
        >
          <Sparkles size={24} /> Save Configuration
        </Button>
      )}
    </div>
  )
}

export default GeminiIntegration
