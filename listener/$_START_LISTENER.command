#!/bin/bash
cd "$(dirname "$0")"
git pull
npm i
node listener.js