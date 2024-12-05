# learn_anything

This codebase is designed to help a user learn about a topic by first learning the necessary foundational knowledge.

## Backend
### Setup Instructions for Python

#### Prerequisites
- Python 3.10 or higher
- pip (Python package installer)
- OpenAI api key

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/learn_anything.git
cd learn_anything
```

2. Save OpenAI api key to an env file
```bash
echo "OPENAI_API_KEY={key_here}" > .env
```

3. Create and activate a virtual environment:
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# To deactivate the virtual environment when you're done:
(venv) deactivate
```

4. Install required packages:
```bash
(venv) pip install -r requirements.txt
```

5. Run the python scripts (example: graph creation script):
```bash
(venv) ./backend/src/graph_creation.py [--optional-arguments]
```

### Code Quality and Development

#### Development Scripts

The project includes several helpful scripts in `backend/scripts/`:

```bash
# Setup development environment
./backend/scripts/setup.sh

# Format Python files
./backend/scripts/format_python.sh

# Run all code quality checks
./backend/scripts/lint.sh
```

#### Code Style and Quality Checks

The project uses several tools to maintain code quality:
- YAPF: Code formatting with custom style rules
- isort: Import sorting
- Flake8: Style guide enforcement
- MyPy: Static type checking
- Pylint: Code quality metrics (minimum score: 8.0)

All these checks can be run using the lint script:
```bash
./backend/scripts/lint.sh
```

Or run individual checks:
```bash
# Format code with YAPF
yapf -i -r backend

# Sort imports
isort backend

# Run style checks
flake8 backend

# Run type checks
mypy backend

# Check code quality score
pylint backend
```

#### GitHub Actions Workflow

The repository includes a GitHub Actions workflow that runs on Ubuntu and macOS. The workflow:
- Creates a Python virtual environment
- Installs all dependencies
- Runs all code quality checks with detailed output
- Only fails if critical checks fail (e.g., pylint score < 8.0)
- Provides helpful messages about fixing issues

The workflow runs on:
- Pull requests to main branch
- Pushes to main branch

To test GitHub Actions locally, you can use [act](https://github.com/nektos/act):

```bash
# Install act (on macOS)
brew install act

# Run the workflow locally
act -j code-quality


```

## Documentation

### Doxygen Documentation

Documentation is automatically generated using Doxygen for both Python and JavaScript/TypeScript code.

#### Viewing Documentation
1. Generate documentation locally:
   ```bash
   doxygen Doxyfile
   ```

2. Open in your browser:
   ```bash
   # On macOS
   open docs/html/index.html
   # On Linux
   xdg-open docs/html/index.html
   ```
