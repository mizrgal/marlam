const express = require('express');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

function gitInfo() {
  try {
    return {
      commit: execSync('git rev-parse --short HEAD').toString().trim(),
      commitMessage: execSync('git log -1 --pretty=%s').toString().trim(),
      commitDate: execSync('git log -1 --pretty=%cI').toString().trim(),
    };
  } catch {
    return { commit: 'unknown', commitMessage: 'unknown', commitDate: 'unknown' };
  }
}

const deployedAt = new Date().toISOString();
const build = gitInfo();

app.use(express.static(path.join(__dirname), { extensions: ['html'] }));

app.get('/healthz', (req, res) => res.send('ok'));

app.get('/version', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ ...build, serverStartedAt: deployedAt });
});

app.listen(PORT, () => {
  console.log(`מ.ר.ל.מ site listening on port ${PORT}`);
});
