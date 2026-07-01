import logging
from typing import Optional, Dict, Any, List
from tenacity import retry, stop_after_attempt, wait_exponential
import httpx

logger = logging.getLogger(__name__)


class AICompletionError(Exception):
    """Raised when all configured AI providers fail to complete a request."""


class AIService:
    def __init__(self):
        self._openai_client = None
        self._anthropic_client = None

    def _get_openai(self):
        if self._openai_client is None:
            from openai import AsyncOpenAI
            from app.config import settings
            self._openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        return self._openai_client

    def _get_anthropic(self):
        if self._anthropic_client is None:
            import anthropic
            from app.config import settings
            self._anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        return self._anthropic_client

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def complete_openai(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        max_tokens: int = 4096,
        temperature: float = 0.7,
        response_format: Optional[Dict] = None,
    ) -> str:
        from app.config import settings
        client = self._get_openai()
        kwargs = {
            "model": model or settings.OPENAI_MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        if response_format:
            kwargs["response_format"] = response_format
        response = await client.chat.completions.create(**kwargs)
        return response.choices[0].message.content

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def complete_anthropic(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        max_tokens: int = 4096,
    ) -> str:
        from app.config import settings
        client = self._get_anthropic()
        kwargs = {
            "model": model or settings.ANTHROPIC_MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
        }
        if system:
            kwargs["system"] = system
        response = await client.messages.create(**kwargs)
        return response.content[0].text

    async def complete(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        provider: str = "anthropic",
        **kwargs,
    ) -> str:
        try:
            if provider == "openai":
                if system:
                    messages = [{"role": "system", "content": system}] + messages
                return await self.complete_openai(messages, **kwargs)
            else:
                return await self.complete_anthropic(messages, system=system, **kwargs)
        except Exception as e:
            logger.error(f"AI completion failed with {provider}: {e}")
            if provider == "anthropic":
                logger.info("Falling back to OpenAI")
                try:
                    if system:
                        messages = [{"role": "system", "content": system}] + messages
                    return await self.complete_openai(messages, **kwargs)
                except Exception as fallback_error:
                    logger.error(f"AI completion fallback to OpenAI failed: {fallback_error}")
                    raise AICompletionError(
                        "AI providers are unavailable. Check that a valid ANTHROPIC_API_KEY "
                        "or a funded OPENAI_API_KEY is configured."
                    ) from fallback_error
            raise AICompletionError(
                f"AI provider '{provider}' is unavailable. Check the configured API key and model."
            ) from e


ai_service = AIService()
