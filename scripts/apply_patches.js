import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_DIR = path.resolve(__dirname, '../configs');

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

console.log(`🔍 Scanning for config patches in: ${CONFIG_DIR}`);

if (!fs.existsSync(CONFIG_DIR)) {
    console.error(`❌ Config directory not found: ${CONFIG_DIR}`);
    process.exit(1);
}

const files = fs.readdirSync(CONFIG_DIR).filter(file => file.endsWith('.json')).sort();
let finalConfig = {};

if (files.length === 0) {
    console.log("⚠️  No patch files found.");
}

files.forEach(file => {
    console.log(`📦 Applying patch: ${file}`);
    const filePath = path.join(CONFIG_DIR, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const patch = JSON.parse(content);

        // Extract metadata if exists for logging
        if (patch._meta) {
            console.log(`   description: ${patch._meta.description || 'N/A'}`);
            console.log(`   applied: ${patch._meta.date || 'N/A'}`);
            delete patch._meta; // Remove metadata from merge
        }

        finalConfig = mergeDeep(finalConfig, patch);
    } catch (err) {
        console.error(`❌ Error parsing ${file}: ${err.message}`);
        process.exit(1);
    }
});

// Output
const outputJSON = JSON.stringify(finalConfig, null, 2);
const targetPath = process.argv[2] || 'openclaw.json';

console.log(`💾 Writing merged config to: ${targetPath}`);

// Ensure target directory exists
const targetDir = path.dirname(targetPath);
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(targetPath, outputJSON);
console.log("✅ Configuration build complete.");
