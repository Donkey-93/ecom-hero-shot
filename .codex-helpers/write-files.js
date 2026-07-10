const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const [rel, content] of Object.entries(data)) {
  const full = path.resolve(process.argv[3], rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log("wrote", rel);
}