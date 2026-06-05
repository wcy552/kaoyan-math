// 考研数学网站 - 自动部署脚本
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GH_URL = 'https://github.com/cli/cli/releases/download/v2.93.0/gh_2.93.0_windows_amd64.zip';
const TMP = process.env.TEMP || '/tmp';

console.log('[1/4] 下载 GitHub CLI...');
const zipFile = path.join(TMP, 'gh.zip');
const file = fs.createWriteStream(zipFile);

https.get(GH_URL, (response) => {
  const total = parseInt(response.headers['content-length'] || '0', 10);
  let downloaded = 0;

  response.on('data', (chunk) => {
    downloaded += chunk.length;
    if (total) process.stdout.write(`\r  下载中... ${Math.round(downloaded / total * 100)}%`);
  });

  response.pipe(file);

  file.on('finish', () => {
    file.close();
    console.log('\n   下载完成!');

    console.log('[2/4] 解压...');
    // Use PowerShell to extract
    try {
      execSync(`powershell -Command "Expand-Archive -Path '${zipFile}' -DestinationPath '${TMP}\\gh_extract' -Force"`, { stdio: 'inherit' });
    } catch(e) {
      // Try tar
      try {
        execSync(`tar -xf "${zipFile}" -C "${TMP}/gh_extract"`, { stdio: 'inherit' });
      } catch(e2) {
        console.log('解压失败，请手动安装 GitHub CLI: https://cli.github.com');
        process.exit(1);
      }
    }

    console.log('[3/4] 配置 git...');
    execSync('git config user.email "sakura@kaoyan-math.dev"', { cwd: __dirname, stdio: 'inherit' });
    execSync('git config user.name "Sakura"', { cwd: __dirname, stdio: 'inherit' });
    execSync('git add .', { cwd: __dirname, stdio: 'inherit' });
    try { execSync('git commit -m "v1.0"', { cwd: __dirname, stdio: 'inherit' }); } catch(e) {}

    console.log('[4/4] 创建 GitHub 仓库并推送...');
    const ghBin = path.join(TMP, 'gh_extract', 'gh_2.93.0_windows_amd64', 'bin', 'gh.exe');

    // Check if logged in
    try {
      execSync(`"${ghBin}" auth status`, { stdio: 'pipe' });
    } catch(e) {
      console.log('   需要登录 GitHub，浏览器将自动打开...');
      execSync(`"${ghBin}" auth login --web --hostname github.com`, { stdio: 'inherit' });
    }

    // Create repo and push
    execSync(`"${ghBin}" repo create kaoyan-math --public --source="${__dirname}" --remote=origin --push`, { stdio: 'inherit' });

    console.log('\n====== 发布成功！======');
    console.log('1. 打开 https://github.com/YOUR_USERNAME/kaoyan-math');
    console.log('2. Settings → Pages → Source: main branch → Save');
    console.log('3. 网站地址: https://YOUR_USERNAME.github.io/kaoyan-math/');
  });
}).on('error', (err) => {
  console.log('下载失败:', err.message);
  console.log('请手动安装 GitHub CLI: https://cli.github.com');
  process.exit(1);
});
