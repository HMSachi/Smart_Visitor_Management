const fs = require('fs');
const path = require('path');

const directory = 'e:\\DTS\\Visitor_Managment\\Smart_Visitor_Management\\SVM_Frontend\\src';

const patterns = [
    { regex: /(?<!md:)\bp-10\b(?! md:p-10)/g, repl: 'p-4 md:p-10' },
    { regex: /(?<!md:)\bp-12\b(?! md:p-12)/g, repl: 'p-6 md:p-12' },
    { regex: /(?<!md:)\bspace-y-12\b(?! md:space-y-12)/g, repl: 'space-y-6 md:space-y-12' },
    { regex: /(?<!md:)\bspace-y-8\b(?! md:space-y-8)/g, repl: 'space-y-4 md:space-y-8' },
    { regex: /\bw-\[(500|600|700|800|900|1000|1200)px\]\b/g, repl: 'w-full max-w-[$1px]' },
    { regex: /(?<!md:)(?<!sm:)(?<!lg:)\bgrid-cols-([2-6])\b/g, repl: 'grid-cols-1 md:grid-cols-$1' }
];

let modifiedFiles = 0;

function walkSync(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walkSync(filepath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            try {
                let content = fs.readFileSync(filepath, 'utf8');
                let originalContent = content;
                
                for (let {regex, repl} of patterns) {
                    content = content.replace(regex, repl);
                }
                
                if (content !== originalContent) {
                    fs.writeFileSync(filepath, content, 'utf8');
                    modifiedFiles++;
                    console.log(`Updated: ${filepath}`);
                }
            } catch (err) {
                console.error(`Error processing ${filepath}: ${err}`);
            }
        }
    }
}

walkSync(directory);
console.log(`Total files updated: ${modifiedFiles}`);
