import express from "express";

declare global {
  namespace Express {
    interface Request {
      token?: Record<string, any>;
    }
  }
}
