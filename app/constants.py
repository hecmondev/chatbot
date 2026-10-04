from enum import StrEnum


class LLM_LOCAL(StrEnum):
    QWEN38 = 'qwen3.8'
    QWEN317B = 'qwen3:1.7b'
    LLAMA323B = 'llama3.2:3b'
    GEMMA22B = 'gemma2:2b'
    PHI4MINILATEST = 'phi4-mini:latest'


class LLM_GROQ(StrEnum):
    LLAMA3370BVERSATILE = 'llama-3.3-70b-versatile'
