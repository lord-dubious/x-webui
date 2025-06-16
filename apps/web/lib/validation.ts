import { URL } from 'url';

// Validate URL to prevent SSRF attacks
export function validateUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        
        // Only allow HTTPS for external APIs
        if (parsedUrl.protocol !== 'https:') {
            return false;
        }
        
        // Block private/internal IP ranges
        const hostname = parsedUrl.hostname;
        
        // Block localhost and loopback
        if (hostname === 'localhost' || 
            hostname === '127.0.0.1' || 
            hostname.startsWith('127.') ||
            hostname === '::1') {
            return false;
        }
        
        // Block private IP ranges
        if (hostname.match(/^10\./) ||
            hostname.match(/^192\.168\./) ||
            hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
            hostname.match(/^169\.254\./) || // Link-local
            hostname.match(/^fc00:/) || // IPv6 private
            hostname.match(/^fe80:/)) { // IPv6 link-local
            return false;
        }
        
        // Allow only specific trusted domains for AI APIs
        const allowedDomains = [
            'api.openai.com',
            'generativelanguage.googleapis.com',
            'api.anthropic.com',
            'api.cohere.ai'
        ];
        
        // Check if it's a trusted domain or subdomain
        const isAllowed = allowedDomains.some(domain => 
            hostname === domain || hostname.endsWith('.' + domain)
        );
        
        return isAllowed;
    } catch (error) {
        return false;
    }
}

// Validate API key format
export function validateApiKey(apiKey: string, provider: 'openai' | 'gemini'): boolean {
    if (!apiKey || typeof apiKey !== 'string') {
        return false;
    }
    
    switch (provider) {
        case 'openai':
            // OpenAI keys start with sk- and are 51 characters
            return apiKey.startsWith('sk-') && apiKey.length >= 20;
        case 'gemini':
            // Gemini keys are typically 39 characters
            return apiKey.length >= 20 && apiKey.length <= 100;
        default:
            return false;
    }
}

// Validate model name
export function validateModelName(model: string): boolean {
    if (!model || typeof model !== 'string') {
        return false;
    }
    
    // Only allow alphanumeric, hyphens, underscores, and dots
    return /^[a-zA-Z0-9\-_.]+$/.test(model) && model.length <= 100;
}

// Sanitize user input
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }
    
    // Remove potentially dangerous characters
    return input.replace(/[<>\"'&]/g, '').trim();
}
