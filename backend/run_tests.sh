#!/bin/bash
set -e

cd "$(dirname "$0")"

pip install -q pytest pytest-cov pytest-asyncio httpx

python -m pytest tests/ --tb=short -q --cov=. --cov-report=term-missing

chmod +x backend/run_tests.sh