@echo off
echo ===== 考研数学学习网站 - 一键发布 =====
echo.

:: 1. 配置 git
echo [1/3] 配置 Git...
git config user.email "sakura@kaoyan-math.dev"
git config user.name "Sakura"

:: 2. 提交所有文件
echo [2/3] 提交代码...
cd /d C:\Users\34216\Desktop\vruhbvfuhre
git add .gitignore css/style.css js/main.js index.html
git commit -m "考研数学学习网站 v1.0" 2>nul

:: 3. 尝试用 gh 创建仓库并推送
echo [3/3] 创建 GitHub 仓库并推送...
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo gh 未安装，正在安装...
    winget install GitHub.cli --accept-package-agreements --silent
    echo 请关闭此窗口，重新打开后再运行一次。
    pause
    exit
)

gh auth status >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo 需要登录 GitHub。浏览器会自动打开...
    gh auth login --web --hostname github.com
)

gh repo create kaoyan-math --public --source=. --remote=origin --push

if %errorlevel% equ 0 (
    echo.
    echo ===== 成功！=====
    echo 网站地址：https://你的用户名.github.io/kaoyan-math/
    echo 然后去仓库 Settings → Pages 开启 GitHub Pages
) else (
    echo.
    echo 推送失败，请检查网络或手动操作。
)

pause
