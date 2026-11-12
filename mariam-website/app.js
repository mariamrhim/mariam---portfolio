/* Website behaviour. Edit content.js for your personal details. */
(() => {
  'use strict';

  const content = window.PORTFOLIO;
  if (!content) return;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const store = {
    get(key, fallback = null) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    },
    remove(key) { try { localStorage.removeItem(key); } catch {} }
  };

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  // Prevent unsafe link protocols in manually edited content.
  function safeLink(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    const link = value.trim();
    if (/^(https?:\/\/|mailto:)/i.test(link)) return link;
    if (!/^[a-z][a-z\d+.-]*:/i.test(link) && !link.startsWith('//')) return link;
    return '';
  }

  let toastTimer;
  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
  }

  async function copy(text) {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      else {
        const field = element('textarea');
        field.value = text;
        field.style.cssText = 'position:fixed;left:-9999px';
        document.body.append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Copy unavailable');
      }
      toast('Copied to clipboard.');
    } catch { toast('Copy unavailable. Select and copy the text instead.'); }
  }

  function download(filename, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = element('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Personal details shared across pages.
  $$('[data-full-name]').forEach(node => node.textContent = content.name);
  $$('[data-short-name]').forEach(node => node.textContent = content.shortName);
  $$('[data-direction]').forEach(node => node.textContent = content.direction);
  $$('[data-introduction]').forEach(node => node.textContent = content.introduction);
  $$('[data-email]').forEach(node => {
    node.href = 'mailto:' + content.email;
    if (!node.textContent.trim()) node.textContent = content.email;
  });
  $$('[data-portrait]').forEach(image => {
    image.src = safeLink(content.portrait) || 'assets/portrait-placeholder.svg';
    image.alt = content.portraitAlt;
    image.addEventListener('error', () => {
      image.src = 'assets/portrait-placeholder.svg';
      image.alt = 'Portrait placeholder';
    }, { once: true });
  });
  $('#year').textContent = new Date().getFullYear();

  // Appearance, navigation and restrained scroll animation.
  const theme = $('#theme');
  if (store.get('mariam-theme-v3') === 'dark') document.body.classList.add('dark');
  function labelTheme() {
    theme.setAttribute('aria-label', document.body.classList.contains('dark')
      ? 'Switch to light theme' : 'Switch to dark theme');
  }
  labelTheme();
  theme.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    store.set('mariam-theme-v3', document.body.classList.contains('dark') ? 'dark' : 'light');
    labelTheme();
  });

  const menu = $('#menu');
  function closeMenu() {
    $('#navigation').classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    menu.textContent = '☰';
  }
  menu.addEventListener('click', () => {
    const open = $('#navigation').classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.textContent = open ? '✕' : '☰';
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $('.reading-progress').style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  }, { passive: true });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.body.classList.add('js-motion');
    $$('.reveal').forEach(node => observer.observe(node));
  }

  $('#share').addEventListener('click', async () => {
    if (location.protocol === 'file:') {
      toast('Share the published website address; this file is on your device.');
      return;
    }
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: location.href });
      else await copy(location.href);
    } catch (error) { if (error.name !== 'AbortError') await copy(location.href); }
  });

  // vCard download works locally as well as on the hosted website.
  function vcardEscape(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }
  $$('[data-save-contact]').forEach(button => button.addEventListener('click', () => {
    const card = ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + vcardEscape(content.name),
      'EMAIL:' + vcardEscape(content.email), 'END:VCARD', ''].join('\r\n');
    download('Siti-Mariam.vcf', card, 'text/vcard');
  }));
  $('#copy-email')?.addEventListener('click', () => copy(content.email));

  // About page. Empty education/experience lists stay hidden.
  if ($('#about-copy')) {
    content.about.forEach(paragraph => $('#about-copy').append(element('p', paragraph, 'body-copy')));
    content.interests.forEach(interest => $('#interests').append(element('span', interest)));
    for (const section of ['education', 'experience']) {
      const entries = content[section] || [];
      if (!entries.length) continue;
      $('#' + section + '-section').hidden = false;
      entries.forEach(entry => {
        const article = element('article', undefined, 'profile-entry');
        article.append(element('h3', entry.title), element('p', entry.detail));
        if (entry.description) article.append(element('p', entry.description));
        $('#' + section + '-list').append(article);
      });
    }
    const resume = safeLink(content.resume);
    if (resume) {
      const link = element('a', 'Download résumé ↓', 'text-link');
      link.href = resume;
      link.download = '';
      $('#resume-link').append(link);
    }
  }
  if ($('#social-links')) {
    (content.socialLinks || []).forEach(social => {
      const url = safeLink(social.url);
      if (!url) return;
      const link = element('a', social.label + ' ↗', 'text-link');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      $('#social-links').append(link);
    });
  }

  // Portfolio: search, category filters, local bookmarks, and project details.
  if ($('#project-grid')) {
    const projects = content.projects || [];
    let saved = store.get('mariam-projects-v3', []);
    if (!Array.isArray(saved)) saved = [];
    let filter = 'all';
    const filters = [{ key: 'all', label: 'All work' },
      ...[...new Set(projects.map(project => project.category))].map(category => ({ key: category, label: category })),
      { key: 'saved', label: 'Saved' }];
    filters.forEach(item => {
      const button = element('button', item.label);
      button.dataset.filter = item.key;
      button.setAttribute('aria-pressed', String(item.key === filter));
      button.classList.toggle('active', item.key === filter);
      button.addEventListener('click', () => {
        filter = item.key;
        $$('[data-filter]').forEach(node => {
          const active = node === button;
          node.classList.toggle('active', active);
          node.setAttribute('aria-pressed', String(active));
        });
        render();
      });
      $('#filters').append(button);
    });

    function projectImage(project) {
      const image = element('img');
      image.src = safeLink(project.image) || 'assets/project-website.svg';
      image.alt = project.imageAlt || project.title;
      image.width = 1200;
      image.height = 800;
      image.loading = 'lazy';
      return image;
    }

    function projectLink(project, className = 'text-link') {
      const url = safeLink(project.url);
      if (!url) return null;
      const link = element('a', (project.linkLabel || 'View project') + ' ↗', className);
      link.href = url;
      if (/^https?:/i.test(url)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      return link;
    }

    function showProject(project) {
      const detail = $('#project-detail');
      detail.replaceChildren();
      const title = element('h2', project.title);
      title.id = 'project-dialog-title';
      detail.append(projectImage(project), title,
        element('p', project.category + ' / ' + project.year + ' / ' + project.status),
        element('p', project.description));
      if (project.details?.length) {
        const list = element('ul');
        project.details.forEach(item => list.append(element('li', item)));
        detail.append(list);
      }
      const link = projectLink(project, 'button');
      if (link) detail.append(link);
      $('#project-dialog').showModal();
    }

    function render() {
      const query = $('#project-search').value.trim().toLowerCase();
      const matches = projects.filter(project => {
        const categoryMatch = filter === 'all' || (filter === 'saved'
          ? saved.includes(project.id) : project.category === filter);
        return categoryMatch && [project.title, project.category, project.summary].join(' ').toLowerCase().includes(query);
      });
      $('#project-count').textContent = matches.length + ' project' + (matches.length === 1 ? '' : 's') + ' in this view';
      const grid = $('#project-grid');
      grid.classList.toggle('single-project', matches.length === 1);
      grid.replaceChildren();
      if (!matches.length) {
        grid.append(element('p', filter === 'saved'
          ? 'No saved matches. Use the bookmark button on a project, or clear your search.'
          : 'No matching projects. Try another search or choose All work.', 'empty-state'));
      }
      matches.forEach(project => {
        const card = element('article', undefined, 'project-card');
        const imageWrap = element('div', undefined, 'project-image');
        imageWrap.append(projectImage(project));
        const info = element('div', undefined, 'project-info');
        const row = element('div', undefined, 'project-title-row');
        const titleBlock = element('div');
        titleBlock.append(element('p', project.category.toUpperCase() + ' / ' + project.year, 'eyebrow'),
          element('h3', project.title));
        const save = element('button', saved.includes(project.id) ? '▣' : '▢', 'save-project');
        save.dataset.save = project.id;
        save.setAttribute('aria-label', (saved.includes(project.id) ? 'Unsave ' : 'Save ') + project.title);
        save.setAttribute('aria-pressed', String(saved.includes(project.id)));
        save.addEventListener('click', () => {
          saved = saved.includes(project.id) ? saved.filter(id => id !== project.id) : [...saved, project.id];
          const kept = store.set('mariam-projects-v3', saved);
          toast(kept ? 'Saved collection updated on this device.' : 'Updated for this visit. Browser storage unavailable.');
          render();
        });
        row.append(titleBlock, save);
        const actions = element('div', undefined, 'actions');
        const details = element('button', 'Project details ↗', 'text-link');
        details.dataset.project = project.id;
        details.addEventListener('click', () => showProject(project));
        actions.append(details);
        const link = projectLink(project);
        if (link) actions.append(link);
        info.append(row, element('p', project.summary, 'body-copy'), actions);
        card.append(imageWrap, info);
        grid.append(card);
      });
    }
    $('#project-search').addEventListener('input', render);
    render();
    $('[data-close]').addEventListener('click', () => $('#project-dialog').close());
    $('#project-dialog').addEventListener('click', event => {
      const dialog = $('#project-dialog');
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  }

  // Contact: local drafts only. There is no backend or public editing interface.
  if ($('#contact-form')) {
    const form = $('#contact-form');
    let topic = 'An opportunity';
    const draftKey = 'mariam-contact-draft-v3';
    function setTopic(value) {
      topic = value;
      $$('[data-topic]').forEach(button => {
        const active = button.dataset.topic === value;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    function count() {
      $('#char-count').textContent = form.elements.message.value.length + ' / 3000';
    }
    function saveDraft() {
      const draft = Object.fromEntries(new FormData(form));
      draft.topic = topic;
      const saved = store.set(draftKey, draft);
      $('#draft-status').textContent = saved ? 'Draft saved on this device' : 'Storage unavailable — draft not saved';
      count();
    }
    const draft = store.get(draftKey);
    if (draft && typeof draft === 'object') {
      for (const key of ['name', 'email', 'subject', 'message']) {
        if (typeof draft[key] === 'string') form.elements[key].value = draft[key];
      }
      if (['An opportunity', 'A collaboration', 'An introduction'].includes(draft.topic)) setTopic(draft.topic);
    }
    count();
    form.addEventListener('input', saveDraft);
    $$('[data-topic]').forEach(button => button.addEventListener('click', () => {
      setTopic(button.dataset.topic);
      if (!form.elements.subject.value) form.elements.subject.value = topic;
      saveDraft();
    }));
    $('#clear-draft').addEventListener('click', () => {
      form.reset();
      setTopic('An opportunity');
      store.remove(draftKey);
      count();
      $('#draft-status').textContent = 'Draft cleared';
      toast('Draft cleared.');
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      saveDraft();
      const data = new FormData(form);
      const body = 'Hi Mariam,\n\n' + data.get('message') + '\n\n' + data.get('name') +
        '\nReply to: ' + data.get('email') + '\nTopic: ' + topic;
      location.href = 'mailto:' + content.email + '?subject=' + encodeURIComponent(data.get('subject')) +
        '&body=' + encodeURIComponent(body);
      toast('Email draft requested. Send it from your email app.');
    });
  }
})();
