from app.config import load_settings
from groq import Groq


def test_llm(prompt: str) -> str:
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
        model='llama-3.3-70b-versatile',
    )

    return (
        str(chat_completion.choices[0].message.content)
        if len(chat_completion.choices) > 0
        else 'response not found'
    )
