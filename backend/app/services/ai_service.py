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
        self._ollama_client = None

    def _get_openai(self):
        if self._openai_client is None:
            from openai import AsyncOpenAI
            from app.config import settings
            self._openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        return self._openai_client

    def _get_ollama(self):
        if self._ollama_client is None:
            from openai import AsyncOpenAI
            from app.config import settings
            # Ollama exposes an OpenAI-compatible API; api_key is required but ignored.
            self._ollama_client = AsyncOpenAI(
                base_url=settings.OLLAMA_BASE_URL,
                api_key="ollama",
            )
        return self._ollama_client

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

    @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=1, max=5))
    async def complete_ollama(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        max_tokens: int = 4096,
        temperature: float = 0.7,
        response_format: Optional[Dict] = None,
    ) -> str:
        from app.config import settings
        client = self._get_ollama()
        kwargs = {
            "model": model or settings.OLLAMA_MODEL,
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

    async def _dispatch(
        self,
        provider: str,
        messages: List[Dict[str, str]],
        system: Optional[str],
        **kwargs,
    ) -> str:
        if provider == "anthropic":
            # Anthropic Messages API has no response_format param.
            anthropic_kwargs = {k: v for k, v in kwargs.items() if k != "response_format"}
            return await self.complete_anthropic(messages, system=system, **anthropic_kwargs)
        # openai and ollama share the OpenAI chat schema (system goes in messages)
        msgs = [{"role": "system", "content": system}, *messages] if system else messages
        if provider == "ollama":
            return await self.complete_ollama(msgs, **kwargs)
        return await self.complete_openai(msgs, **kwargs)

    async def complete(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        provider: Optional[str] = None,
        **kwargs,
    ) -> str:
        from app.config import settings

        primary = provider or settings.AI_PROVIDER or "anthropic"
        # Try the primary provider, then any distinct fallbacks that are configured.
        candidates = [primary]
        for fb in ("ollama", "openai", "anthropic"):
            if fb not in candidates:
                candidates.append(fb)

        last_error: Optional[Exception] = None
        for prov in candidates:
            if not self._is_configured(prov, settings):
                continue
            try:
                return await self._dispatch(prov, messages, system, **kwargs)
            except Exception as e:  # noqa: BLE001 — try the next provider
                last_error = e
                logger.error(f"AI completion failed with {prov}: {e}")

        raise AICompletionError(
            f"No AI provider could complete the request (tried: {primary}). "
            "Verify your AI_PROVIDER setting and that the provider is reachable "
            "(e.g. Ollama running, or a valid API key)."
        ) from last_error

    @staticmethod
    def _is_configured(provider: str, settings) -> bool:
        if provider == "anthropic":
            return bool(settings.ANTHROPIC_API_KEY)
        if provider == "openai":
            return bool(settings.OPENAI_API_KEY)
        if provider == "ollama":
            return bool(settings.OLLAMA_BASE_URL)
        return False


ai_service = AIService()
