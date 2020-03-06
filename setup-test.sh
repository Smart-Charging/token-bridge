#!/usr/bin/env bash
cd /home/jelastic/atomic-swap
npx forever stop oracle/dist/server.js
rm -f package-lock.json
git pull
npm i
npm run build
LOG_FILE="/home/jelastic/atomic-swap/nodejs.log" ENV=test PASSWORD="titi-tata" PORT=8080 forever start oracle/dist/server.js
