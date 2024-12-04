#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Python virtual environment...${NC}"

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}Created virtual environment${NC}"
else
    echo -e "${YELLOW}Virtual environment already exists${NC}"
fi

# Activate venv
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Upgrade pip
echo -e "${YELLOW}Upgrading pip...${NC}"
python -m pip install --upgrade pip

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt

# Make scripts executable
chmod +x backend/scripts/lint.sh

echo -e "${GREEN}Setup complete! Virtual environment is activated.${NC}"
echo -e "${YELLOW}Run these commands to work with the codebase:${NC}"
echo -e "  ${GREEN}source venv/bin/activate${NC}    # Activate the virtual environment"
echo -e "  ${GREEN}(venv) deactivate${NC}           # Deactivate when you're done"
echo -e "  ${GREEN}./backend/scripts/lint.sh${NC}   # Run all code quality checks"
echo -e "\nOr run individual checks:"
echo -e "  ${GREEN}yapf -i -r backend${NC}          # Format code"
echo -e "  ${GREEN}isort backend${NC}               # Sort imports"
echo -e "  ${GREEN}flake8 backend${NC}              # Check style"
echo -e "  ${GREEN}mypy backend${NC}                # Check types"
echo -e "  ${GREEN}pylint backend${NC}              # Check code quality"
