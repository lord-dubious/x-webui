import express from "express";
import userRouter from "./routes/auth";
import cors from "cors"
import { PORT } from "./config";
import cookieParser from "cookie-parser"
import session from "express-session";
import { SESSION_SECRET } from "./config";
import passport from "./configuration/passportConfig";
import twitterRouter from "./routes/twitter";
import contentRouter from "./routes/content";
import postRouter from "./routes/posts";
import mediaRouter from "./routes/media";
import aiRouter from "./routes/ai";
import "./utils/scheduler"
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
      origin: ["http://localhost:4000", "https://dev.tweetly.in", "https://app.tweetly.in"],
      credentials: true,
    })
  );

app.use(session({
    secret:SESSION_SECRET as string,
    resave:false,
    saveUninitialized:true,
}))

app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/user/path",twitterRouter );
app.use("/api/v1/user/content",contentRouter );
app.use("/api/v1/user/posts",postRouter );
app.use("/api/v1/user/media",mediaRouter );
app.use("/api/v1/user/ai",aiRouter );

// Start Next.js server internally on port 3000
const nextAppPath = path.join(__dirname, "../../web");
let nextProcess: any = null;

const startNextServer = () => {
    console.log("🚀 Starting Next.js server...");
    nextProcess = spawn('pnpm', ['run', 'start'], {
        cwd: nextAppPath,
        stdio: 'pipe',
        env: { ...process.env, PORT: '3000' }
    });

    nextProcess.stdout.on('data', (data: Buffer) => {
        console.log(`[Next.js] ${data.toString()}`);
    });

    nextProcess.stderr.on('data', (data: Buffer) => {
        console.error(`[Next.js Error] ${data.toString()}`);
    });

    nextProcess.on('close', (code: number) => {
        console.log(`[Next.js] Process exited with code ${code}`);
    });
};

// Proxy all non-API requests to Next.js server
const nextProxy = createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying for hot reload
    onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        if (!res.headersSent) {
            res.status(500).send(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Tweetly - Loading</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                    </head>
                    <body>
                        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                            <div style="text-align: center;">
                                <h1>Tweetly</h1>
                                <p>Starting up... Please wait a moment and refresh.</p>
                                <p>If this persists, make sure to build the application first:</p>
                                <code>pnpm run build:combined</code>
                            </div>
                        </div>
                    </body>
                </html>
            `);
        }
    }
});

// Use proxy for all non-API routes
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    nextProxy(req, res, next);
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: "API route not found" });
});

// Start Next.js server and then start Express
startNextServer();

// Give Next.js a moment to start before starting Express
setTimeout(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Combined server running on port ${PORT}`);
        console.log(`📱 Web app available at http://localhost:${PORT}`);
        console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/v1/`);
        console.log(`⚡ Next.js server running internally on port 3000`);
    });
}, 2000);

// Cleanup on exit
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    if (nextProcess) {
        nextProcess.kill();
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down servers...');
    if (nextProcess) {
        nextProcess.kill();
    }
    process.exit(0);
});