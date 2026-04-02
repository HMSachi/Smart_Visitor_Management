const fs = require('fs');
const path = require('path');

const mappings = [
    { pattern: /#C8102E/gi, replacement: 'var(--color-primary)' },
    { pattern: /#A60D26/gi, replacement: 'var(--color-primary-hover)' },
    { pattern: /#0A0A0B/gi, replacement: 'var(--color-bg-default)' },
    { pattern: /#121214/gi, replacement: 'var(--color-bg-paper)' },
    { pattern: /#1A1A1C/gi, replacement: 'var(--color-bg-alt)' },
    { pattern: /#FFFFFF/gi, replacement: 'var(--color-text-primary)' },
    { pattern: /#D1D1D1/gi, replacement: 'var(--color-text-secondary)' },
    { pattern: /#888888/gi, replacement: 'var(--color-text-dim)' },
    
    // Tailwind Class Patterns
    { pattern: /bg-\[#0A0A0B\]/gi, replacement: 'bg-background' },
    { pattern: /bg-\[#121214\]/gi, replacement: 'bg-background-paper' },
    { pattern: /bg-\[#1A1A1C\]/gi, replacement: 'bg-background-alt' },
    { pattern: /text-\[#C8102E\]/gi, replacement: 'text-primary' },
    { pattern: /border-\[#C8102E\]/gi, replacement: 'border-primary' }
];

function processFile(filePath) {
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
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
            processFile(fullPath);
        }
    });
}

const srcDir = path.join(__dirname, 'src');
console.log('Starting migration...');
walk(srcDir);
console.log('Migration complete.');
