import express from "express";
import setupMidllerares from "./middlewares";
import setupRoutes from "./Routes";

const app = express();
setupMidllerares(app);
setupRoutes(app);
export default app;
