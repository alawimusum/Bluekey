const fs = require('fs');
const files = ['index.html', 'electricity.html', 'plumbing.html', 'ac.html', 'general-maintenance.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    const phoneBtn = `\n                    <a href="tel:+966533359350" class="btn" style="margin-inline-end: 10px; background: transparent; border: 1px solid currentColor; color: inherit; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">\n                        <i class="fa-solid fa-phone"></i> <span dir="ltr">+966 53 335 9350</span>\n                    </a>`;
    
    if (!content.includes('fa-phone"></i> <span dir="ltr">+966')) {
        content = content.replace('<a href="#booking" class="btn btn-primary">', phoneBtn + '\n                    <a href="#booking" class="btn btn-primary">');
    }
    
    fs.writeFileSync(file, content, 'utf-8');
});
console.log("Added phone to header in all files");
