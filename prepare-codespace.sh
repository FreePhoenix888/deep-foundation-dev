#!/bin/bash

{ npm i -g npm; npm ci; npm run codespaces-init; docker pull deepf/deeplinks:main; docker run -v $(pwd)/packages/deeplinks:/deeplinks --rm --name links --entrypoint "sh" deepf/deeplinks:main -c "cp -r /snapshots/* /deeplinks/snapshots/ && chown -R 33333:33333 /deeplinks/snapshots/"; (cd packages/deeplinks && npm run snapshot:last); npm install -g concurrently; npm run gitpod-engine; npm cache clean --force; };
# npm run packages