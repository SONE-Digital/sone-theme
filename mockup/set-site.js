const fs = require('fs');
const site = process.argv[2] || 'lexjet';

// Validate site options
const validSites = [
  'lexjet', 'digiprint', 'hp', 'kodak',
  'lexjet-sandbox', 'digiprint-sandbox', 'hp-sandbox', 'kodak-sandbox'
];

if (!validSites.includes(site)) {
  console.error(`❌ Invalid site: ${site}`);
  console.log(`Valid options: ${validSites.join(', ')}`);
  process.exit(1);
}

fs.writeFileSync('.site-config', site);
console.log(`Site set to: ${site}`);