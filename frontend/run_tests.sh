#!/bin/bash
set -e

cd "$(dirname "$0")"

npm install -q jest @types/jest

npx jest --coverage

chmod +x frontend/run_tests.sh