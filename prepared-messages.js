export function preparedMessage() {
  const CONFIG = {
    retryDelay: 500,

    selectors: {
      menus: '[role="menu"]',
      textarea: '#message-input',
      sendButton: '[data-test="sendMessageButton"]',
    },

    targetIndex: 2,

    classes: {
      item: 'custom-menu-item',
      submenu: 'custom-submenu',
    },

    submenu: {
      styles: `
        position: fixed;
        background: #fff;
        border: 1px solid #ddd;
        padding: 6px 0;
        min-width: 180px;
        z-index: 999999;
        list-style: none;
        margin: 0;
        border-radius: 6px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      `,
    },

    messages: [
      { text: 'Здравствуйте', value: 'Здравствуйте' },
      { text: 'До свидания', value: 'До свидания' },
    ],
  };

  /**
   * Initialize prepared messages
  */
  function init() {
    const targetMenu = getTargetMenu();

    if (!targetMenu) {
      return retry(init);
    }

    if (isAlreadyInjected(targetMenu)) return;

    const menuItem = createMenuItem();
    bindMenuItemEvent(menuItem);

    targetMenu.appendChild(menuItem);
  }

  /**
   * Get target menu by index from DOM
   * @returns {HTMLElement}
  */
  function getTargetMenu() {
    const menus = document.querySelectorAll(CONFIG.selectors.menus);
    return menus[CONFIG.targetIndex];
  }

  /**
   * Retry helper with delay
   * @param {Function} fn - function to retry
  */
  function retry(fn) {
    return setTimeout(fn, CONFIG.retryDelay);
  }

  /**
   * Check if custom menu item already exists
   * @param {HTMLElement} menu
   * @returns {boolean}
  */
  function isAlreadyInjected(menu) {
    return menu.querySelector(`.${CONFIG.classes.item}`);
  }

  /**
   * Create main menu item (icon + text)
   * @returns {HTMLLIElement}
  */
  function createMenuItem() {
    const li = document.createElement('li');
    li.className = `MuiListItem-root MuiMenuItem-root ${CONFIG.classes.item}`;

    const icon = createIcon();
    const text = createText('Быстрые сообщения');

    li.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      position: relative;
    `;

    li.appendChild(icon);
    li.appendChild(text);

    return li;
  }

  /**
   * Create icon element for menu item
   * @returns {HTMLElement}
  */
  function createIcon() {
    const icon = document.createElement('i');
    icon.className = 'sc-bdvvtL goIptw icon-bbb-user';

    icon.style.cssText = `
      margin-right: 8px;
      display: inline-flex;
      align-items: center;
    `;

    return icon;
  }

  /**
   * Create text element
   * @param {string} text
   * @returns {HTMLSpanElement}
  */
  function createText(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }

  /**
   * Bind click event to menu item
   * @param {HTMLLIElement} li
  */
  function bindMenuItemEvent(li) {
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      createSubmenu(li);
    });
  }

  /**
   * Create and show submenu
   * @param {HTMLElement} parentItem
  */
  function createSubmenu(parentItem) {
    removeExistingSubmenu();

    const submenu = buildSubmenu(parentItem);
    document.body.appendChild(submenu);

    watchMenuVisibility(parentItem, submenu);
    bindOutsideClick(submenu);
  }

  /**
   * Remove existing submenu from DOM
  */
  function removeExistingSubmenu() {
    document.querySelectorAll(`.${CONFIG.classes.submenu}`).forEach(el => el.remove());
  }

  /**
   * Build submenu element with items
   * @param {HTMLElement} parentItem
   * @returns {HTMLUListElement}
  */
  function buildSubmenu(parentItem) {
    const rect = parentItem.getBoundingClientRect();

    const ul = document.createElement('ul');
    ul.className = CONFIG.classes.submenu;

    ul.style.cssText = `
      ${CONFIG.submenu.styles}
      top: ${rect.top}px;
      left: ${rect.right}px;
    `;

    CONFIG.messages.forEach(item => {
      const li = createSubmenuItem(item, ul);
      ul.appendChild(li);
    });

    return ul;
  }

  /**
   * Create single submenu item
   * @param {{text: string, value: string}} item
   * @param {HTMLElement} submenu
   * @returns {HTMLLIElement}
  */
  function createSubmenuItem(item, submenu) {
    const li = document.createElement('li');

    li.textContent = item.text;

    li.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
    `;

    li.onmouseenter = () => li.style.background = '#f5f5f5';
    li.onmouseleave = () => li.style.background = 'transparent';

    li.onclick = (e) => {
      e.stopPropagation();
      sendMessage(item.value);
      submenu.remove();
    };

    return li;
  }

  /**
   * Send message to textarea and trigger button click
   * @param {string} text
  */
  function sendMessage(text) {
    const textarea = document.querySelector(CONFIG.selectors.textarea);
    const button = document.querySelector(CONFIG.selectors.sendButton);

    if (!textarea || !button) return;

    textarea.focus();
    textarea.value = text;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    setTimeout(() => button.click(), 100);
  }

  /**
   * Observe menu visibility and remove submenu when menu closes
   * @param {HTMLElement} parentItem
   * @param {HTMLElement} submenu
  */
  function watchMenuVisibility(parentItem, submenu) {
    const menu = parentItem.closest('[role="menu"]');

    const observer = new MutationObserver(() => {
      const style = window.getComputedStyle(menu);

      if (style.visibility === 'hidden' || style.display === 'none') {
        submenu.remove();
        observer.disconnect();
      }
    });

    observer.observe(menu, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  /**
   * Close submenu on outside click
   * @param {HTMLElement} submenu
  */
  function bindOutsideClick(submenu) {
    setTimeout(() => {
      const close = (e) => {
        if (!submenu.contains(e.target)) {
          submenu.remove();
          document.removeEventListener('click', close);
        }
      };

      document.addEventListener('click', close);
    }, 0);
  }

  init();
}