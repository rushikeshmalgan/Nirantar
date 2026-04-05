import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replacements = [
  { regex: /var\(--dark-brown\)/g, replacement: 'var(--bg-primary)' },
  { regex: /var\(--ivory\)/g, replacement: 'var(--text-primary)' },
  { regex: /rgba\(44,24,16,0\.95\)/g, replacement: 'var(--nav-bg)' },
  { regex: /rgba\(250,243,224,0\.75\)/g, replacement: 'var(--text-primary)' },
  { regex: /rgba\(250,243,224,0\.7\)/g, replacement: 'var(--text-primary)' },
  { regex: /rgba\(250,243,224,0\.65\)/g, replacement: 'var(--text-muted)' },
  { regex: /rgba\(250,243,224,0\.6\)/g, replacement: 'var(--text-muted)' },
  { regex: /rgba\(250,243,224,0\.55\)/g, replacement: 'var(--text-dim)' },
  { regex: /rgba\(250,243,224,0\.5\)/g, replacement: 'var(--text-dim)' },
  { regex: /rgba\(250,243,224,0\.4\)/g, replacement: 'var(--text-dim)' },
  { regex: /rgba\(250,243,224,0\.35\)/g, replacement: 'var(--text-dim)' },
  { regex: /rgba\(250,243,224,0\.3\)/g, replacement: 'var(--text-dim)' },
  { regex: /rgba\(44,24,16,0\.8\)/g, replacement: 'var(--bg-card)' },
  { regex: /rgba\(44,24,16,0\.7\)/g, replacement: 'var(--bg-card)' },
  { regex: /rgba\(44,24,16,0\.6\)/g, replacement: 'var(--bg-overlay)' },
  { regex: /rgba\(0,0,0,0\.4\)/g, replacement: 'var(--bg-overlay)' },
  { regex: /rgba\(0,0,0,0\.2\)/g, replacement: 'var(--bg-overlay)' },
  { regex: /rgba\(255,255,255,0\.05\)/g, replacement: 'var(--input-bg)' },
  { regex: /rgba\(255,255,255,0\.03\)/g, replacement: 'var(--input-bg)' },
  { regex: /rgba\(212,160,23,0\.22\)/g, replacement: 'var(--border-color)' },
  { regex: /rgba\(212,160,23,0\.2\)/g, replacement: 'var(--border-color)' },
  { regex: /rgba\(212,160,23,0\.18\)/g, replacement: 'var(--border-color)' },
  { regex: /rgba\(212,160,23,0\.15\)/g, replacement: 'var(--border-color)' },
  { regex: /rgba\(212,160,23,0\.1\)/g, replacement: 'var(--border-color)' },
];

const cssFiles = [
  'src/pages/Home.css',
  'src/pages/Register.css',
  'src/pages/Login.css'
];

cssFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  content = content.replace(/:root \{(.|\n)*?\}/g, (match) => {
    return "/* root variables moved to index.css */";
  });
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
});
