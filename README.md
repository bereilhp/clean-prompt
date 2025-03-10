# AI Proxy with PII Redaction

This is a simple Express-based proxy that sanitizes user input by redacting personally identifiable information (PII) before sending it to an AI model via the Ollama API.

## PII Redaction

The `redactPII` function removes the following:

- SSN: `123-45-6789` → `[REDACTED SSN]`
- Phone: `123-456-7890` → `[REDACTED PHONE]`
- Email: `user@example.com` → `[REDACTED EMAIL]`

## License

MIT License
