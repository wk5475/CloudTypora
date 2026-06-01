from datetime import UTC, datetime

from pydantic import BaseModel, Field


class DocumentRead(BaseModel):
    id: str
    title: str
    content: str
    content_snapshot: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
