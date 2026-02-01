FROM ghcr.io/openclaw/openclaw:latest

USER root

# Copy scripts and configs into image
COPY scripts/ /app/scripts/
COPY configs/ /app/configs/

# Make scripts executable
RUN chmod +x /app/scripts/bootstrap.sh
RUN npm i -g opencode-ai

# Switch back to non-root user
USER node

# Expose the gateway port as requested
EXPOSE 18789

# Use bootstrap as entrypoint to ensure patches are applied
ENTRYPOINT ["/app/scripts/bootstrap.sh"]

# Default command (matches original image)
CMD ["node", "dist/index.js", "gateway"]
