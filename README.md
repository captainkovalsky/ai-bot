# OpenClaw Gateway Deployment

This repository contains the Docker Compose configuration for deploying the OpenClaw Gateway. It is configured to run with the official Docker image (`ghcr.io/openclaw/openclaw:latest`).

## Setup

1.  **Environment Variables**:
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and fill in your secrets:
    *   `OPENCLAW_GATEWAY_TOKEN`: Generate with `openssl rand -hex 32`
    *   `GOG_KEYRING_PASSWORD`: A strong password for the keyring
    *   `TELEGRAM_BOT_TOKEN`: Your Telegram Bot API token (from @BotFather)

2.  **Run with Docker**:
    ```bash
    docker compose up -d
    ```

## Configuration Notes

*   **Bind Address**: The gateway is configured to bind to `lan` (private IP) by default, which works best for Docker networking and Coolify deployments.
*   **Startup Flags**: Includes `--allow-unconfigured` to ensure the container starts smoothly on the first run.
*   **Persistence**: Configuration and workspaces are persisted in the host directory `/ai-agent/.openclaw` (mapped to `/home/node/.openclaw`).

## Troubleshooting

### "Permission denied" on openclaw-approve

If you encounter permission errors running `openclaw-approve` aliases inside the container, use the direct Node.js command instead:

```bash
cd /app
node dist/index.js pairing approve <channel> <code>
# Example:
# node dist/index.js pairing approve telegram 123456
```
