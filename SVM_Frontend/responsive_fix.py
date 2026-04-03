import os
import re

directory = r"e:\DTS\Visitor_Managment\Smart_Visitor_Management\SVM_Frontend\src"

patterns = [
    # Replace rigid paddings
    (r'(?<!md:)\bp-10\b(?! md:p-10)', 'p-4 md:p-10'),
    (r'(?<!md:)\bp-12\b(?! md:p-12)', 'p-6 md:p-12'),
    
    # Replace rigid gaps
    (r'(?<!md:)\bspace-y-12\b(?! md:space-y-12)', 'space-y-6 md:space-y-12'),
    (r'(?<!md:)\bspace-y-8\b(?! md:space-y-8)', 'space-y-4 md:space-y-8'),
    
    # Replace static large widths
    (r'\bw-\[(500|600|700|800|900|1000|1200)px\]\b', r'w-full max-w-[\1px]'),
    
    # Replace rigid grids
    (r'(?<!md:)(?<!sm:)(?<!lg:)\bgrid-cols-([2-6])\b', r'grid-cols-1 md:grid-cols-\1'),
]

modified_files = 0
for root, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith(".js") or filename.endswith(".jsx"):
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                original_content = content
                for pat, repl in patterns:
                    content = re.sub(pat, repl, content)

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    modified_files += 1
                    print(f"Updated: {filepath}")
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"Total files updated: {modified_files}")
