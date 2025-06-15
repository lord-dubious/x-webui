"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { CircleCheck, CircleX } from "lucide-react";
import { PiOpenAiLogoThin } from "react-icons/pi";
import Input from "./ui/input";
import { UseAi } from "@/lib/aiContext";
import { useNotification } from "./notification/notificationContext";
import ToolTip from "./ui/tooltip";

const OpenAiIntegration = () => {
  const apiKeyRef = useRef(null);
  const baseUrlRef = useRef(null);

  const {
    checkValidAPI,
    isKeyAuthenticated,
    removeApiKey,
    openAiKey,
    openAiConfig,
    availableModels,
    fetchModels,
    saveOpenAiConfig
  } = UseAi();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingModels, setFetchingModels] = useState<boolean>(false);
  const {showNotification} = useNotification();

  // Local state for form inputs
  const [localConfig, setLocalConfig] = useState({
    baseUrl: openAiConfig.baseUrl,
    llmModel: openAiConfig.llmModel,
    embeddingModel: openAiConfig.embeddingModel
  });

  useEffect(() => {
 //@ts-expect-error because of the Input
    apiKeyRef.current.value = openAiKey;
    //@ts-expect-error because of the Input
    baseUrlRef.current.value = openAiConfig.baseUrl;
    setLocalConfig({
      baseUrl: openAiConfig.baseUrl,
      llmModel: openAiConfig.llmModel,
      embeddingModel: openAiConfig.embeddingModel
    });
    console.log("here is the key comming :"+openAiKey);
  }, [openAiKey, openAiConfig])

  const handleFetchModels = async () => {
    //@ts-expect-error because of the Input
    const key = apiKeyRef.current?.value;
    //@ts-expect-error because of the Input
    const baseUrl = baseUrlRef.current?.value;

    if(!key) {
      showNotification({
        message:"API Key is required",
        type:"negative"
      })
      return;
    }

    setFetchingModels(true);
    const success = await fetchModels(key, baseUrl);
    if (success) {
      showNotification({
        message:"Models fetched successfully",
        type:"positive"
      });
    }
    setFetchingModels(false);
  };

  const ValidateAndSaveConfig = async () => {
    //@ts-expect-error because of the Input
    const key = apiKeyRef.current?.value;
    //@ts-expect-error because of the Input
    const baseUrl = baseUrlRef.current?.value;

    if(!key) {
      showNotification({
        message:"API Key is required",
        type:"negative"
      })
      return;
    }

    if(!localConfig.llmModel || !localConfig.embeddingModel) {
      showNotification({
        message:"Please select both LLM and Embedding models",
        type:"negative"
      })
      return;
    }

    setLoading(true);

    console.log("Validating API Key and saving configuration");

    // First validate the API key
    const isValid = await checkValidAPI(key, baseUrl);

    if(isValid) {
      // Save the complete configuration
      const success = await saveOpenAiConfig({
        apiKey: key,
        baseUrl: baseUrl || "https://api.openai.com/v1",
        llmModel: localConfig.llmModel,
        embeddingModel: localConfig.embeddingModel
      });

      if (success) {
        showNotification({
          message:"OpenAI configuration saved successfully",
          type:"positive"
        });
      }
    }
    setLoading(false);
  };


  return (
    <div 
    className=" max-w-1/3 border p-6 rounded-md relative flex flex-col min-h-[400px] "
    >
      <div className="tooltip absolute right-4 ">

      <ToolTip>Enter your OpenApi Key. Access it from here <a rel="noopener" className="underline" target="_blank" href="https://platform.openai.com/settings/organization/api-keys">Access Here</a></ToolTip>

      </div>
      <div className="text-gray-500 flex gap-2 items-center">
        {isKeyAuthenticated ? (
          <p className="flex gap-2 items-center text-customBlue">
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
      <PiOpenAiLogoThin size={100} className="my-4" />
      <h1 className="text-2xl font-bold py-2 ">Configure OpenAI-Compatible API</h1>
      <p className="dark:text-gray-300 text-gray-500 text-sm pb-2">
       Your API key is secure in your browser only. Supports OpenAI and compatible endpoints.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Base URL</label>
          <Input
            ref={baseUrlRef}
            type="text"
            placeholder="https://api.openai.com/v1"
            disabled={isKeyAuthenticated}
            className={` ${isKeyAuthenticated && "cursor-not-allowed"}`}
            defaultValue="https://api.openai.com/v1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use default for OpenAI, or enter custom endpoint URL
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <Input
            ref={apiKeyRef}
            type="password"
            placeholder="Enter Your API Key Here"
            disabled={isKeyAuthenticated}
            className={` ${isKeyAuthenticated && "cursor-not-allowed"}`}
          />
        </div>

        {!isKeyAuthenticated && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleFetchModels}
            loading={fetchingModels}
          >
            Fetch Available Models
          </Button>
        )}

        {availableModels.llm.length > 0 && !isKeyAuthenticated && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">LLM Model</label>
              <select
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                value={localConfig.llmModel}
                onChange={(e) => setLocalConfig(prev => ({...prev, llmModel: e.target.value}))}
              >
                <option value="">Select LLM Model</option>
                {availableModels.llm.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Embedding Model</label>
              <select
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                value={localConfig.embeddingModel}
                onChange={(e) => setLocalConfig(prev => ({...prev, embeddingModel: e.target.value}))}
              >
                <option value="">Select Embedding Model</option>
                {availableModels.embedding.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6" id="buttons">

      {isKeyAuthenticated ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Base URL:</strong> {openAiConfig.baseUrl}</p>
            <p><strong>LLM Model:</strong> {openAiConfig.llmModel}</p>
            <p><strong>Embedding Model:</strong> {openAiConfig.embeddingModel}</p>
          </div>
          <Button
            variant="primary"
            className="bg-red-500 dark:!bg-red-500 dark:text-white w-full  bg-opacity-100 mt-auto"
            onClick={removeApiKey}
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
          <PiOpenAiLogoThin size={24} /> Save Configuration
        </Button>
      )}
      </div>

      
    </div>
  );
};

export default OpenAiIntegration;
