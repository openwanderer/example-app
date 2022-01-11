FROM node:17-bullseye-slim

# Create user and folders
RUN groupadd --gid 10001 -r openwanderer \
    && useradd --uid 10001 -d /home/openwanderer -m -r -s /bin/false -g openwanderer openwanderer \
    && mkdir -p /opt/openwanderer /data/openwanderer/tmp /data/openwanderer/panos


# Add local files to image
WORKDIR /opt/openwanderer

COPY --chown=openwanderer:openwanderer ./public ./public
COPY --chown=openwanderer:openwanderer ./*.sql ./
COPY --chown=openwanderer:openwanderer ./*.json ./
COPY --chown=openwanderer:openwanderer ./*.js ./
COPY --chown=openwanderer:openwanderer ./*.mjs ./
COPY --chown=openwanderer:openwanderer ./*.md ./
COPY --chown=openwanderer:openwanderer ./LICENSE ./
COPY --chown=openwanderer:openwanderer ./.env ./.env


# Build OpenWanderer
RUN npm install
RUN npm run build


# Expose service
USER openwanderer
EXPOSE 3000
