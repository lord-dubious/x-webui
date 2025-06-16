"use client"

import { useNotification } from "@/components/notification/notificationContext";
import axios from "axios";
import { useContext , createContext, useState, useEffect, ReactElement} from "react";
import { domain } from "./utils";
import Cookies from "js-cookie";
import OpenAI from "openai";



type AiContextType = {
    checkValidAPI: (key:string, baseUrl?:string, provider?: AIProvider) => Promise<boolean>;
    isKeyAuthenticated:boolean;
    removeApiKey:(provider?: AIProvider) => void;
    openAiKey:string;
    setOpenAiKey:React.Dispatch<React.SetStateAction<string>>
    geminiKey:string;
    setGeminiKey:React.Dispatch<React.SetStateAction<string>>
    integrateX:() => void
    getXDetails: () => Promise<boolean>
    Xdata:Xdata | null
    isXIntegrated:boolean;
    logOutXAccount:() => void
    selectedBot:AiBot | null,
    setSelectedBot:React.Dispatch<React.SetStateAction<AiBot | null>>;
    aiBots:AiBot[]
    getAssistantReply:(messages:Message[], setMessages:React.Dispatch<React.SetStateAction<Message[]>>, mediaFiles?: File[]) => void
    chats: Message[]
    setChats: React.Dispatch<React.SetStateAction<Message[]>>
    tIChats:Message[]
    setTIChats:React.Dispatch<React.SetStateAction<Message[]>>
    // Provider management
    currentProvider: AIProvider;
    setCurrentProvider: React.Dispatch<React.SetStateAction<AIProvider>>;
    isGeminiAuthenticated: boolean;
    // OpenAI configuration methods
    openAiConfig: OpenAIConfig;
    setOpenAiConfig: React.Dispatch<React.SetStateAction<OpenAIConfig>>;
    availableModels: { llm: OpenAIModel[], embedding: OpenAIModel[] };
    setAvailableModels: React.Dispatch<React.SetStateAction<{ llm: OpenAIModel[], embedding: OpenAIModel[] }>>;
    fetchModels: (apiKey: string, baseUrl?: string) => Promise<boolean>;
    saveOpenAiConfig: (config: OpenAIConfig & { apiKey: string }) => Promise<boolean>;
    loadOpenAiConfig: () => Promise<void>;
    // Gemini configuration methods
    geminiConfig: GeminiConfig;
    setGeminiConfig: React.Dispatch<React.SetStateAction<GeminiConfig>>;
    availableGeminiModels: { llm: GeminiModel[], embedding: GeminiModel[] };
    setAvailableGeminiModels: React.Dispatch<React.SetStateAction<{ llm: GeminiModel[], embedding: GeminiModel[] }>>;
    fetchGeminiModels: (apiKey: string) => Promise<boolean>;
    saveGeminiConfig: (config: GeminiConfig & { apiKey: string }) => Promise<boolean>;
    loadGeminiConfig: () => Promise<void>;
}

type Xdata = {
    id:string,
    twitterId:string,
    username:string,
    name:string,
    profilePicture:string,
    accessToken:string,
    refreshToken:string
}

export type Bot = {
  image: ReactElement;
  name: string;
  };

  export type AiBot = {
    id:string,
    name:string,
    tag:string,
    imageURL:string,
    twitterLink:string,
    profile?:string
  }

  export interface Message {
    role: "system" | "user" | "assistant";
    content:string;
  }

  export interface OpenAIConfig {
    baseUrl: string;
    llmModel: string;
    embeddingModel: string;
  }

  export interface OpenAIModel {
    id: string;
    object: string;
    created?: number;
    owned_by?: string;
  }

  export interface GeminiConfig {
    baseUrl: string;
    llmModel: string;
    embeddingModel: string;
    project?: string;
    location: string;
  }

  export interface GeminiModel {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    inputTokenLimit?: number;
    outputTokenLimit?: number;
    supportedGenerationMethods?: string[];
  }

  export type AIProvider = 'openai' | 'gemini';

  export interface ProviderConfig {
    openai: OpenAIConfig;
    gemini: GeminiConfig;
  }

  export interface ProviderModels {
    openai: { llm: OpenAIModel[], embedding: OpenAIModel[] };
    gemini: { llm: GeminiModel[], embedding: GeminiModel[] };
  }

const AiContext =  createContext<AiContextType | undefined> (undefined);


export const AiContextProvider = ({children}:{children:React.ReactNode}) => {

    const {showNotification} = useNotification();
    const [isKeyAuthenticated, setIsKeyAuthenticated] = useState<boolean>(false);
    const [openAiKey, setOpenAiKey] = useState<string>("");
    const [geminiKey, setGeminiKey] = useState<string>("");
    const [isGeminiAuthenticated, setIsGeminiAuthenticated] = useState<boolean>(false);
    const [currentProvider, setCurrentProvider] = useState<AIProvider>('openai');
    const [Xdata, setXdata] = useState<Xdata | null>(null)
    const [isXIntegrated, setIsXIntegrated] = useState<boolean>(false);

    //bots
    const [selectedBot, setSelectedBot] = useState<AiBot | null>(null);
    const [aiBots, setAiBots] = useState<AiBot[]>([]);
     const [chats, setChats] = useState<Message[]>([]);
     const [tIChats, setTIChats] = useState<Message[]>([]);

    // OpenAI configuration state
    const [openAiConfig, setOpenAiConfig] = useState<OpenAIConfig>({
        baseUrl: "https://api.openai.com/v1",
        llmModel: "gpt-4",
        embeddingModel: "text-embedding-3-small"
    });
    const [availableModels, setAvailableModels] = useState<{ llm: OpenAIModel[], embedding: OpenAIModel[] }>({
        llm: [],
        embedding: []
    });

    // Gemini configuration state
    const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>({
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        llmModel: "gemini-2.0-flash-exp",
        embeddingModel: "text-embedding-004",
        project: undefined,
        location: "us-central1"
    });
    const [availableGeminiModels, setAvailableGeminiModels] = useState<{ llm: GeminiModel[], embedding: GeminiModel[] }>({
        llm: [],
        embedding: []
    });
    

    useEffect(() => {
        const xAccessToken = Cookies.get("xAccessToken");
        const xRefreshToken = Cookies.get("xRefreshToken");

        if(xAccessToken && xRefreshToken) {
            getXDetails();

        }

        const checkIfApiKeyValidOnStart = async() => {

            const openAiAuth = localStorage.getItem("openAiAuth");
            if(openAiAuth) {
                    setIsKeyAuthenticated(true);
                    setOpenAiKey(openAiAuth);
            }

            const geminiAuth = localStorage.getItem("geminiAuth");
            if(geminiAuth) {
                    setIsGeminiAuthenticated(true);
                    setGeminiKey(geminiAuth);
            }
        }


        checkIfApiKeyValidOnStart();
        getBots();
        loadOpenAiConfig();
        loadGeminiConfig();


    },[])


    const checkValidAPI = async (key:string, baseUrl?: string, provider: AIProvider = 'openai') => {

        try {
            if (provider === 'gemini') {
                // For Gemini, we'll use our backend endpoint to validate
                const URL = `${domain}/api/v1/user/ai/gemini/models`;
                await axios.post(URL, { apiKey: key }, { withCredentials: true });
                setIsGeminiAuthenticated(true);
            } else {
                // For OpenAI-compatible APIs
                const URL = `${baseUrl || openAiConfig.baseUrl}/models`;
                await axios.get(URL, {
                    headers:{
                        Authorization: `Bearer ${key}`
                    }
                });
                setIsKeyAuthenticated(true);
            }

            return true;

        }

        catch(e) {
            console.log(e)
            showNotification({
                message:`${provider === 'gemini' ? 'Gemini' : 'OpenAI'} API key is invalid or configuration is incorrect`,
                type:"negative"
              })
              return false;

        }


    }

    const removeApiKey = (provider: AIProvider = 'openai') => {

        if (provider === 'gemini') {
            localStorage.removeItem("geminiAuth")
            setIsGeminiAuthenticated(false);
            setGeminiKey("");
            showNotification({
                message:"Gemini API Key Deleted",
                "type":"positive"
            })
        } else {
            localStorage.removeItem("openAiAuth")
            setIsKeyAuthenticated(false);
            setOpenAiKey("");
            showNotification({
                message:"OpenAI API Key Deleted",
                "type":"positive"
            })
        }
    }

    const integrateX = () => {

        const twitterIntegrateUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/user/path/auth/twitter`

        window.open(
            twitterIntegrateUrl,
             "googleLoginPopup",
            "width=500,height=600"
        )


    }

    const getXDetails = async () => {

        try {
            const URL = `${domain}/api/v1/user/path/twitter/accountinfo`;

            const result = await axios.get(URL,{
                withCredentials:true
              });

            console.log(result.data);
            setXdata(result.data.account);
            setIsXIntegrated(true);

            Cookies.set("xAccessToken",result.data.account.accessToken);
            Cookies.set("xRefreshToken",result.data.account.refreshToken);
            return true;

        }

        catch(e) {
            console.log(e);
            showNotification({
                //@ts-expect-error  because of message
                message:e.response.data.message || "Internal Server Error",
                type:"negative"
              })
              return false;
        }

    }

    const logOutXAccount = async  () => {

  
        Cookies.remove("xAccessToken", { path: "/" });
        Cookies.remove("xRefreshToken", { path: "/" });
        setIsXIntegrated(false);

        try {
          const URL = `${domain}/api/v1/user/path/twitter/delete`;

          const result = await axios.post(URL,{
            twitterId:Xdata?.id
          },{
              withCredentials:true
            });

            showNotification({
              message:result.data.message || "Twitter Account Disconnected",
              type:"positive"
          })

        }catch(err) {
          console.log(err);
          showNotification({
              //@ts-expect-error  because of message
              message:e.response.data.message || "Internal Server Error",
              type:"negative"
            })
            return false;

        }

    }

    const getBots = async () => {
        try {
            const URL = `${domain}/api/v1/user/ai/getbots`;
            const result = await axios.get(URL, {
                withCredentials:true
            })

            setAiBots(result.data.bots);
            setSelectedBot(result.data.bots[0]);
        } catch(err){
            console.log(err);
        }

    }


  const getContext = async (embeddingVector:number[]) => {

    try {
      const URL = `${domain}/api/v1/user/ai/getcontext`;
      const result = await axios.post(URL,{
        embeddingVector, 
         botId:selectedBot?.id}, 
         {
        withCredentials:true
      } )
  
      return result.data.context;

    } catch(err){
      console.log(err);
      showNotification({
        message: (err as any).response?.data?.message || "Internal Server Error",
        type:"negative"
      })


    }


  }
  const openai = new OpenAI({
    apiKey:openAiKey,
    baseURL: openAiConfig.baseUrl,
    dangerouslyAllowBrowser:true
  })

    const checkIfKeyPresent =  () => {
    if(!openAiKey) {
        return false;
    }
    return true;
  }

  const getAssistantReply = async (chatHistory: Message[], setMessages:React.Dispatch<React.SetStateAction<Message[]>>, mediaFiles?: File[]) => {
    const hasOpenAI = checkIfKeyPresent();
    const hasGemini = geminiKey && isGeminiAuthenticated;

    if (!hasOpenAI && !hasGemini) {
        showNotification({
            message:"No AI provider configured. Please add OpenAI or Gemini API key in Integrations Tab.",
            type:"negative"
        })
        return;
    }

    // Use Gemini if available and we have media files, otherwise use the current provider
    const useGemini = hasGemini && (mediaFiles?.length || currentProvider === 'gemini');

    if (useGemini && !hasGemini) {
        showNotification({
            message:"Gemini API Key Not Added, Go To Integrations Tab.",
            type:"negative"
        })
        return;
    }

    if (!useGemini && !hasOpenAI) {
        showNotification({
            message:"OpenAI API Key Not Added, Go To Integrations Tab.",
            type:"negative"
        })
        return;
    }
    const lastMessage = chatHistory[0]?.content;
    const embeddingVector = await getEmbedding(lastMessage || "", useGemini ? 'gemini' : 'openai') ;
    const tweetContext = await getContext(embeddingVector);

    const systemPrompt = `
You are ${selectedBot?.name}. ${selectedBot?.profile}

Use the following guidelines in all your responses:

[TWEET MODE]
• When the user requests a tweet or provides only a subject, generate a tweet that does not exceed 280 characters.
• Include trending hashtags with proper spacing and, if needed, insert new lines for readability.
• Use minimal or no emojis—only include them if they naturally fit the context.
• If a subject is provided without a direct question, compose a tweet on that topic rather than asking for clarification.
${mediaFiles?.length ? '• When images or videos are provided, analyze them and incorporate relevant insights into your tweet.' : ''}

[CHAT MODE]
• When the user asks a question or engages in conversation (that isn’t tweet-specific), answer in a natural, friendly tone while keeping responses under 500 characters.
• Ensure that your replies reflect your coding expertise and personal style without exceeding the character limit.
${mediaFiles?.length ? '• When images or videos are provided, analyze them and provide relevant insights or commentary.' : ''}

Below is context gathered from 10 of your recent tweets (via vector search). Use this context to help guide your tone and style if it’s relevant, but do not mention the source:
--------
START CONTEXT
${tweetContext}
END CONTEXT
--------

Current Input:
${lastMessage}

If the provided context lacks sufficient details for the request, rely on your profile summary and extensive coding experience to generate a response. Maintain your distinct voice in every answer.
`;

    if (useGemini) {
      await handleGeminiResponse(systemPrompt, chatHistory, setMessages, mediaFiles);
    } else {
      const systemMessage: Message = {
        role: "system",
        content: systemPrompt
      };
      await handleOpenAIResponse(systemMessage, chatHistory, setMessages);
    }
  }

  const handleOpenAIResponse = async (systemMessage: Message, chatHistory: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
    const requestBody = {
      model: openAiConfig.llmModel,
      messages:[systemMessage, ...chatHistory],
      stream:true
    }
    try {

      const response = await fetch(`${openAiConfig.baseUrl}/chat/completions`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${openAiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok || !response.body) {
        throw new Error("Stream response error");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let assistantReply ="";


      setMessages((prev) => [...prev, {role:"assistant", content:" "}]);

      while(!done) {
        const {value, done:doneReading} = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, {stream:true})

        const lines = chunkValue.split("\n").filter((line) => line.trim() !=="");

        for(const line of lines) {
          if(line.startsWith("data: ")) {
            const dataStr = line.replace("data: ","").trim();
            if(dataStr === "[DONE]") {
              done= true;
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              const content = parsed.choices[0]?.delta?.content;

              if(content) {
                assistantReply += content;

                setMessages((prev) => {
                  const updated = [...prev]
                  const lastIndex = updated.length -1;
                  updated[lastIndex] = {role:"assistant", content:assistantReply};
                  return updated;
                })
              }
            } catch(err) {
              console.error("Error parsing stream chunk:", err);
            }
          }
        }

      }


    }
    catch(err) {
      console.error("Error during chat completion:", err);
      showNotification({
        message: "Error during chat completion",
        type: "negative",
      });

    }
  }

  const handleGeminiResponse = async (systemPrompt: string, chatHistory: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>, mediaFiles?: File[]) => {
    try {
      // Convert media files to base64 for Gemini
      const mediaParts = [];
      if (mediaFiles?.length) {
        for (const file of mediaFiles) {
          const base64 = await fileToBase64(file);
          mediaParts.push({
            inlineData: {
              data: base64.split(',')[1], // Remove data:image/jpeg;base64, prefix
              mimeType: file.type
            }
          });
        }
      }

      // Prepare content for Gemini
      const lastMessage = chatHistory[0]?.content;
      const parts = [
        { text: systemPrompt },
        { text: `User: ${lastMessage}` },
        ...mediaParts
      ];

      // Call Gemini API through our backend
      const response = await fetch(`${domain}/api/v1/user/ai/gemini/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          model: geminiConfig.llmModel,
          contents: [{ parts }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API request failed');
      }

      const data = await response.json();
      const assistantReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

      setMessages((prev) => [...prev, {role:"assistant", content:assistantReply}]);

    } catch(err) {
      console.error("Error during Gemini chat completion:", err);
      showNotification({
        message: "Error during Gemini chat completion",
        type: "negative",
      });
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  const getEmbedding = async (message:string, provider: AIProvider = 'openai') => {
    let embeddingVector:number[] =[];
    try {
      if (provider === 'gemini' && geminiKey) {
        // Use Gemini embedding through our backend
        const response = await fetch(`${domain}/api/v1/user/ai/gemini/embed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            model: geminiConfig.embeddingModel,
            content: message
          })
        });

        if (response.ok) {
          const data = await response.json();
          embeddingVector = data.embedding?.values || [];
        } else {
          throw new Error('Gemini embedding failed');
        }
      } else {
        // Use OpenAI embedding
        console.log(openAiKey)
        const embeddingResponse = await openai.embeddings.create({
          model: openAiConfig.embeddingModel,
          input: message,
          encoding_format: "float",
        });
        embeddingVector = embeddingResponse.data[0]?.embedding || [];
      }
      return embeddingVector;

    } catch (err) {
      console.error("Error getting embedding:", err);
      showNotification({ message: "Error getting embedding", type: "negative" });
      return [];

    }
  }

  // New methods for OpenAI configuration
  const fetchModels = async (apiKey: string, baseUrl?: string): Promise<boolean> => {
    try {
      const URL = `${domain}/api/v1/user/ai/models`;
      const result = await axios.post(URL, {
        apiKey,
        baseUrl: baseUrl || openAiConfig.baseUrl
      }, {
        withCredentials: true
      });

      setAvailableModels({
        llm: result.data.models.llm || [],
        embedding: result.data.models.embedding || []
      });

      return true;
    } catch (err) {
      console.log(err);
      showNotification({
        //@ts-expect-error because of message
        message: err.response?.data?.message || "Failed to fetch models",
        type: "negative"
      });
      return false;
    }
  };

  const saveOpenAiConfig = async (config: OpenAIConfig & { apiKey: string }): Promise<boolean> => {
    try {
      const URL = `${domain}/api/v1/user/ai/config`;
      await axios.post(URL, config, {
        withCredentials: true
      });

      setOpenAiConfig({
        baseUrl: config.baseUrl,
        llmModel: config.llmModel,
        embeddingModel: config.embeddingModel
      });

      localStorage.setItem("openAiAuth", config.apiKey);
      setOpenAiKey(config.apiKey);
      setIsKeyAuthenticated(true);

      showNotification({
        message: "OpenAI configuration saved successfully",
        type: "positive"
      });

      return true;
    } catch (err) {
      console.log(err);
      showNotification({
        //@ts-expect-error because of message
        message: err.response?.data?.message || "Failed to save configuration",
        type: "negative"
      });
      return false;
    }
  };

  const loadOpenAiConfig = async (): Promise<void> => {
    try {
      const URL = `${domain}/api/v1/user/ai/config`;
      const result = await axios.get(URL, {
        withCredentials: true
      });

      if (result.data.config) {
        setOpenAiConfig(result.data.config);
      }
    } catch (err) {
      console.log("No saved OpenAI configuration found");
    }
  };

  // Gemini-specific methods
  const fetchGeminiModels = async (apiKey: string): Promise<boolean> => {
    try {
      const URL = `${domain}/api/v1/user/ai/gemini/models`;
      const result = await axios.post(URL, {
        apiKey
      }, {
        withCredentials: true
      });

      setAvailableGeminiModels({
        llm: result.data.models.llm || [],
        embedding: result.data.models.embedding || []
      });

      return true;
    } catch (err) {
      console.log(err);
      showNotification({
        //@ts-expect-error because of message
        message: err.response?.data?.message || "Failed to fetch Gemini models",
        type: "negative"
      });
      return false;
    }
  };

  const saveGeminiConfig = async (config: GeminiConfig & { apiKey: string }): Promise<boolean> => {
    try {
      const URL = `${domain}/api/v1/user/ai/gemini/config`;
      await axios.post(URL, config, {
        withCredentials: true
      });

      setGeminiConfig({
        baseUrl: config.baseUrl,
        llmModel: config.llmModel,
        embeddingModel: config.embeddingModel,
        project: config.project,
        location: config.location
      });

      localStorage.setItem("geminiAuth", config.apiKey);
      setGeminiKey(config.apiKey);
      setIsGeminiAuthenticated(true);

      showNotification({
        message: "Gemini configuration saved successfully",
        type: "positive"
      });

      return true;
    } catch (err) {
      console.log(err);
      showNotification({
        //@ts-expect-error because of message
        message: err.response?.data?.message || "Failed to save Gemini configuration",
        type: "negative"
      });
      return false;
    }
  };

  const loadGeminiConfig = async (): Promise<void> => {
    try {
      const URL = `${domain}/api/v1/user/ai/gemini/config`;
      const result = await axios.get(URL, {
        withCredentials: true
      });

      if (result.data.config) {
        setGeminiConfig(result.data.config);
      }
    } catch (err) {
      console.log("No saved Gemini configuration found");
    }
  };


    return (
        <AiContext.Provider value={{
            checkValidAPI,
            isKeyAuthenticated,
            removeApiKey,
            openAiKey,
            setOpenAiKey,
            geminiKey,
            setGeminiKey,
            integrateX,
            getXDetails,
            Xdata,
            isXIntegrated,
            logOutXAccount,
            setSelectedBot,
            selectedBot,
            aiBots,
            getAssistantReply,
            chats,
            setChats,
            setTIChats,
            tIChats,
            // Provider management
            currentProvider,
            setCurrentProvider,
            isGeminiAuthenticated,
            // OpenAI configuration values
            openAiConfig,
            setOpenAiConfig,
            availableModels,
            setAvailableModels,
            fetchModels,
            saveOpenAiConfig,
            loadOpenAiConfig,
            // Gemini configuration values
            geminiConfig,
            setGeminiConfig,
            availableGeminiModels,
            setAvailableGeminiModels,
            fetchGeminiModels,
            saveGeminiConfig,
            loadGeminiConfig
        }} >
            {children}
        </AiContext.Provider>
    )
}

export const UseAi = () => {
const context = useContext(AiContext);
    if (!context) {
      throw new Error("useAi must be used within an Ai Provider");
    }
    return context;

}