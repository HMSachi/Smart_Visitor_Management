const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'src');

const replacements = [
    { regex: /\s+italic/g, replacement: '' },
    { regex: /^italic\s+/g, replacement: '' },
    { regex: /'italic'/g, replacement: "'normal'" },
    { regex: /"italic"/g, replacement: '"normal"' },
    { regex: /fontStyle:\s*'italic'/g, replacement: "fontStyle: 'normal'" },
    { regex: /fontStyle:\s*"italic"/g, replacement: 'fontStyle: "normal"' },
];

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
            processFile(filePath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ regex, replacement }) => {
        if (regex.test(content)) {
            content = content.replace(regex, replacement);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

console.log('Starting global italic font normalization...');
walkDir(rootDir);
console.log('Finished global italic font normalization.');
