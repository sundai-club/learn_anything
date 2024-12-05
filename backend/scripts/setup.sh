#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install system dependencies
echo -e "${YELLOW}Checking system dependencies...${NC}"

# Check and install Docker
if ! command_exists docker; then
    echo -e "${YELLOW}Installing Docker...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install --cask docker
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y docker.io
        sudo systemctl start docker
        sudo systemctl enable docker
    fi
fi

# Check Python version
if command_exists python3; then
    python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    if (( $(echo "$python_version < 3.10" | bc -l) )); then
        needs_python=true
    fi
else
    needs_python=true
fi

if [ "$needs_python" = true ]; then
    echo -e "${YELLOW}Installing Python 3.10...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install python@3.10
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo add-apt-repository ppa:deadsnakes/ppa
        sudo apt-get update
        sudo apt-get install -y python3.10
    fi
fi

# Check and install PostgreSQL
if ! command_exists psql; then
    echo -e "${YELLOW}Installing PostgreSQL...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install postgresql@14
        brew services start postgresql@14
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
    fi
fi

# Check and install Doxygen
if ! command_exists doxygen; then
    echo -e "${YELLOW}Installing Doxygen...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install doxygen
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y doxygen
    fi
fi

# Check and install Graphviz
if ! command_exists dot; then
    echo -e "${YELLOW}Installing Graphviz...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install graphviz
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y graphviz
    fi
fi

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

# Deactivate venv
echo -e "${YELLOW}Deactivating virtual environment...${NC}"
deactivate

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}To work with the codebase:${NC}"
echo -e "  ${GREEN}source venv/bin/activate${NC}    # Activate the virtual environment"
echo -e "  ${GREEN}deactivate${NC}                  # Deactivate when you're done"
