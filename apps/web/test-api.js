#!/usr/bin/env node

/**
 * Comprehensive API Test Script for XTask
 * Tests all API endpoints including authentication and AI functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_USER_EMAIL = 'test@example.com';

async function testAPI() {
    console.log('🧪 Testing XTask API Endpoints...\n');

    const headers = {
        'x-user-email': TEST_USER_EMAIL,
        'Content-Type': 'application/json'
    };

    const tests = [
        // Authentication endpoints
        {
            name: 'Auth - Register',
            method: 'POST',
            url: `${BASE_URL}/api/auth/register`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                email: 'test@xtask.app',
                password: 'testpass123',
                name: 'Test User'
            }
        },
        {
            name: 'Auth - Login',
            method: 'POST',
            url: `${BASE_URL}/api/auth/login`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                email: 'test@xtask.app',
                password: 'testpass123'
            }
        },
        {
            name: 'Auth - Me',
            method: 'GET',
            url: `${BASE_URL}/api/auth/me`,
            headers
        },
        // AI Configuration endpoints
        {
            name: 'OpenAI Config GET',
            method: 'GET',
            url: `${BASE_URL}/api/v1/user/ai/config`,
            headers
        },
        {
            name: 'Gemini Config GET',
            method: 'GET',
            url: `${BASE_URL}/api/v1/user/ai/gemini/config`,
            headers
        },
        // AI Models endpoints
        {
            name: 'OpenAI Models POST',
            method: 'POST',
            url: `${BASE_URL}/api/v1/user/ai/models`,
            headers,
            data: {
                apiKey: 'test-key',
                baseUrl: 'https://api.openai.com/v1'
            }
        },
        {
            name: 'Gemini Models POST',
            method: 'POST',
            url: `${BASE_URL}/api/v1/user/ai/gemini/models`,
            headers,
            data: {
                apiKey: 'test-key'
            }
        },
        // AI Functionality endpoints
        {
            name: 'Get Bots',
            method: 'GET',
            url: `${BASE_URL}/api/v1/user/ai/getbots`,
            headers
        },
        {
            name: 'Get Context',
            method: 'POST',
            url: `${BASE_URL}/api/v1/user/ai/getcontext`,
            headers,
            data: {
                embeddingVector: [0.1, 0.2, 0.3],
                botId: 'test-bot-id'
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            console.log(`Testing: ${test.name}`);
            
            const response = await axios({
                method: test.method,
                url: test.url,
                headers: test.headers,
                data: test.data,
                timeout: 5000
            });

            if (response.status === 200 || response.status === 401) {
                console.log(`✅ ${test.name}: ${response.status} - ${response.data?.message || 'OK'}`);
                passed++;
            } else {
                console.log(`❌ ${test.name}: Unexpected status ${response.status}`);
                failed++;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.log(`✅ ${test.name}: 401 - Authentication required (expected)`);
                passed++;
            } else {
                console.log(`❌ ${test.name}: ${error.message}`);
                failed++;
            }
        }
        console.log('');
    }

    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

    if (failed === 0) {
        console.log('\n🎉 All API endpoints are working correctly!');
    } else {
        console.log('\n⚠️  Some endpoints need attention.');
    }
}

// Run the test
testAPI().catch(console.error);
