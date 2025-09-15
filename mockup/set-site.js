const fs = require('fs');
const site = process.argv[2] || 'lexjet';
fs.writeFileSync('.site-config', site);
console.log(`Site set to: ${site}`);