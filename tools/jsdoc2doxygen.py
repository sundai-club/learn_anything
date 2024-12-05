#!/usr/bin/env python3
"""
Convert JSDoc/TSDoc comments to Doxygen format.
This script reads JavaScript/TypeScript files and converts JSDoc/TSDoc comments to Doxygen format.
"""

import sys
import re

def convert_jsdoc_to_doxygen(content):
    """Convert JSDoc/TSDoc comments to Doxygen format."""
    # Convert TypeScript interfaces to Doxygen classes
    content = re.sub(
        r'interface\s+(\w+)(\s*\{)',
        r'/** @interface \1 */\ninterface \1\2',
        content
    )
    
    # Convert TypeScript types to Doxygen typedefs
    content = re.sub(
        r'type\s+(\w+)\s*=\s*',
        r'/** @typedef \1 */\ntype \1 = ',
        content
    )
    
    # Convert @param {type} name - description
    content = re.sub(
        r'@param\s+{([^}]+)}\s+(\w+)\s+-?\s*([^\n]+)',
        r'@param[\1] \2 \3',
        content
    )
    
    # Convert @returns {type} description
    content = re.sub(
        r'@returns?\s+{([^}]+)}\s+([^\n]+)',
        r'@return[\1] \2',
        content
    )
    
    # Convert @type {type}
    content = re.sub(
        r'@type\s+{([^}]+)}',
        r'@type[\1]',
        content
    )
    
    # Convert React component props interface
    content = re.sub(
        r'interface\s+(\w+Props)\s*\{([^}]+)\}',
        lambda m: f'/** @interface {m.group(1)}\n * React component props\n */{m.group(0)}',
        content
    )
    
    # Convert React functional components
    content = re.sub(
        r'(export\s+)?function\s+(\w+)\s*\(\s*{\s*([^}]+)\s*}\s*:\s*(\w+Props)\s*\)',
        lambda m: f'/** @function {m.group(2)}\n * @param {{m.group(4)}} props Component props\n */\n{m.group(0)}',
        content
    )
    
    # Convert hooks
    content = re.sub(
        r'(const|let|var)\s+(\w+)\s*=\s*use(\w+)',
        lambda m: f'/** @hook use{m.group(3)} */\n{m.group(0)}',
        content
    )
    
    # Convert event handlers
    content = re.sub(
        r'(const|let|var)\s+(\w+)\s*=\s*\(\s*([^)]*)\s*\)\s*=>\s*{',
        lambda m: f'/** @callback {m.group(2)}\n * @param {{{m.group(3)}}} Event parameters\n */\n{m.group(0)}',
        content
    )
    
    # Convert useEffect dependencies
    content = re.sub(
        r'useEffect\(\s*\(\s*\)\s*=>\s*{([^}]+)}\s*,\s*\[(.*?)\]\s*\)',
        lambda m: f'/** @effect\n * Dependencies: [{m.group(2)}]\n */\n{m.group(0)}',
        content
    )
    
    # Convert class/interface descriptions
    content = re.sub(
        r'/\*\*\s*\n\s*\*\s*([^\n]+)\n\s*\*\s*@(class|interface)',
        r'/** @\2 \1',
        content
    )
    
    # Convert @throws
    content = re.sub(
        r'@throws\s+{([^}]+)}\s+([^\n]+)',
        r'@throws[\1] \2',
        content
    )
    
    return content

def main():
    """Main function to process input file."""
    if len(sys.argv) < 2:
        print("Usage: jsdoc2doxygen.py <input_file>", file=sys.stderr)
        sys.exit(1)
        
    input_file = sys.argv[1]
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        converted = convert_jsdoc_to_doxygen(content)
        print(converted)
        
    except Exception as e:
        print(f"Error processing {input_file}: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
