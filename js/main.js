/* ========== 考研数学学习网 - 交互脚本 ========== */

document.addEventListener('DOMContentLoaded', function () {
  initTabs();
  initMobileMenu();
  initSubjectCards();
  initSearch();
  initVideoPlaceholders();
  initDarkMode();
  initDailyProblem();
  initProgress();
  initCheckin();
  initCountdown();
  initBackToTop();
});

/* ========== Tab 切换 ========== */
function initTabs() {
  var tabs = document.querySelectorAll('.nav-tab');
  var contents = document.querySelectorAll('.tab-content');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      contents.forEach(function (c) { c.classList.remove('active'); });
      var el = document.getElementById(target);
      if (el) el.classList.add('active');

      var navTabs = document.querySelector('.nav-tabs');
      if (navTabs) navTabs.classList.remove('open');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ========== 移动端菜单 ========== */
function initMobileMenu() {
  var btn = document.querySelector('.mobile-menu-btn');
  var nav = document.querySelector('.nav-tabs');
  if (btn && nav) {
    btn.addEventListener('click', function () { nav.classList.toggle('open'); });
  }
}

/* ========== 首页科目卡片点击跳转 ========== */
function initSubjectCards() {
  var cards = document.querySelectorAll('.subject-card');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var target = this.getAttribute('data-goto');
      if (target) {
        var tab = document.querySelector('.nav-tab[data-tab="' + target + '"]');
        if (tab) tab.click();
      }
    });
  });
}

/* ========== 搜索过滤 ========== */
function initSearch() {
  var searchInput = document.getElementById('videoSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterCards(this.value.toLowerCase().trim(), document);
    });
  }
  var tabSearches = document.querySelectorAll('.video-search');
  tabSearches.forEach(function (input) {
    input.addEventListener('input', function () {
      filterCards(this.value.toLowerCase().trim(), this.closest('.tab-content') || document);
    });
  });
}

function filterCards(query, container) {
  var cards = container.querySelectorAll('.video-card');
  var items = container.querySelectorAll('.knowledge-item');
  cards.forEach(function (card) {
    card.style.display = card.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
  items.forEach(function (item) {
    item.style.display = item.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
}

/* ========== 视频懒加载 ========== */
function initVideoPlaceholders() {
  var placeholders = document.querySelectorAll('.video-placeholder');
  placeholders.forEach(function (ph) {
    ph.addEventListener('click', function () {
      var wrapper = this.parentElement;
      var bvid = this.getAttribute('data-bvid');
      var aid = this.getAttribute('data-aid');
      var page = this.getAttribute('data-page') || '1';
      if (!bvid && !aid) return;

      var iframe = document.createElement('iframe');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('sandbox', 'allow-top-navigation allow-same-origin allow-forms allow-scripts allow-popups');

      var src = 'https://player.bilibili.com/player.html?page=' + page;
      if (bvid) src += '&bvid=' + bvid;
      else if (aid) src += '&aid=' + aid;
      src += '&high_quality=1&danmaku=0&autoplay=0';
      iframe.setAttribute('src', src);

      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);
      wrapper.style.paddingBottom = '56.25%';
      wrapper.style.height = '0';
    });
  });
}

/* ========== 夜间模式 ========== */
function initDarkMode() {
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // 读取保存的设置
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    toggle.textContent = '☀️ 日间';
  }

  toggle.addEventListener('click', function () {
    var isDark = document.body.classList.toggle('dark');
    toggle.textContent = isDark ? '☀️ 日间' : '🌙 夜间';
    localStorage.setItem('darkMode', isDark);
  });
}

/* ========== 每日一题 ========== */
var PROBLEMS = [
  // ========== 高等数学（20题） ==========
  { subject: '高等数学', difficulty: '经典', hint: '回顾第一个重要极限。', q: '求极限：$$\\lim_{x \\to 0} \\frac{\\sin x}{x}$$', a: '答案是 \\(1\\)。这是第一个重要极限，可用夹逼准则证明：\\(\\cos x < \\frac{\\sin x}{x} < 1\\)（\\(x \\in (0, \\pi/2)\\)），由夹逼准则得极限为 1。' },
  { subject: '高等数学', difficulty: '经典', hint: '等价无穷小：1-cos x ~ x²/2。', q: '求极限：$$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}$$', a: '答案是 \\(\\dfrac{1}{2}\\)。方法一：等价无穷小 \\(1-\\cos x \\sim \\dfrac{x^2}{2}\\)。方法二：泰勒展开 \\(\\cos x = 1 - \\dfrac{x^2}{2!} + \\dfrac{x^4}{4!} - \\cdots\\)。' },
  { subject: '高等数学', difficulty: '易错', hint: '有界量 × 无穷小 = 0，别用洛必达！', q: '【易错题】求极限：$$\\lim_{x \\to 0} x \\cdot \\sin\\frac{1}{x}$$', a: '答案是 \\(0\\)。因为 \\(|\\sin(1/x)| \\le 1\\) 有界，\\(x \\to 0\\) 是无穷小量，有界量乘以无穷小量仍是无穷小量，极限为 0。\n\n⚠️ 常见错误：有人试图用洛必达法则，但 \\(\\sin(1/x)\\) 在 \\(x=0\\) 附近振荡，导数不存在！洛必达法则不是万能的。' },
  { subject: '高等数学', difficulty: '易错', hint: '用泰勒展开 tan x 和 sin x。', q: '【易错题】求极限：$$\\lim_{x \\to 0} \\frac{\\tan x - \\sin x}{x^3}$$', a: '答案是 \\(\\dfrac{1}{2}\\)。\n\n\\[\\tan x - \\sin x = \\frac{\\sin x}{\\cos x} - \\sin x = \\sin x \\cdot \\frac{1-\\cos x}{\\cos x} \\sim x \\cdot \\frac{x^2/2}{1} = \\frac{x^3}{2}\\]\n\n除以 \\(x^3\\) 得 \\(\\dfrac{1}{2}\\)。或用泰勒展开：\\(\\tan x = x + \\dfrac{x^3}{3} + \\cdots\\)，\\(\\sin x = x - \\dfrac{x^3}{6} + \\cdots\\)，相减得 \\(\\dfrac{x^3}{2} + \\cdots\\)。' },
  { subject: '高等数学', difficulty: '经典', hint: '第二个重要极限，答案是 e。', q: '求极限：$$\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x$$', a: '答案是 \\(e\\)。这是第二个重要极限，也是自然常数 \\(e\\) 的定义式。\n\n变体：\\(\\lim_{x \\to 0} (1+x)^{1/x} = e\\)，\\(\\lim_{n \\to \\infty} (1+\\frac{1}{n})^n = e\\)。' },
  { subject: '高等数学', difficulty: '易错', hint: '用泰勒 e^x = 1 + x + x²/2! + ...', q: '求极限：$$\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2}$$', a: '答案是 \\(\\dfrac{1}{2}\\)。泰勒展开：\\(e^x = 1 + x + \\dfrac{x^2}{2!} + \\dfrac{x^3}{3!} + \\cdots\\)，代入得 \\(\\dfrac{x^2/2 + O(x^3)}{x^2} \\to \\dfrac{1}{2}\\)。\n\n⚠️ 不能直接用等价无穷小 \\(e^x-1 \\sim x\\)，因为分子中还有 \\(-x\\)，高阶项不能忽略！' },
  { subject: '高等数学', difficulty: '易错', hint: '连续不一定可导，检查左右导数。', q: '【易错题】函数 \\(f(x) = |x|\\) 在 \\(x = 0\\) 处是否可导？请说明理由。', a: '不可导。\n\n左导数：\\(f\'(0^-) = \\lim_{h \\to 0^-} \\frac{|h| - 0}{h} = \\lim_{h \\to 0^-} \\frac{-h}{h} = -1\\)\n右导数：\\(f\'(0^+) = \\lim_{h \\to 0^+} \\frac{|h| - 0}{h} = \\lim_{h \\to 0^+} \\frac{h}{h} = 1\\)\n\n左右导数不相等，所以不可导。⚠️ 易错点：连续是导数的必要条件而非充分条件！\\(|x|\\) 在 \\(x=0\\) 处连续但不可导。' },
  { subject: '高等数学', difficulty: '经典', hint: '用对数求导法，两边取 ln。', q: '设 \\(y = x^x\\ (x > 0)\\)，求 \\(\\dfrac{dy}{dx}\\)。', a: '答案是 \\(y\' = x^x(\\ln x + 1)\\)。\n\n用对数求导法：\\(\\ln y = x \\ln x\\)，两边对 \\(x\\) 求导：\\(\\frac{y\'}{y} = \\ln x + 1\\)，所以 \\(y\' = y(\\ln x + 1) = x^x(\\ln x + 1)\\)。' },
  { subject: '高等数学', difficulty: '经典', hint: 'tan x = sin x / cos x，凑微分。', q: '计算不定积分：$$\\int \\tan x \\, dx$$', a: '答案是 \\(-\\ln|\\cos x| + C\\)。\n\n\\[\\int \\tan x \\, dx = \\int \\frac{\\sin x}{\\cos x} \\, dx = -\\int \\frac{d(\\cos x)}{\\cos x} = -\\ln|\\cos x| + C\\]\n\n这是高频考点，务必记住！' },
  { subject: '高等数学', difficulty: '易错', hint: 'x=0 是瑕点，不能直接代公式！', q: '【易错题】计算定积分：$$\\int_{-1}^{1} \\frac{1}{x} \\, dx$$', a: '该积分发散（不存在）！\n\n⚠️ 常见错误：直接写成 \\(\\ln|x|\\big|_{-1}^1 = \\ln 1 - \\ln 1 = 0\\)，这是错的！\n\n正确做法：\\(x=0\\) 是瑕点，必须分段讨论。\\(\\int_{-1}^1 \\frac{1}{x} dx = \\int_{-1}^0 \\frac{1}{x} dx + \\int_0^1 \\frac{1}{x} dx\\)，而 \\(\\int_0^1 \\frac{1}{x} dx = \\lim_{a \\to 0^+} \\ln x|_a^1 = +\\infty\\)，发散。\n\n教训：积分前先检查是否有瑕点！' },
  { subject: '高等数学', difficulty: '经典', hint: '用半角公式 sin²x = (1-cos 2x)/2。', q: '计算定积分：$$\\int_{0}^{\\pi} \\sin^2 x \\, dx$$', a: '答案是 \\(\\dfrac{\\pi}{2}\\)。\n\n用半角公式：\\(\\sin^2 x = \\dfrac{1 - \\cos 2x}{2}\\)\n\n\\[\\int_0^\\pi \\sin^2 x \\, dx = \\int_0^\\pi \\frac{1 - \\cos 2x}{2} dx = \\frac{1}{2}\\left[x - \\frac{\\sin 2x}{2}\\right]_0^\\pi = \\frac{\\pi}{2}\\]' },
  { subject: '高等数学', difficulty: '经典', hint: '分子分母同乘 sec x + tan x。', q: '计算不定积分：$$\\int \\sec x \\, dx$$', a: '答案是 \\(\\ln|\\sec x + \\tan x| + C\\)。\n\n经典技巧：分子分母同乘 \\(\\sec x + \\tan x\\)：\n\\[\\int \\sec x \\, dx = \\int \\frac{\\sec x(\\sec x + \\tan x)}{\\sec x + \\tan x} dx = \\int \\frac{d(\\sec x + \\tan x)}{\\sec x + \\tan x} = \\ln|\\sec x + \\tan x| + C\\]\n\n这是考研中经典的"难记但常考"公式。' },
  { subject: '高等数学', difficulty: '易错', hint: '调和级数虽然通项趋于0，但级数发散！', q: '【易错题】判断级数 \\(\\displaystyle\\sum_{n=1}^{\\infty} \\frac{1}{n}\\) 的敛散性，并说明为什么通项趋于 0 但级数却发散。', a: '发散（调和级数）。\n\n⚠️ 这是最经典的"反例"：通项 \\(a_n = 1/n \\to 0\\)，但级数发散！\n\n证明：用积分判别法，\\(\\int_1^\\infty \\frac{1}{x} dx = \\ln x|_1^\\infty = +\\infty\\)。\n\n或者用分组法：\\(1 + \\frac{1}{2} + (\\frac{1}{3}+\\frac{1}{4}) + (\\frac{1}{5}+\\cdots+\\frac{1}{8}) + \\cdots > 1 + \\frac{1}{2} + \\frac{1}{2} + \\frac{1}{2} + \\cdots = +\\infty\\)。\n\n教训：通项趋于 0 是级数收敛的必要条件，但不是充分条件！' },
  { subject: '高等数学', difficulty: '易错', hint: '用莱布尼茨判别法判断交错级数。', q: '【易错题】判断级数 \\(\\displaystyle\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}\\) 的敛散性，是绝对收敛还是条件收敛？', a: '条件收敛。\n\n1. 通项 \\(a_n = 1/n\\) 单调递减趋于 0，由莱布尼茨判别法，交错级数收敛。\n2. 但绝对值级数 \\(\\sum 1/n\\)（调和级数）发散。\n3. 所以原级数条件收敛而非绝对收敛。\n\n⚠️ 易错：不能只看通项趋于 0 就认为是绝对收敛，要区分条件收敛和绝对收敛！' },
  { subject: '高等数学', difficulty: '易错', hint: '用积分判别法。', q: '【易错题】判断级数 \\(\\displaystyle\\sum_{n=2}^{\\infty} \\frac{1}{n \\ln n}\\) 的敛散性。', a: '发散！\n\n用积分判别法：\\(\\int_2^\\infty \\frac{1}{x \\ln x} dx = \\ln|\\ln x||_2^\\infty = +\\infty\\)。\n\n⚠️ 这是一个"隐藏很深"的发散级数。虽然 \\(\\frac{1}{n \\ln n}\\) 比 \\(\\frac{1}{n}\\) 趋于 0 更快，但仍不足以使级数收敛。常被误判为收敛。' },
  { subject: '高等数学', difficulty: '经典', hint: '画出积分区域，确定 x 和 y 的范围。', q: '交换积分次序：$$\\int_0^1 dx \\int_{x^2}^x f(x,y) \\, dy$$', a: '积分区域由 \\(y = x^2\\) 和 \\(y = x\\) 围成（\\(x \\in [0,1]\\)）。\n\n交换次序后：\\(y\\) 从 0 到 1，对于固定的 \\(y\\)，\\(x\\) 从 \\(y\\) 到 \\(\\sqrt{y}\\)。\n\n\\[\\int_0^1 dy \\int_y^{\\sqrt{y}} f(x,y) \\, dx\\]\n\n⚠️ 注意：\\(x^2 \\le y \\le x\\) 等价于 \\(y \\le x \\le \\sqrt{y}\\)（当 \\(y \\in [0,1]\\)）。' },
  { subject: '高等数学', difficulty: '经典', hint: '特征方程 r²-3r+2=0。', q: '求微分方程 \\(y\'\' - 3y\' + 2y = 0\\) 的通解。', a: '通解：\\(y = C_1 e^x + C_2 e^{2x}\\)。\n\n特征方程：\\(r^2 - 3r + 2 = 0\\)，\\((r-1)(r-2) = 0\\)，特征根 \\(r_1 = 1, r_2 = 2\\)，是两个不相等的实根，通解为 \\(y = C_1 e^{r_1 x} + C_2 e^{r_2 x}\\)。' },
  { subject: '高等数学', difficulty: '易错', hint: '混合偏导数连续时与次序无关。', q: '【易错题】设 \\(z = x^2 y + xy^2\\)，求 \\(\\dfrac{\\partial^2 z}{\\partial x \\partial y}\\) 和 \\(\\dfrac{\\partial^2 z}{\\partial y \\partial x}\\)，比较两者。', a: '\\(\\dfrac{\\partial z}{\\partial x} = 2xy + y^2\\)，\\(\\dfrac{\\partial^2 z}{\\partial x \\partial y} = 2x + 2y\\)。\n\\(\\dfrac{\\partial z}{\\partial y} = x^2 + 2xy\\)，\\(\\dfrac{\\partial^2 z}{\\partial y \\partial x} = 2x + 2y\\)。\n\n两者相等！当混合偏导数连续时，求导次序可交换。⚠️ 但不是所有函数都成立，反例需要偏导数不连续。' },
  { subject: '高等数学', difficulty: '经典', hint: '这是 e^x 的泰勒级数展开。', q: '求幂级数 \\(\\displaystyle\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}\\) 的和函数。', a: '和函数是 \\(e^x\\)，收敛域为 \\((-\\infty, +\\infty)\\)。\n\n这是指数函数的麦克劳林展开式：\\(e^x = 1 + x + \\dfrac{x^2}{2!} + \\dfrac{x^3}{3!} + \\cdots = \\sum_{n=0}^{\\infty} \\dfrac{x^n}{n!}\\)。\n\n收敛半径 \\(R = +\\infty\\)（用比值判别法可证）。' },
  { subject: '高等数学', difficulty: '易错', hint: 'x→0 时不能用洛必达，用夹逼准则。', q: '【易错题】求极限：$$\\lim_{x \\to 0} x^2 \\cdot \\sin\\frac{1}{x}$$', a: '答案是 \\(0\\)。\n\n\\(|\\sin(1/x)| \\le 1\\)，\\(x^2 \\to 0\\)，所以 \\(|x^2 \\sin(1/x)| \\le x^2 \\to 0\\)，由夹逼准则极限为 0。\n\n⚠️ 不能用洛必达法则！（原因同第3题）' },

  // ========== 线性代数（10题） ==========
  { subject: '线性代数', difficulty: '易错', hint: '每一行提取一个 k，共 n 行。', q: '【易错题】设 \\(A\\) 是 \\(n\\) 阶方阵，\\(|A| = 2\\)，求 \\(|3A|\\)。', a: '\\(|3A| = 3^n \\cdot 2\\)。\n\n⚠️ 常见错误：写成 \\(3|A| = 6\\)，这是错的！\n\n正确：\\(|kA| = k^n |A|\\)，每一行提取公因子 \\(k\\)，共 \\(n\\) 行，所以是 \\(k^n\\) 倍。当 \\(n=3\\) 时，\\(|3A| = 27 \\times 2 = 54\\)。' },
  { subject: '线性代数', difficulty: '易错', hint: '矩阵乘法存在零因子。', q: '【易错题】若 \\(A, B\\) 是 \\(n\\) 阶方阵且 \\(AB = O\\)（零矩阵），是否必有 \\(A = O\\) 或 \\(B = O\\)？', a: '不一定！\n\n反例：\\(A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}\\)，\\(B = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}\\)，则 \\(AB = O\\) 但 \\(A \\neq O\\) 且 \\(B \\neq O\\)。\n\n⚠️ 矩阵乘法与普通乘法不同，存在非零的零因子。只有当 \\(|A| \\neq 0\\) 或 \\(|B| \\neq 0\\) 时才能推出另一个为零矩阵。' },
  { subject: '线性代数', difficulty: '易错', hint: '矩阵乘法不满足交换律！', q: '【易错题】\\((A + B)^2 = A^2 + 2AB + B^2\\) 是否恒成立？', a: '不恒成立！\n\n正确展开：\\((A+B)^2 = (A+B)(A+B) = A^2 + AB + BA + B^2\\)。\n\n只有 \\(AB = BA\\)（即 \\(A\\) 和 \\(B\\) 可交换）时，才有 \\(AB + BA = 2AB\\)，公式 \\(A^2 + 2AB + B^2\\) 才成立。\n\n⚠️ 矩阵乘法不满足交换律，这是线性代数中最常犯的错误之一！' },
  { subject: '线性代数', difficulty: '经典', hint: '行列式不为零则满秩。', q: '求矩阵 \\(A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}\\) 的秩。', a: '秩为 2（满秩）。\n\n\\(|A| = 1 \\times 4 - 2 \\times 3 = -2 \\neq 0\\)，所以 \\(A\\) 可逆，秩等于阶数 2。' },
  { subject: '线性代数', difficulty: '经典', hint: '构造矩阵，求行列式看是否为 0。', q: '判断向量组 \\(\\alpha_1=(1,1,0)^T\\)，\\(\\alpha_2=(0,1,1)^T\\)，\\(\\alpha_3=(1,0,-1)^T\\) 是否线性无关。', a: '线性相关。\n\n构造矩阵 \\(A = (\\alpha_1, \\alpha_2, \\alpha_3)\\)，\\(|A| = \\begin{vmatrix} 1 & 0 & 1 \\\\ 1 & 1 & 0 \\\\ 0 & 1 & -1 \\end{vmatrix} = 0\\)，所以线性相关。\n\n实际上 \\(\\alpha_3 = \\alpha_1 - \\alpha_2\\)（即 \\((1,0,-1)^T = (1,1,0)^T - (0,1,1)^T\\)）。' },
  { subject: '线性代数', difficulty: '易错', hint: '顺序主子式都要大于 0。', q: '【易错题】判断二次型 \\(f(x_1, x_2) = x_1^2 + 4x_1 x_2 + x_2^2\\) 是否正定。', a: '不正定！\n\n二次型矩阵 \\(A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}\\)。\n\n顺序主子式：\\(\\Delta_1 = 1 > 0\\)，\\(\\Delta_2 = |A| = 1 - 4 = -3 < 0\\)，所以不正定。\n\n⚠️ 易错：不能只看平方项系数是否为正！交叉项会影响正定性。正确的判别方法是用顺序主子式（霍尔维茨定理）。' },
  { subject: '线性代数', difficulty: '易错', hint: '转置要反过来乘。', q: '【易错题】\\((AB)^T = ?\\) 请写出正确公式。', a: '\\((AB)^T = B^T A^T\\)。\n\n⚠️ 常见错误：写成 \\(A^T B^T\\)！转置运算会反转乘积顺序。\n\n验证：设 \\(A\\) 为 \\(m \\times n\\) 矩阵，\\(B\\) 为 \\(n \\times p\\) 矩阵，\\(AB\\) 为 \\(m \\times p\\)，\\((AB)^T\\) 为 \\(p \\times m\\)。而 \\(B^T A^T = (p \\times n)(n \\times m) = p \\times m\\)，维度匹配。\\(A^T B^T\\) 维度不对。' },
  { subject: '线性代数', difficulty: '经典', hint: '|A*| = |A|^(n-1)。', q: '设 \\(A\\) 是 3 阶方阵且 \\(|A| = 2\\)，求伴随矩阵 \\(A^*\\) 的行列式 \\(|A^*|\\)。', a: '\\(|A^*| = |A|^{n-1} = 2^{3-1} = 2^2 = 4\\)。\n\n一般公式：\\(A^* = |A| A^{-1}\\)，所以 \\(|A^*| = |A|^n \\cdot |A^{-1}| = |A|^n \\cdot |A|^{-1} = |A|^{n-1}\\)。' },
  { subject: '线性代数', difficulty: '经典', hint: '基础解系中向量的个数 = n - r(A)。', q: '设 \\(A\\) 是 \\(4 \\times 5\\) 矩阵且秩 \\(r(A) = 3\\)，求齐次线性方程组 \\(Ax = 0\\) 的基础解系中含有几个向量。', a: '基础解系中含有 \\(5 - 3 = 2\\) 个向量。\n\n公式：基础解系中向量的个数 = 未知量个数 - 系数矩阵的秩 = \\(n - r(A)\\)。这里 \\(n = 5\\)（5 个未知数），\\(r(A) = 3\\)，所以有 2 个自由变量。' },
  { subject: '线性代数', difficulty: '经典', hint: '相似矩阵的特征值相同。', q: '若矩阵 \\(A\\) 与 \\(B\\) 相似（\\(A \\sim B\\)），它们的特征值有什么关系？行列式呢？', a: '相似矩阵有相同的特征值、相同的行列式、相同的迹、相同的秩。\n\n\\(A \\sim B\\) 意味着存在可逆矩阵 \\(P\\) 使 \\(B = P^{-1}AP\\)。\n\n\\(|B - \\lambda I| = |P^{-1}AP - \\lambda P^{-1}P| = |P^{-1}(A - \\lambda I)P| = |P^{-1}| \\cdot |A - \\lambda I| \\cdot |P| = |A - \\lambda I|\\)，所以特征多项式相同，特征值相同。' },

  // ========== 概率统计（10题） ==========
  { subject: '概率统计', difficulty: '易错', hint: '条件概率的"条件"和"结果"不能互换。', q: '【易错题】\\(P(A|B) = P(B|A)\\) 是否恒成立？请举例说明。', a: '不恒成立！\n\n\\(P(A|B) = \\dfrac{P(AB)}{P(B)}\\)，\\(P(B|A) = \\dfrac{P(AB)}{P(A)}\\)。\n\n两者相等当且仅当 \\(P(A) = P(B)\\)。\n\n反例：设 \\(P(A)=0.1, P(B)=0.5, P(AB)=0.05\\)，则 \\(P(A|B)=0.1, P(B|A)=0.5\\)，不相等。\n\n⚠️ 实际意义：已知 B 发生时 A 的概率 ≠ 已知 A 发生时 B 的概率。这在贝叶斯公式中很重要！' },
  { subject: '概率统计', difficulty: '经典', hint: '用加法公式 P(A∪B) = P(A)+P(B)-P(AB)。', q: '设 \\(P(A) = 0.5\\)，\\(P(B) = 0.4\\)，\\(P(A \\cap B) = 0.3\\)，求 \\(P(A \\cup B)\\) 和 \\(P(A|B)\\)。', a: '\\(P(A \\cup B) = P(A) + P(B) - P(AB) = 0.5 + 0.4 - 0.3 = 0.6\\)。\n\\(P(A|B) = \\dfrac{P(AB)}{P(B)} = \\dfrac{0.3}{0.4} = 0.75\\)。' },
  { subject: '概率统计', difficulty: '易错', hint: '独立⇒不相关，反之不成立！', q: '【易错题】随机变量 \\(X\\) 和 \\(Y\\) 不相关（\\(\\rho_{XY}=0\\)），它们是否一定独立？', a: '不一定！\n\n独立 ⇒ 不相关，但不相关 ⇏ 独立。\n\n反例：\\((X,Y)\\) 在以原点为圆心的单位圆上均匀分布，可以证明 \\(\\text{Cov}(X,Y) = 0\\)，但 \\(X\\) 和 \\(Y\\) 不独立（因为知道 \\(X\\) 的值会限制 \\(Y\\) 的范围）。\n\n⚠️ 只有在二维正态分布等特殊情形下，不相关才等价于独立。' },
  { subject: '概率统计', difficulty: '经典', hint: '二项分布 E(X)=np, D(X)=np(1-p)。', q: '设 \\(X \\sim B(10, 0.5)\\)，求 \\(E(X)\\)、\\(D(X)\\) 和 \\(P(X = 5)\\)。', a: '\\(E(X) = np = 10 \\times 0.5 = 5\\)\n\\(D(X) = np(1-p) = 10 \\times 0.5 \\times 0.5 = 2.5\\)\n\\(P(X=5) = C_{10}^5 (0.5)^5 (0.5)^5 = \\dfrac{252}{1024} \\approx 0.246\\)' },
  { subject: '概率统计', difficulty: '经典', hint: '全概率公式：P(B) = Σ P(B|A_i)P(A_i)。', q: '【经典题】某工厂有 3 台机器，产量分别占 50%、30%、20%，次品率分别为 2%、3%、5%。随机取一件产品，求它是次品的概率。', a: '用全概率公式：\n\\(P(\\text{次品}) = 0.5 \\times 0.02 + 0.3 \\times 0.03 + 0.2 \\times 0.05\\)\n\\(= 0.01 + 0.009 + 0.01 = 0.029 = 2.9\\%\\)\n\n全概率公式：将复杂事件分解为互斥的简单事件，加权求和。' },
  { subject: '概率统计', difficulty: '易错', hint: 'D(X+Y) 别忘了协方差项！', q: '【易错题】\\(D(X+Y) = D(X) + D(Y)\\) 是否恒成立？什么时候成立？', a: '不恒成立！\n\n正确公式：\\(D(X+Y) = D(X) + D(Y) + 2\\text{Cov}(X,Y)\\)。\n\n只有当 \\(X\\) 和 \\(Y\\) 不相关（\\(\\text{Cov}(X,Y)=0\\)）时，才有 \\(D(X+Y) = D(X) + D(Y)\\)。\n\n⚠️ 常见错误：忘记协方差项！特别当 \\(X=Y\\) 时，\\(D(X+X)=D(2X)=4D(X)\\)，而不是 \\(D(X)+D(X)=2D(X)\\)。' },
  { subject: '概率统计', difficulty: '经典', hint: '独立正态的线性组合仍为正态。', q: '\\(X \\sim N(2,4)\\)，\\(Y \\sim N(1,9)\\)，\\(X\\) 与 \\(Y\\) 独立，求 \\(Z = X + Y\\) 和 \\(W = X - Y\\) 的分布。', a: '\\(Z = X+Y \\sim N(2+1, 4+9) = N(3, 13)\\)\n\\(W = X-Y \\sim N(2-1, 4+9) = N(1, 13)\\)\n\n独立正态变量的线性组合仍为正态：\\(aX + bY \\sim N(a\\mu_X + b\\mu_Y, a^2\\sigma_X^2 + b^2\\sigma_Y^2)\\)。\n注意：\\(X-Y\\) 的方差也是 \\(D(X) + D(Y)\\)，而不是 \\(D(X) - D(Y)\\)！' },
  { subject: '概率统计', difficulty: '经典', hint: '泊松分布 P(X=k) = λ^k e^(-λ) / k!', q: '设 \\(X\\) 服从参数为 \\(\\lambda\\) 的泊松分布，且 \\(P(X=1) = P(X=2)\\)，求 \\(\\lambda\\) 和 \\(E(X)\\)。', a: '泊松分布：\\(P(X=k) = \\dfrac{\\lambda^k e^{-\\lambda}}{k!}\\)。\n\n由 \\(P(X=1)=P(X=2)\\)：\\(\\lambda e^{-\\lambda} = \\dfrac{\\lambda^2 e^{-\\lambda}}{2}\\)，解得 \\(\\lambda = 2\\)（\\(\\lambda = 0\\) 舍去）。\n\\(E(X) = \\lambda = 2\\)，\\(D(X) = \\lambda = 2\\)（泊松分布的期望和方差都等于 \\(\\lambda\\)）。' },
  { subject: '概率统计', difficulty: '经典', hint: '标准化：(X-μ)/σ ~ N(0,1)。', q: '设 \\(X \\sim N(3, 4)\\)，求 \\(P(1 < X < 5)\\)（已知 \\(\\Phi(1) = 0.8413\\)）。', a: '\\(P(1 < X < 5) = P\\left(\\frac{1-3}{2} < \\frac{X-3}{2} < \\frac{5-3}{2}\\right) = P(-1 < Z < 1)\\)\n\\(= \\Phi(1) - \\Phi(-1) = \\Phi(1) - (1 - \\Phi(1)) = 2\\Phi(1) - 1\\)\n\\(= 2 \\times 0.8413 - 1 = 0.6826\\)\n\n这验证了"68-95-99.7 法则"：正态分布数据约 68% 落在 \\(\\mu \\pm \\sigma\\) 内。' },
  { subject: '概率统计', difficulty: '易错', hint: '注意区分条件概率和联合概率。', q: '【易错题】已知 \\(P(A) = 0.6\\)，\\(P(B) = 0.5\\)，\\(P(A \\cup B) = 0.8\\)，判断 \\(A\\) 与 \\(B\\) 是否独立。', a: '\\(P(AB) = P(A) + P(B) - P(A \\cup B) = 0.6 + 0.5 - 0.8 = 0.3\\)。\n\n若独立应有 \\(P(A)P(B) = 0.6 \\times 0.5 = 0.3\\)。\n\n\\(P(AB) = 0.3 = P(A)P(B)\\)，所以 \\(A\\) 与 \\(B\\) 独立。\n\n⚠️ 注意：不能凭直觉判断独立性，一定要验证 \\(P(AB) = P(A)P(B)\\)！' }
];

var currentProblem = null;

function initDailyProblem() {
  var toggleBtn = document.getElementById('answerToggle');
  var refreshBtn = document.getElementById('refreshProblem');
  var hintBtn = document.getElementById('hintToggle');
  var answerBox = document.getElementById('answerBox');
  var hintBox = document.getElementById('hintBox');
  if (!toggleBtn || !refreshBtn || !answerBox) return;

  // 加载今日题目（按日期固定）
  loadDailyProblem();

  toggleBtn.addEventListener('click', function () {
    answerBox.classList.toggle('show');
    toggleBtn.textContent = answerBox.classList.contains('show') ? '🙈 隐藏答案' : '👀 查看答案';
    // 隐藏提示
    if (hintBox) { hintBox.classList.remove('show'); hintBtn.textContent = '💡 提示'; }
  });

  if (hintBtn && hintBox) {
    hintBtn.addEventListener('click', function () {
      hintBox.classList.toggle('show');
      hintBtn.textContent = hintBox.classList.contains('show') ? '🙈 隐藏提示' : '💡 提示';
      // 隐藏答案
      answerBox.classList.remove('show');
      toggleBtn.textContent = '👀 查看答案';
    });
  }

  refreshBtn.addEventListener('click', function () {
    currentProblem = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    renderProblem();
    answerBox.classList.remove('show');
    toggleBtn.textContent = '👀 查看答案';
    if (hintBox) { hintBox.classList.remove('show'); hintBtn.textContent = '💡 提示'; }
  });
}

function loadDailyProblem() {
  var today = new Date().toDateString();
  var stored = JSON.parse(localStorage.getItem('dailyProblem') || '{}');
  if (stored.date === today) {
    currentProblem = stored.problem;
  } else {
    // 按日期伪随机选题
    var idx = new Date().getDate() % PROBLEMS.length;
    currentProblem = PROBLEMS[idx];
    localStorage.setItem('dailyProblem', JSON.stringify({ date: today, problem: currentProblem }));
  }
  renderProblem();
}

function renderProblem() {
  var subEl = document.getElementById('problemSubject');
  var diffEl = document.getElementById('problemDifficulty');
  var qEl = document.getElementById('problemQuestion');
  var aEl = document.getElementById('problemAnswer');
  var hintEl = document.getElementById('problemHint');
  if (!subEl || !qEl || !aEl) return;

  subEl.textContent = currentProblem.subject;

  // 难度标签
  if (diffEl) {
    diffEl.textContent = currentProblem.difficulty || '经典';
    diffEl.className = 'difficulty-tag ' + (currentProblem.difficulty || '经典');
  }

  qEl.innerHTML = currentProblem.q;
  aEl.innerHTML = currentProblem.a;
  if (hintEl) {
    hintEl.textContent = currentProblem.hint || '暂无提示';
  }

  // KaTeX 渲染
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(qEl, { throwOnError: false });
    renderMathInElement(aEl, { throwOnError: false });
  }
}

/* ========== 进度追踪 ========== */
function initProgress() {
  var btns = document.querySelectorAll('.progress-btn');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var subject = this.getAttribute('data-subject');
      var value = parseInt(this.getAttribute('data-value'), 10);

      // 保存进度
      var progress = JSON.parse(localStorage.getItem('studyProgress') || '{}');
      progress[subject] = value;
      localStorage.setItem('studyProgress', progress);

      updateProgressUI(subject, value);
    });
  });

  // 加载已保存的进度
  var saved = JSON.parse(localStorage.getItem('studyProgress') || '{}');
  Object.keys(saved).forEach(function (key) {
    updateProgressUI(key, saved[key]);
  });
}

function updateProgressUI(subject, value) {
  var bar = document.querySelector('.progress-bar-fill[data-subject="' + subject + '"]');
  var label = document.querySelector('.progress-label[data-subject="' + subject + '"]');
  var btns = document.querySelectorAll('.progress-btn[data-subject="' + subject + '"]');

  if (bar) bar.style.width = value + '%';
  if (label) label.textContent = value + '% 已完成';

  btns.forEach(function (btn) {
    btn.classList.remove('active');
    if (parseInt(btn.getAttribute('data-value'), 10) === value) {
      btn.classList.add('active');
    }
  });
}

/* ========== 每日打卡 ========== */
function initCheckin() {
  var btn = document.getElementById('checkinBtn');
  var streakEl = document.getElementById('streakCount');
  if (!btn || !streakEl) return;

  updateCheckinUI(btn, streakEl);

  btn.addEventListener('click', function () {
    var today = new Date().toDateString();
    var data = JSON.parse(localStorage.getItem('checkinData') || '{"lastDate":"","streak":0}');

    if (data.lastDate === today) return; // 今天已打卡

    var yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastDate === yesterday) {
      data.streak += 1;
    } else {
      data.streak = 1;
    }
    data.lastDate = today;
    localStorage.setItem('checkinData', JSON.stringify(data));
    updateCheckinUI(btn, streakEl);
  });
}

function updateCheckinUI(btn, streakEl) {
  var data = JSON.parse(localStorage.getItem('checkinData') || '{"lastDate":"","streak":0}');
  var today = new Date().toDateString();

  if (data.lastDate === today) {
    btn.textContent = '✅ 今日已打卡';
    btn.classList.add('checked');
  } else {
    btn.textContent = '📅 今日打卡';
    btn.classList.remove('checked');
  }

  streakEl.textContent = data.streak;
}

/* ========== 考研倒计时 ========== */
function initCountdown() {
  var daysEl = document.getElementById('countdownDays');
  var dateEl = document.getElementById('countdownDate');
  if (!daysEl) return;

  // 2027考研初试预计日期：2026年12月19日（周六）
  var examDate = new Date('2026-12-19');
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var diff = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

  if (diff > 0) {
    daysEl.textContent = diff;
    if (dateEl) dateEl.textContent = '预计 2026年12月19日';
  } else if (diff === 0) {
    daysEl.textContent = '就是今天！';
    if (dateEl) dateEl.textContent = '加油！💪';
  } else {
    daysEl.textContent = '0';
    if (dateEl) dateEl.textContent = '初试已结束，备战复试！';
  }
}

/* ========== 回到顶部按钮 ========== */
function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
