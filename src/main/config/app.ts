import express from "express";
import setupMidllerares from "./middlewares";

const app = express();
setupMidllerares(app);
export default app;
