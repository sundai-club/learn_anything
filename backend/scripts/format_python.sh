#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to the backend directory
cd "$(dirname "$0")/.."

echo -e "${YELLOW}Formatting Python code in backend directory...${NC}"

# Get list of Python files tracked by git
PYTHON_FILES=$(git ls-files "*.py")

if [ -z "$PYTHON_FILES" ]; then
    echo -e "${YELLOW}No Python files found${NC}"
    exit 0
fi

# Run yapf
echo -e "${YELLOW}Running yapf...${NC}"
yapf -i -r .

# Run isort
echo -e "${YELLOW}Running isort...${NC}"
isort .

echo -e "${GREEN}✓ Formatting complete${NC}"
