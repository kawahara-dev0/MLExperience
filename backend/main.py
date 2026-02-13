###############################################################################
# Purpose: ML Experience System Main
# Summary: FastAPI application entry point
###############################################################################
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.api import router

# Load environment variables
load_dotenv(".env")
load_dotenv("../.env")

# FastAPI application
app = FastAPI(
    title="ML Experience System API",
    description="Backend API for a web system that lets you experience the ML workflow",
    version="2.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Register router
app.include_router(router)


# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
