import dotenv from "dotenv";
dotenv.config();

import {prismaClient} from "@repo/db/client"


export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const prisma = prismaClient;
export const SESSION_SECRET = process.env.SESSION_SECRET ;
export const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
export const BASE_URL =  process.env.BASE_URL
export const MAIN_URL = process.env.MAIN_URL


export const UPLOADTHING_SECRET = process.env.UPLOADTHING_SECRET;
export const UPLOADTHING_APP_ID = process.env.UPLOADTHING_APP_ID;


export const NODE_ENV = process.env.NODE_ENV