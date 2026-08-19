const fs = require('fs');
const files = ['index.html', 'electricity.html', 'plumbing.html', 'ac.html', 'general-maintenance.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace og:image content
    content = content.replace(/<meta property="og:image" content="[^"]*">/g, '<meta property="og:image" content="https://www.bluekey.sa/assets/images/image-1783124183305.png">');
    
    fs.writeFileSync(file, content, 'utf-8');
});
console.log("Updated og:image in all files");
