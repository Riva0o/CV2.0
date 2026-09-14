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
      const image = project.image ? `<img class="project-photo" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} 项目图片" loading="lazy">` : '';
      return `<article class="project-card reveal${index % 2 ? ' delay' : ''}" data-category="${escapeHtml(project.category)}"><div class="project-art ${escapeHtml(project.visual)}">${image}${visualContent}</div><div class="project-info"><div><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.year)}</p></div><span>↗</span></div></article>`;
    }).join('');
  }

  function renderPortrait() {
    const card = document.querySelector('.contact-card');
    if (!card || !data.profile.portrait) return;
    const portrait = document.createElement('img');
    portrait.className = 'profile-photo';
    portrait.src = data.profile.portrait;
    portrait.alt = `${data.profile.name} 证件照`;
    portrait.loading = 'lazy';
    card.prepend(portrait);
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

  function renderPdfWorks() {
    const container = document.querySelector('#pdf-portfolio');
    if (!container || !Array.isArray(data.pdfWorks)) return;
    container.innerHTML = `<div class="pdf-wrap"><div class="pdf-heading"><p class="eyebrow"><span>05 / PDF WORKS</span> ARCHIVE</p><h2>完整作品，<em>一页打开。</em></h2></div><div class="pdf-grid">${data.pdfWorks.map((work) => {
      const available = work.status && work.status.includes('可');
      const actions = available ? `<a href="${escapeHtml(work.file)}" target="_blank" rel="noreferrer">在线预览 ↗</a><a href="${escapeHtml(work.file)}" download>下载 PDF ↓</a>` : '<span class="pdf-pending">文件待上传</span>';
      return `<article class="pdf-card"><div class="pdf-cover"><span>PDF</span><strong>${escapeHtml(work.title)}</strong><small>${escapeHtml(work.year)}</small></div><div class="pdf-card-body"><p class="pdf-type">${escapeHtml(work.type)}</p><h3>${escapeHtml(work.title)}</h3><p>${escapeHtml(work.description)}</p><div class="pdf-actions">${actions}</div></div></article>`;
    }).join('')}</div></div>`;
  }

  function setupModuleStyles() {
    const style = document.createElement('style');
    style.textContent = `.module-dock{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:95px}.data-module{border-top:1px solid var(--line);padding-top:22px}.data-module h3{font-size:28px;letter-spacing:-.07em;margin:18px 0 28px}.data-module ul{list-style:none;padding:0;margin:0}.data-module li{display:grid;grid-template-columns:82px 1fr;gap:12px;border-top:1px solid var(--line);padding:13px 0;font:10px/1.6 var(--mono);color:var(--muted)}.data-module li>b{font-weight:400;color:var(--accent)}.data-module li span{display:grid;gap:3px}.data-module li strong{font:700 12px/1.35 var(--sans);color:var(--ink)}.data-module li small{font:10px/1.7 var(--mono);color:var(--muted)}@media(max-width:760px){.module-dock{display:block;margin-top:70px}.data-module{margin-bottom:55px}.data-module h3{font-size:25px}.data-module li{grid-template-columns:72px 1fr}}`;
    document.head.appendChild(style);
  }

  function setupPdfStyles() {
    const style = document.createElement('style');
    style.textContent = `.pdf-portfolio{background:var(--paper);padding:100px 6vw 125px;border-top:1px solid var(--line)}.pdf-wrap{width:88vw;max-width:1250px;margin:0 auto}.pdf-heading{display:flex;align-items:end;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:25px;margin-bottom:42px}.pdf-heading h2{font-size:clamp(40px,5vw,72px);line-height:.98;letter-spacing:-.09em;margin:25px 0 0}.pdf-heading h2 em{font-family:var(--serif);font-weight:400;color:var(--accent)}.pdf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.pdf-card{background:var(--white);border:1px solid var(--line);transition:transform .3s,box-shadow .3s}.pdf-card:hover{transform:translateY(-7px);box-shadow:10px 10px 0 var(--lime)}.pdf-cover{height:220px;background:var(--ink);color:var(--lime);padding:18px;display:flex;flex-direction:column;justify-content:space-between}.pdf-cover span{font:10px var(--mono);color:var(--accent)}.pdf-cover strong{font-size:28px;line-height:1;letter-spacing:-.08em;max-width:220px}.pdf-cover small{font:10px var(--mono);color:#b5c2b3}.pdf-card-body{padding:19px}.pdf-type{font:10px var(--mono);color:var(--accent);margin:0 0 13px}.pdf-card h3{font-size:16px;letter-spacing:-.04em;margin:0 0 10px}.pdf-card-body>p:not(.pdf-type){font-size:12px;line-height:1.7;color:var(--muted);min-height:42px;margin:0}.pdf-actions{display:flex;gap:16px;border-top:1px solid var(--line);margin-top:18px;padding-top:14px;align-items:center}.pdf-actions a{color:var(--ink);font:10px var(--mono);text-decoration:none;border-bottom:1px solid var(--ink);padding-bottom:4px}.pdf-pending{font:10px var(--mono);color:var(--muted)}@media(max-width:760px){.pdf-portfolio{padding:80px 6vw 90px}.pdf-heading{display:block}.pdf-grid{display:block}.pdf-card{margin-bottom:20px}.pdf-cover{height:190px}}`;
    document.head.appendChild(style);
  }

  setupModuleStyles();
  setupPdfStyles();
  renderSkills();
  renderProjects();
  renderPortrait();
  renderResumeModules();
  renderPdfWorks();
  typeRole();
  setupNavigation();
  setupProjectFilters();
  setupContactForm();
}());