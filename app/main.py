from app.llm import test_llm
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict

app = FastAPI()

# cors
origins = [
    'http://localhost:5173',
    'http://localhost:8000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)


class Message(BaseModel):
    text: str

    model_config = ConfigDict(
        extra='ignore',
        from_attributes=True,
        json_schema_extra={'example': {'text': 'Hello, how are you?'}},
    )


@app.post('/llm')
def process_message(message: Message) -> JSONResponse:
    print(f'Received message: {message.text}')
    # return JSONResponse(
    #     status_code=status.HTTP_200_OK,
    #     content="**Hola!**\n\nIt's nice to meet you. Is there something I can help you with or would you like to chat for a bit? I'm here to assist you in any way I can. ¿En qué puedo ayudarte? (How can I help you?)",
    # )
    return JSONResponse(status_code=status.HTTP_200_OK, content=test_llm(message.text))


app.frontend(path='/', directory='web/dist')
