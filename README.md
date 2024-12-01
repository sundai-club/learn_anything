# learn_anything

This codebase is designed to help a user learn about a topic by first learning the necessary foundational knowledge. 

## Setup Instructions for Python

### Prerequisites
- Python 3.10 or higher
- pip (Python package installer)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/learn_anything.git
cd learn_anything
```

2. Create and activate a virtual environment:
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

3. Install required packages:
```bash
(venv) pip install -r requirements.txt
```

4. Run the python scripts (example: graph creation script):
```bash
(venv) ./backend/src/graph_creation.py [--optional-arguments]
```
