from app.schemas.document import DocumentRead


def create_document(user_id: str, title: str) -> DocumentRead:
    return DocumentRead(
        id=f"{user_id}:{title}",
        title=title,
        content="",
        content_snapshot="",
    )
