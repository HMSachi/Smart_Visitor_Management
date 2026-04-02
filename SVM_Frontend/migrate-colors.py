import os
import re

# Color Mappings (Hex to Tailwind Alias or CSS Variable)
mappings = {
    r'#C8102E': 'var(--color-primary)', # Original Hex
    r'#A60D26': 'var(--color-primary-hover)',
    r'#0A0A0B': 'var(--color-bg-default)',
    r'#121214': 'var(--color-bg-paper)',
    r'#1A1A1C': 'var(--color-bg-alt)',
    r'#FFFFFF': 'var(--color-text-primary)',
    r'#D1D1D1': 'var(--color-text-secondary)',
    r'#888888': 'var(--color-text-dim)',
    
    # Common Tailwind Aliases (for bulk replacement in className strings)
    r'bg-\[#0A0A0B\]': 'bg-background',
    r'bg-\[#121214\]': 'bg-background-paper',
    r'bg-\[#1A1A1C\]': 'bg-background-alt',
    r'text-\[#C8102E\]': 'text-primary',
    r'border-\[#C8102E\]': 'border-primary',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for pattern, replacement in mappings.items():
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    src_dir = os.path.join(os.getcwd(), 'src')
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.css')):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
