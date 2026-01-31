const { execSync } = require('child_process');
const OPENCLAW_CMD = 'node /app/dist/index.js';

console.log("🔎 Checking for pending device requests...");

try {
  // list devices in JSON format
  // We use try-catch for the execution in case the command fails or returns non-JSON
  let output;
  try {
      output = execSync(`${OPENCLAW_CMD} devices list --json`, { encoding: 'utf8' });
  } catch (err) {
      console.error("❌ Error executing devices list command.");
      console.error(err.message);
      process.exit(1);
  }

  let data;
  try {
      // Find the start of JSON (in case there is log noise before it)
      const jsonStart = output.indexOf('{');
      if (jsonStart === -1) throw new Error("No JSON found in output");
      data = JSON.parse(output.substring(jsonStart));
  } catch (err) {
      console.error("❌ Error parsing JSON output.");
      console.error("Output was:", output);
      process.exit(1);
  }

  const pending = data.pending || [];

  if (pending.length === 0) {
    console.log("✅ No pending requests found.");
    process.exit(0);
  }

  for (const req of pending) {
    // Try multiple keys for the ID as per the bash script example
    const id = req.requestId || req.id || req.request;
    if (id) {
        console.log(`🚀 Approving request: ${id}`);
        try {
            execSync(`${OPENCLAW_CMD} devices approve "${id}"`, { stdio: 'inherit' });
        } catch (err) {
            console.error(`❌ Failed to approve request ${id}`);
        }
    }
  }
} catch (mainErr) {
  console.error("❌ Unexpected error:", mainErr);
  process.exit(1);
}
