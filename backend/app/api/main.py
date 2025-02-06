from fastapi import APIRouter

from app.core.config import settings
from app.api.routes import chat

api_router = APIRouter(prefix='/chat')
api_router.include_router(chat.router)
