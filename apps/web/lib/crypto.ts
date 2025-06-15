import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Generate a secure random secret key for JWT
export function generateJWTSecret(): string {
    return crypto.randomBytes(64).toString('hex');
}

// Generate API keys for local development
export function generateAPIKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Generate encryption key for sensitive data
export function generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Get or create JWT secret
export function getJWTSecret(): string {
    if (process.env.JWT_SECRET) {
        return process.env.JWT_SECRET;
    }
    
    // Generate a new secret for development
    const secret = generateJWTSecret();
    console.log('🔑 Generated JWT Secret (add to .env):', secret);
    return secret;
}

// JWT token creation
export function createJWTToken(payload: { userId: string; email: string }): string {
    const secret = getJWTSecret();
    return jwt.sign(payload, secret, { 
        expiresIn: '7d',
        issuer: 'xtask-app',
        audience: 'xtask-users'
    });
}

// JWT token verification - supports both old and new token formats
export function verifyJWTToken(token: string): { userId: string; email: string } | null {
    try {
        const secret = getJWTSecret();

        // Try new format first
        try {
            const decoded = jwt.verify(token, secret, {
                issuer: 'xtask-app',
                audience: 'xtask-users'
            }) as any;

            return {
                userId: decoded.userId,
                email: decoded.email
            };
        } catch (newFormatError) {
            // Fallback to old format for compatibility
            const decoded = jwt.verify(token, secret) as any;

            return {
                userId: decoded.id, // Old format uses 'id' instead of 'userId'
                email: decoded.email || '' // Old format might not have email
            };
        }
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

// Encrypt sensitive data
export function encryptData(data: string): string {
    const key = process.env.ENCRYPTION_KEY || generateEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex').slice(0, 32), iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}

// Decrypt sensitive data
export function decryptData(encryptedData: string): string {
    const key = process.env.ENCRYPTION_KEY || generateEncryptionKey();
    const [ivHex, encrypted] = encryptedData.split(':');

    if (!ivHex || !encrypted) {
        throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const keyBuffer = Buffer.from(key, 'hex').slice(0, 32);

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// Generate secure session ID
export function generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Hash password with salt
export function hashPassword(password: string): string {
    if (!password) {
        throw new Error('Password is required');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return salt + ':' + hash;
}

// Verify password
export function verifyPassword(password: string, hashedPassword: string): boolean {
    if (!password || !hashedPassword) {
        return false;
    }

    const [salt, hash] = hashedPassword.split(':');
    if (!salt || !hash) {
        return false;
    }

    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}
