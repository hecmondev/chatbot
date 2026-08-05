from functools import lru_cache
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    def __init__(self) -> None:
        super().__init__()

    # keys
    groq_api_key: SecretStr

    # set up path
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')


@lru_cache
def load_settings() -> Settings:
    return Settings()
