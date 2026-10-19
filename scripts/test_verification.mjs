import fs from 'fs';

console.log('=== V13.0 PRODUCTION BUILD VERIFICATION ===');
console.log('dist/index.html size:', fs.statSync('dist/index.html').size, 'bytes');
console.log('dist/admin.html size:', fs.statSync('dist/admin.html').size, 'bytes');
console.log('dist/standalone.html size:', fs.statSync('dist/standalone.html').size, 'bytes');

const adminContent = fs.readFileSync('dist/admin.html', 'utf-8');
console.log('Portfolio Updates in admin:', adminContent.includes('Portfolio Updates'));
console.log('Skills Management in admin:', adminContent.includes('Skills Management'));
console.log('Projects Management in admin:', adminContent.includes('Projects Management'));
console.log('Media Library in admin:', adminContent.includes('Media Library'));
console.log('Zero index.html links in admin:', !adminContent.includes('index.html'));

const indexContent = fs.readFileSync('dist/index.html', 'utf-8');
console.log('Has /admin redirect in index:', indexContent.includes("window.location.href = '/admin'"));
console.log('Zero admin.html links in index:', !indexContent.includes('window.location.href = \'admin.html\''));

console.log('vercel.json exists:', fs.existsSync('vercel.json'));
if (fs.existsSync('vercel.json')) {
  console.log('vercel.json content:', fs.readFileSync('vercel.json', 'utf-8').trim());
}
