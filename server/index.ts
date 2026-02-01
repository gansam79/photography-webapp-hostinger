import type { Express } from "express";
import { createServer as createServerImpl } from "./index.js";

export function createServer(): Express {
  return createServerImpl();
}

export default createServer;
