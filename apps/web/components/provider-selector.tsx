"use client"

import React from 'react'
import { UseAi } from '@/lib/aiContext'
import { Button } from './ui/button'
import { PiOpenAiLogoThin } from 'react-icons/pi'
import { Sparkles } from 'lucide-react'

const ProviderSelector = () => {
  const { 
    currentProvider, 
    setCurrentProvider, 
    isKeyAuthenticated, 
    isGeminiAuthenticated 
  } = UseAi()

  const providers = [
    {
      id: 'openai' as const,
      name: 'OpenAI',
      icon: PiOpenAiLogoThin,
      isAuthenticated: isKeyAuthenticated,
      description: 'GPT models with OpenAI-compatible APIs'
    },
    {
      id: 'gemini' as const,
      name: 'Gemini',
      icon: Sparkles,
      isAuthenticated: isGeminiAuthenticated,
      description: 'Google Gemini with multimodal capabilities'
    }
  ]

  const handleProviderChange = (providerId: 'openai' | 'gemini') => {
    setCurrentProvider(providerId)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">AI Provider</h3>
      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => {
          const IconComponent = provider.icon
          const isSelected = currentProvider === provider.id
          const isAvailable = provider.isAuthenticated

          return (
            <Button
              key={provider.id}
              variant={isSelected ? "primary" : "secondary"}
              className={`
                flex flex-col items-center p-4 h-auto space-y-2
                ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => isAvailable && handleProviderChange(provider.id)}
              disabled={!isAvailable}
            >
              <IconComponent size={24} />
              <div className="text-center">
                <div className="font-medium">{provider.name}</div>
                <div className="text-xs opacity-75">{provider.description}</div>
                {!isAvailable && (
                  <div className="text-xs text-red-500 mt-1">Not configured</div>
                )}
              </div>
            </Button>
          )
        })}
      </div>
      
      {currentProvider && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
          <strong>Active:</strong> {providers.find(p => p.id === currentProvider)?.name}
          {currentProvider === 'gemini' && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              (Supports images & videos)
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProviderSelector
