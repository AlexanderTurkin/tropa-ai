from fastapi import APIRouter, Request
from starlette.responses import HTMLResponse
from app.api import templates

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def frontend(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})
