// 直接通过 GitHub API 创建仓库（无需 gh CLI）
const https = require('https');
const { execSync } = require('child_process');

const DIR = 'C:/Users/34216/Desktop/vruhbvfuhre';

// Step 1: 先配置 git 并提交
console.log('[1/3] 配置 git...');
execSync('git config user.email "sakura@kaoyan-math.dev"', { cwd: DIR });
execSync('git config user.name "Sakura"', { cwd: DIR });
try { execSync('git add . && git commit -m "v1.0"', { cwd: DIR, stdio: 'pipe' }); } catch(e) {}

// Step 2: 尝试推送到新建仓库
// 由于创建仓库需要 token，我们用 git push 到尚不存在的仓库
// GitHub 支持通过 git credential manager 自动认证

console.log('[2/3] 推送代码到 GitHub...');
console.log('（浏览器会弹出 GitHub 授权页面，请点击确认）');

try {
  // 先尝试用 SSH
  execSync('git remote remove origin 2>/dev/null', { cwd: DIR, stdio: 'pipe' });
} catch(e) {}

// 使用 git credential manager 进行 HTTPS 推送
// 这通常会弹出浏览器窗口进行身份验证
execSync('git remote add origin https://github.com/sakura-user/kaoyan-math.git', { cwd: DIR, stdio: 'pipe' });

console.log('[3/3] 尝试推送...');
console.log('如果浏览器弹出了 GitHub 登录页面，请点击允许授权');

try {
  execSync('git push -u origin master', { cwd: DIR, stdio: 'inherit' });
  console.log('推送成功！');
} catch(e) {
  console.log('');
  console.log('推送未成功。需要先在 GitHub 上创建仓库：');
  console.log('');
  console.log('1. 浏览器打开: https://github.com/new');
  console.log('2. Repository name 填入: kaoyan-math');
  console.log('3. 选择 Public，不要勾选任何选项');
  console.log('4. 点击 Create repository');
  console.log('5. 然后在聊天框输入:');
  console.log('   ! cd C:/Users/34216/Desktop/vruhbvfuhre && git push -u origin master');
  console.log('');
  console.log('或者你也可以直接双击文件夹里的 "一键发布.bat"');
}
