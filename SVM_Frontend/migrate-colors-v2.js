const fs = require('fs');
const path = require('path');

const mappings = [
    // 1. Unify Legacy Tailwind Classes to Logic Names
    { pattern: /\btext-mas-red\b/gi, replacement: 'text-primary' },
    { pattern: /\bbg-mas-red\b/gi, replacement: 'bg-primary' },
    { pattern: /\bborder-mas-red\b/gi, replacement: 'border-primary' },
    { pattern: /\bdecoration-mas-red\b/gi, replacement: 'decoration-primary' },
    { pattern: /\bfrom-mas-red\b/gi, replacement: 'from-primary' },
    { pattern: /\bto-mas-red\b/gi, replacement: 'to-primary' },
    { pattern: /\bvia-mas-red\b/gi, replacement: 'via-primary' },
    { pattern: /\boultine-mas-red\b/gi, replacement: 'outline-primary' },
    { pattern: /\bring-mas-red\b/gi, replacement: 'ring-primary' },
    { pattern: /\bshadow-mas-red\b/gi, replacement: 'shadow-primary' },

    { pattern: /\btext-mas-black\b/gi, replacement: 'text-secondary' },
    { pattern: /\bbg-mas-black\b/gi, replacement: 'bg-secondary' },
    { pattern: /\bborder-mas-black\b/gi, replacement: 'border-secondary' },

    { pattern: /\btext-mas-dark-900\b/gi, replacement: 'text-background' },
    { pattern: /\bbg-mas-dark-900\b/gi, replacement: 'bg-background' },
    { pattern: /\bbg-mas-dark-800\b/gi, replacement: 'bg-background-paper' },
    { pattern: /\bbg-mas-dark-700\b/gi, replacement: 'bg-background-alt' },

    // 2. Aggregate Remaining Hex Codes
    { pattern: /#C8102E/gi, replacement: 'var(--color-primary)' },
    { pattern: /#A60D26/gi, replacement: 'var(--color-primary-hover)' },
    { pattern: /#B0060E/gi, replacement: 'var(--color-primary-hover)' }, // Close enough
    
    { pattern: /#0A0A0B/gi, replacement: 'var(--color-bg-default)' },
    { pattern: /#020202/gi, replacement: 'var(--color-bg-default)' },
    { pattern: /#050505/gi, replacement: 'var(--color-bg-default)' },
    { pattern: /#121214/gi, replacement: 'var(--color-bg-paper)' },
    { pattern: /#121212/gi, replacement: 'var(--color-bg-paper)' },
    { pattern: /#1A1A1C/gi, replacement: 'var(--color-bg-alt)' },
    
    { pattern: /#FFFFFF/gi, replacement: 'var(--color-text-primary)' },
    { pattern: /#D1D1D1/gi, replacement: 'var(--color-text-secondary)' },
    { pattern: /#888888/gi, replacement: 'var(--color-text-dim)' },

    // 3. Catch Common Arbitrary Tailwind
    { pattern: /bg-\[#020202\]/gi, replacement: 'bg-background' },
    { pattern: /bg-\[#050505\]/gi, replacement: 'bg-background' },
    { pattern: /bg-\[#0A0A0B\]/gi, replacement: 'bg-background' },
    { pattern: /bg-\[#121214\]/gi, replacement: 'bg-background-paper' },
    { pattern: /bg-\[#121212\]/gi, replacement: 'bg-background-paper' },
    { pattern: /bg-\[#1A1A1C\]/gi, replacement: 'bg-background-alt' },
];

function processFile(filePath) {
    // Skip index.css and tailwind.config.js to avoid breaking definitions
    const fileName = path.basename(filePath);
    if (fileName === 'index.css' || fileName === 'tailwind.config.js' || fileName === 'themeColors.js') return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    mappings.forEach(m => {
        content = content.replace(m.pattern, m.replacement);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            processFile(fullPath);
        }
    });
}

const srcDir = path.join(__dirname, 'src');
console.log('Starting aggresive migration...');
walk(srcDir);
console.log('Migration complete.');
