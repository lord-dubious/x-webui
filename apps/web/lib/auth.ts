import { NextRequest, NextResponse } from 'next/server';
import { prismaClient as prisma } from '@repo/db/client';
import { verifyJWTToken, createJWTToken, hashPassword, verifyPassword } from './crypto';

export async function getUserFromRequest(request: NextRequest) {
    try {
        // Get JWT token from Authorization header or cookie
        // Support both old and new cookie names for compatibility
        const authHeader = request.headers.get('authorization');
        const cookieToken = request.cookies.get('authToken')?.value ||
                           request.cookies.get('auth_token')?.value;

        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else if (cookieToken) {
            token = cookieToken;
        }

        // For development/testing, also check headers
        const userIdHeader = request.headers.get('x-user-id');
        const emailHeader = request.headers.get('x-user-email');

        let user = null;

        // First try JWT token validation
        if (token) {
            const decoded = verifyJWTToken(token);
            if (decoded) {
                user = await prisma.user.findUnique({
                    where: { id: decoded.userId }
                });
            }
        }

        // Fallback for development/testing only - check headers
        if (!user && (userIdHeader || emailHeader) && process.env.NODE_ENV !== 'production') {
            if (emailHeader) {
                user = await prisma.user.findUnique({
                    where: { email: emailHeader }
                });
            } else if (userIdHeader) {
                user = await prisma.user.findUnique({
                    where: { id: userIdHeader }
                });
            }
        }

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        console.error('Auth error:', error);
        throw new Error('Unauthorized');
    }
}

// Login user and return JWT token
export async function loginUser(email: string, password: string): Promise<{ user: any; token: string } | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            return null;
        }

        const isValidPassword = verifyPassword(password, user.password);
        if (!isValidPassword) {
            return null;
        }

        const token = createJWTToken({
            userId: user.id,
            email: user.email
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture
            },
            token
        };
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

// Register new user
export async function registerUser(email: string, password: string, name?: string): Promise<{ user: any; token: string } | null> {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                authProvider: 'email_password'
            }
        });

        const token = createJWTToken({
            userId: user.id,
            email: user.email
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture
            },
            token
        };
    } catch (error) {
        console.error('Registration error:', error);
        return null;
    }
}

// Create auth response with cookie
export function createAuthResponse(data: any, token: string): NextResponse {
    const response = NextResponse.json(data);

    // Set HTTP-only cookie for security
    // Use consistent cookie name with old system
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.xtask.app' : undefined,
        maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
}
