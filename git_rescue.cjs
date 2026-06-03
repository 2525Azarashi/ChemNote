const { execSync } = require('child_process');
try {
  const result = execSync('git log -p public/化学基礎_フローチャート集_v2.html', { encoding: 'utf8' });
  console.log("Git log found!", result.substring(0, 1000));
} catch (e) {
  console.error("No git log or error:", e.message);
}
