const fs = require('fs');
const path = require('path');

function restoreHeadings(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      restoreHeadings(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const orig = content;

      // Make h1, h2, h3 bold again if they were changed to font-medium
      content = content.replace(/(<h[123][^>]*?className="[^"]*?)font-medium([^"]*?")/g, '$1font-bold$2');

      if(content !== orig) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

try {
  restoreHeadings('e:/DTS/Visitor_Managment/Smart_Visitor_Management/SVM_Frontend/src/components');
  restoreHeadings('e:/DTS/Visitor_Managment/Smart_Visitor_Management/SVM_Frontend/src/layout');
  console.log('Successfully restored heading font weights.');
} catch(e) {
  console.error('Error:', e);
}
