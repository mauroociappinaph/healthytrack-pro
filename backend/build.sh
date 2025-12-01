#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci --include=dev

echo "Building application..."
./node_modules/.bin/nest build

echo "Build completed successfully!"
