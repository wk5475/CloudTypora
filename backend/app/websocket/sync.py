from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/ws/documents/{document_id}")
async def document_sync(websocket: WebSocket, document_id: str) -> None:
    await websocket.accept()
    try:
        while True:
            message = await websocket.receive_text()
            await websocket.send_json(
                {
                    "type": "ack",
                    "documentId": document_id,
                    "received": len(message),
                }
            )
    except WebSocketDisconnect:
        return
