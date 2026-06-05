@echo off
echo ===== 更新网站 =====
cd /d C:\Users\34216\Desktop\vruhbvfuhre

echo 正在部署到 Netlify...
npx --yes netlify-cli deploy --prod --dir=. --site=admirable-hummingbird-c6d380 2>&1

if %errorlevel% neq 0 (
  echo.
  echo ===== 自动部署失败，换手动方式 =====
  echo 浏览器会自动打开 tiiny.host
  echo 把桌面上的 kaoyan-math-v2.zip 拖进去即可
  start https://tiiny.host
)

pause
