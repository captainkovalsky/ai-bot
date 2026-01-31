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
*   **Persistence**: Configuration and workspaces are persisted in Docker volumes (`openclaw_config` and `openclaw_workspace`).
