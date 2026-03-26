const fs = require('fs');
const path = require('path');

const directories = [
  'src/layout',
  'src/components'
];

// Regex to selectively match typography classes inside class strings only.
// This is safer to apply locally to className strings.
const typoRegexes = [
    // Sizes
    /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g,
    /text-\[[a-zA-Z0-9.,pxemrem%]+\]/g,
    
    // Weights
    /font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g,
    
    // Families
    /font-(ans|display|sans|serif|mono)\b/g,
    
    // Tracking
    /tracking-(tighter|tight|normal|wide|wider|widest)\b/g,
    /tracking-\[[a-zA-Z0-9.,pxemrem%]+\]/g,
    
    // Leading
    /leading-(none|tight|snug|normal|relaxed|loose)\b/g,
    /leading-\[[a-zA-Z0-9.,pxemrem%]+\]/g,
    
    // Italics
    /\bitalic\b/g,
    /\bnon-italic\b/g
];

function cleanClasses(classNameStr) {
    let cleaned = classNameStr;
    typoRegexes.forEach(regex => {
        cleaned = cleaned.replace(regex, ' ');
    });
    // Remove multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Match className="..." and className={`...`} and process only those strings
    content = content.replace(/className="([^"]+)"/g, (match, classes) => {
        const cleaned = cleanClasses(classes);
        return `className="${cleaned}"`;
    });

    content = content.replace(/className=\{`([^`]+)`\}/g, (match, classes) => {
        // Handle conditional logic like `flex ${isActive ? 'bg-red' : 'bg-blue'}` gracefully
        // We will just replace valid class names in the string.
        let cleaned = cleanClasses(classes);
        return `className={\`${cleaned}\`}`;
    });

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Cleaned:', filePath);
    }
}

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

directories.forEach(dir => processDirectory(dir));
console.log('Typography cleanup completed.');
