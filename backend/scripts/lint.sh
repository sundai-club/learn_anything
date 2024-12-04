#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to the project root directory (two levels up from scripts)
cd "$(dirname "$0")/../.."

# Minimum pylint score required
MIN_SCORE="8.0"

echo -e "${YELLOW}Running code quality checks...${NC}"

# Function to run a check
run_check() {
    local cmd=$1
    local name=$2
    echo -e "${YELLOW}Running $name...${NC}"
    if $cmd; then
        echo -e "${GREEN}✓ $name passed${NC}"
        return 0
    else
        echo -e "${RED}✗ $name failed${NC}"
        return 1
    fi
}

# Store exit codes
errors=0

# Find tracked Python files in backend
PYTHON_FILES=$(cd backend && git ls-files "*.py")
PYTHON_FILES=$(echo "$PYTHON_FILES" | sed 's/^/backend\//')

if [ -z "$PYTHON_FILES" ]; then
    echo -e "${YELLOW}No Python files found${NC}"
    exit 0
fi

# Run all checks
run_check "yapf --diff --recursive backend" "YAPF" || ((errors++))
run_check "isort --check-only $PYTHON_FILES" "isort" || ((errors++))
run_check "flake8 $PYTHON_FILES" "Flake8" || ((errors++))
run_check "mypy $PYTHON_FILES" "MyPy" || ((errors++))

# Run pylint with score check
echo -e "${YELLOW}Running Pylint...${NC}"
PYLINT_OUTPUT=$(pylint $PYTHON_FILES)
PYLINT_STATUS=$?
SCORE=$(echo "$PYLINT_OUTPUT" | grep "Your code has been rated at" | cut -d' ' -f7 | cut -d'/' -f1)

if [ -z "$SCORE" ]; then
    echo -e "${RED}✗ Pylint failed to run or no score found${NC}"
    ((errors++))
else
    if python3 -c "exit(0 if float('${SCORE:-0}') >= float('${MIN_SCORE}') else 1)"; then
        echo -e "${GREEN}✓ Pylint passed with score $SCORE (minimum: $MIN_SCORE)${NC}"
    else
        echo -e "${RED}✗ Pylint score $SCORE is below minimum $MIN_SCORE${NC}"
        ((errors++))
    fi
fi

echo
echo -e "If checks fail, you can auto format python files using:"
echo -e "${YELLOW}./backend/scripts/format_python.sh${NC}"
echo

# Final status
if [ $errors -eq 0 ]; then
    echo -e "\n${GREEN}All checks passed! 🎉${NC}"
    exit 0
else
    echo -e "\n${RED}$errors check(s) failed 😢${NC}"
    exit 1
fi
