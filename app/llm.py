from app.config import load_settings
from groq import Groq
from ollama import chat
from app.constants import LLM_LOCAL, LLM_GROQ


def test_groq_llm(prompt: str) -> str:
    settings = load_settings()
    client = Groq(
        api_key=settings.groq_api_key.get_secret_value(),
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                'role': 'user',
                'content': prompt,
            }
        ],
        model=LLM_GROQ.LLAMA3370BVERSATILE,
    )

    return (
        str(chat_completion.choices[0].message.content)
        if len(chat_completion.choices) > 0
        else 'response not found'
    )


def test_local_llm(prompt: str) -> str:
    response = chat(
        model=LLM_LOCAL.QWEN317B,
        messages=[{'role': 'user', 'content': prompt}],
    )
    print('structure of response:', response)
    print('gotten response:', response.message.content)
    return (
        response.message.content
        if response.message.content is not None
        else 'response not found'
    )
