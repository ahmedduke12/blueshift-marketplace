import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import serverless from "serverless-http";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

const app = express();

// Configure body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API - handle all paths
app.use(
    createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

const serverlessHandler = serverless(app);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const result = await serverlessHandler(event, context);
    return result as any;
};
