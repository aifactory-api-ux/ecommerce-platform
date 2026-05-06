#!/bin/bash
set -e

cd "$(dirname "$0")"

npm install -q vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom
npx vitest run --coverage