const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.resolve(__dirname, '../configs');
const OUTPUT_FILE = path.resolve(__dirname, '../openclaw.json'); // Default output to root of project? Or to mapped volume?
// Better: Default to printing to stdout or a specific file arg.
// Let's output to the mapped volume location: /home/node/.openclaw/openclaw.json (inside container)
// Or relative to the script if running on host.
// Let's standardise on: Writes to <project_root>/final_config.json, which user must allow or move?
// NO, easier: User runs this, it reads `configs/*.json`, merges, and writes to `openclaw.json` at the root (or wherever env var says).

// Let's assume the script handles the logic and writes to standard output, which can be piped, OR directly to a file.
// Helper function to deep merge objects
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

// Read files
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
// Decide where to write.
// If running in container, we might want to write to /home/node/.openclaw/openclaw.json
// But that path is dynamic.
// Let's write to "openclaw.json" in the current working directory of the caller, or allow an argument.
const targetPath = process.argv[2] || 'openclaw.json';

console.log(`💾 Writing merged config to: ${targetPath}`);
fs.writeFileSync(targetPath, outputJSON);
console.log("✅ Configuration build complete.");
