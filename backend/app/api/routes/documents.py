from fastapi import APIRouter

from app.schemas.common import ApiResponse
from app.schemas.document import DocumentRead

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("", response_model=ApiResponse[list[DocumentRead]])
async def list_documents() -> ApiResponse[list[DocumentRead]]:
    documents = [
        DocumentRead(
            id="welcome",
            title="CloudTypora 最小可用版本",
            content="# CloudTypora\n\nMarkdown 优先。",
            content_snapshot="# CloudTypora\n\nMarkdown 优先。",
        )
    ]
    return ApiResponse(data=documents)
