/* ========== 考研数学学习网 - 交互脚本 ========== */

document.addEventListener('DOMContentLoaded', function () {
  initTabs();
  initMobileMenu();
  initSubjectCards();
  initSearch();
  initVideoPlaceholders();
});

/* ========== Tab 切换 ========== */
function initTabs() {
  var tabs = document.querySelectorAll('.nav-tab');
  var contents = document.querySelectorAll('.tab-content');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');

      // 切换激活标签
      tabs.forEach(function (t) {
        t.classList.remove('active');
      });
      this.classList.add('active');

      // 切换内容区
      contents.forEach(function (c) {
        c.classList.remove('active');
      });
      var el = document.getElementById(target);
      if (el) el.classList.add('active');

      // 关闭移动端菜单
      var navTabs = document.querySelector('.nav-tabs');
      if (navTabs) navTabs.classList.remove('open');

      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ========== 移动端菜单 ========== */
function initMobileMenu() {
  var btn = document.querySelector('.mobile-menu-btn');
  var nav = document.querySelector('.nav-tabs');

  if (btn && nav) {
    btn.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
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
  // 首页搜索框
  var searchInput = document.getElementById('videoSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      filterCards(query, document);
    });
  }

  // 各模块页搜索框
  var tabSearches = document.querySelectorAll('.video-search');
  tabSearches.forEach(function (input) {
    input.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      var tab = this.closest('.tab-content');
      filterCards(query, tab || document);
    });
  });
}

function filterCards(query, container) {
  var cards = container.querySelectorAll('.video-card');
  var items = container.querySelectorAll('.knowledge-item');

  cards.forEach(function (card) {
    var text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });

  items.forEach(function (item) {
    var text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? '' : 'none';
  });
}

/* ========== 视频懒加载（点击后再加载 iframe） ========== */
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
      if (bvid) {
        src += '&bvid=' + bvid;
      } else if (aid) {
        src += '&aid=' + aid;
      }
      src += '&high_quality=1&danmaku=0&autoplay=0';

      iframe.setAttribute('src', src);

      // 替换占位符为 iframe
      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);

      // 重置 wrapper 样式
      wrapper.style.paddingBottom = '56.25%';
      wrapper.style.height = '0';
    });
  });
}
