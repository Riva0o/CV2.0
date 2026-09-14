(function () {
  const data = window.portfolioData;
  const views = document.querySelectorAll('.view');
  const navButtons = document.querySelectorAll('[data-view]');
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  const typedRole = document.querySelector('#typed-role');
  let roleIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  function typeRole() {
    const role = data.roles[roleIndex];
    typedRole.textContent = role.slice(0, characterIndex);
    if (!deleting && characterIndex < role.length) {
      characterIndex += 1;
      window.setTimeout(typeRole, 105);
      return;
    }
    if (!deleting) {
      deleting = true;
      window.setTimeout(typeRole, 1500);
      return;
    }
    if (characterIndex > 0) {
      characterIndex -= 1;
      window.setTimeout(typeRole, 55);
      return;
    }
    deleting = false;
    roleIndex = (roleIndex + 1) % data.roles.length;
    window.setTimeout(typeRole, 250);
  }

  function switchView(name) {
    views.forEach((view) => view.classList.toggle('active', view.dataset.page === name));
    navButtons.forEach((button) => {
      if (button.dataset.view) button.classList.toggle('active', button.dataset.view === name);
    });
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    history.replaceState(null, '', `#${name}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupNavigation() {
    navButtons.forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      switchView(button.dataset.view);
    }));
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', open);
    });
    const initialView = location.hash.slice(1);
    if (['about', 'skills', 'projects', 'contact'].includes(initialView)) switchView(initialView);
  }

  function setupProjectFilters() {
    document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('.project-card').forEach((card) => {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      });
    }));
  }

  function setupContactForm() {
    document.querySelector('.contact-form').addEventListener('submit', (event) => {
      event.preventDefault();
      event.currentTarget.querySelector('.form-message').textContent = data.formSuccess;
      event.currentTarget.reset();
    });
  }

  function renderSkills() {
    const list = document.querySelector('.skill-list');
    const cloud = document.querySelector('.tool-cloud');
    list.innerHTML = data.skills.map((skill) => `<div><div class="skill-top"><span>${escapeHtml(skill.name)}</span><b>${skill.level}%</b></div><div class="bar"><i style="--level:${skill.level}%"></i></div></div>`).join('');
    cloud.innerHTML = `<strong>TOOLKIT</strong>${escapeHtml(data.tools)}<br><br><strong>LANGUAGE</strong>${escapeHtml(data.languages)}`;
  }

  function renderProjects() {
    const grid = document.querySelector('.project-grid');
    grid.innerHTML = data.projects.map((project, index) => {
      const statement = project.statement ? `<strong>${escapeHtml(project.statement).replace(/\n/g, '<br>')}</strong>` : `<b>${escapeHtml(project.word).replace(/\n/g, '<br>')}</b>`;
      const visualContent = project.visual === 'green' ? `<span class="art-word">${escapeHtml(project.word)}</span><div class="art-window"><i></i><i></i><i></i>${statement}</div>` : project.visual === 'orange' ? `<div class="art-copy">${escapeHtml(project.word).replace(/\n/g, '<br>')}</div><div class="sun"></div>` : `<div class="grid-lines"></div><div class="phone"><span>${escapeHtml(project.word)}</span><b>让体验<br>从一个<br>好想法开始</b></div>`;
      return `<article class="project-card reveal${index % 2 ? ' delay' : ''}" data-category="${escapeHtml(project.category)}"><div class="project-art ${escapeHtml(project.visual)}">${visualContent}</div><div class="project-info"><div><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.year)}</p></div><span>↗</span></div></article>`;
    }).join('');
  }

  function renderResumeModules() {
    const about = document.querySelector('.about-content');
    const modules = document.createElement('div');
    modules.className = 'module-dock';
    modules.innerHTML = data.modules.map((module) => {
      let content = '';
      if (module.type === 'education') content = data.education.map((item) => `<li><b>${escapeHtml(item.period)}</b><span><strong>${escapeHtml(item.title)}</strong>${escapeHtml(item.organization)}${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ''}</span></li>`).join('');
      if (module.type === 'experience') content = data.experience.map((item) => `<li><b>${escapeHtml(item.period)}</b><span><strong>${escapeHtml(item.title)}</strong>${escapeHtml(item.organization)}<small>${escapeHtml(item.detail)}</small></span></li>`).join('');
      if (module.type === 'awards') content = data.awards.map((award) => `<li><span>${escapeHtml(award)}</span></li>`).join('');
      return `<section class="data-module reveal"><p class="eyebrow"><span>${escapeHtml(module.label)}</span> RESUME</p><h3>${escapeHtml(module.title)}</h3><ul>${content}</ul></section>`;
    }).join('');
    about.appendChild(modules);
  }

  function setupModuleStyles() {
    const style = document.createElement('style');
    style.textContent = `.module-dock{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:95px}.data-module{border-top:1px solid var(--line);padding-top:22px}.data-module h3{font-size:28px;letter-spacing:-.07em;margin:18px 0 28px}.data-module ul{list-style:none;padding:0;margin:0}.data-module li{display:grid;grid-template-columns:82px 1fr;gap:12px;border-top:1px solid var(--line);padding:13px 0;font:10px/1.6 var(--mono);color:var(--muted)}.data-module li>b{font-weight:400;color:var(--accent)}.data-module li span{display:grid;gap:3px}.data-module li strong{font:700 12px/1.35 var(--sans);color:var(--ink)}.data-module li small{font:10px/1.7 var(--mono);color:var(--muted)}@media(max-width:760px){.module-dock{display:block;margin-top:70px}.data-module{margin-bottom:55px}.data-module h3{font-size:25px}.data-module li{grid-template-columns:72px 1fr}}`;
    document.head.appendChild(style);
  }

  setupModuleStyles();
  renderSkills();
  renderProjects();
  renderResumeModules();
  typeRole();
  setupNavigation();
  setupProjectFilters();
  setupContactForm();
}());