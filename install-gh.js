const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TMP = process.env.TEMP || 'C:/Users/34216/AppData/Local/Temp';
const zipFile = path.join(TMP, 'gh.zip');
const extractDir = path.join(TMP, 'gh_extract');

console.log('Downloading GitHub CLI...');
const file = fs.createWriteStream(zipFile);

https.get('https://github.com/cli/cli/releases/download/v2.93.0/gh_2.93.0_windows_amd64.zip', (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Extracting...');
    if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true });
    execSync(`powershell -Command "Expand-Archive -Path '${zipFile}' -DestinationPath '${extractDir}' -Force"`, { stdio: 'pipe' });
    const ghBin = path.join(extractDir, 'gh_2.93.0_windows_amd64', 'bin', 'gh.exe');
    console.log('GH installed at:', ghBin);
    console.log('GH_EXISTS=' + fs.existsSync(ghBin));
  });
}).on('error', (e) => { console.log('FAILED:', e.message); });
