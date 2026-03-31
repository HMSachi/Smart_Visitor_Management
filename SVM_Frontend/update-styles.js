const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const orig = content;

      // Replace font-black and font-bold with font-medium
      content = content.replace(/\bfont-black\b/g, 'font-medium');
      content = content.replace(/\bfont-bold\b/g, 'font-medium');

      // Lighten colors and opacities
      content = content.replace(new RegExp('text-mas-text-dim/20', 'g'), 'text-gray-300/80');
      content = content.replace(new RegExp('text-mas-text-dim/40', 'g'), 'text-gray-300/80');
      content = content.replace(new RegExp('text-mas-text-dim/60', 'g'), 'text-gray-300/90');
      content = content.replace(new RegExp('text-mas-text-dim', 'g'), 'text-gray-300');
      
      content = content.replace(new RegExp('text-white/20', 'g'), 'text-white/70');
      content = content.replace(new RegExp('text-white/40', 'g'), 'text-white/80');
      content = content.replace(new RegExp('text-white/50', 'g'), 'text-white/90');
      content = content.replace(new RegExp('text-white/60', 'g'), 'text-white/90');

      content = content.replace(new RegExp('opacity-20', 'g'), 'opacity-70');
      content = content.replace(new RegExp('opacity-40', 'g'), 'opacity-80');
      content = content.replace(new RegExp('opacity-60', 'g'), 'opacity-90');

      if(content !== orig) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

try {
  processDir('e:/DTS/Visitor_Managment/Smart_Visitor_Management/SVM_Frontend/src/components');
  processDir('e:/DTS/Visitor_Managment/Smart_Visitor_Management/SVM_Frontend/src/layout');
  console.log('Successfully updated fonts and colors across components and layouts.');
} catch(e) {
  console.error('Error:', e);
}
