'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const escapeAttr = escapeHtml;

const loadSite = () => {
  const file = path.join(SRC, 'content', 'site.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const renderHead = (site, { pageTitle, description }) => `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <meta property="og:title" content="${escapeAttr(pageTitle)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeAttr(site.meta.url)}">
    <meta property="og:image" content="${escapeAttr(site.meta.og_image)}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="/styles/main.css">
`;

const renderNav = (site) => `
<nav class="nav" data-nav aria-label="Główna nawigacja">
  <a href="/" class="nav__brand">${escapeHtml(site.meta.site_name)}</a>
  <ul class="nav__list">
    ${site.nav.links.map((link) => `
      <li><a class="nav__link" href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a></li>
    `).join('')}
  </ul>
  <button type="button" class="nav__toggle" data-nav-toggle aria-expanded="false" aria-label="Otwórz menu">
    <span class="nav__toggle-bar" aria-hidden="true"></span>
  </button>
</nav>
`;

const renderHero = (hero) => `
<section class="hero fade-in" id="praktyka">
  <div class="hero__media" aria-hidden="true">
    <img src="${escapeAttr(hero.image.src)}" alt="${escapeAttr(hero.image.alt)}" loading="eager" decoding="async">
  </div>
  <div class="hero__inner">
    <span class="eyebrow">${escapeHtml(hero.eyebrow)}</span>
    <h1 class="hero__title">
      ${escapeHtml(hero.title_line_1)}
      <span class="hero__title-accent">${escapeHtml(hero.title_line_2)}</span>
    </h1>
    <p class="hero__lead">${escapeHtml(hero.lead)}</p>
    <a class="hero__cta" href="${escapeAttr(hero.cta_href)}">
      <span>${escapeHtml(hero.cta_label)}</span>
      <span class="hero__cta-icon" aria-hidden="true">→</span>
    </a>
  </div>
</section>
`;

const renderMarquee = (items) => {
  const renderTrack = (ariaHidden) => `
    <div class="marquee__track"${ariaHidden ? ' aria-hidden="true"' : ''}>
      ${items.map((item) => `
        <span class="marquee__item">${escapeHtml(item)}</span>
        <span class="marquee__dot" aria-hidden="true"></span>
      `).join('')}
    </div>
  `;
  return `
<div class="marquee" aria-label="Obszary praktyki">
  ${renderTrack(false)}
  ${renderTrack(true)}
</div>
`;
};

const renderServices = (services) => `
<section class="section services fade-in" id="praktyka-szczegoly">
  <div class="services__grid">
    <div class="services__intro">
      <h2 class="section__heading">${escapeHtml(services.heading_line_1)}<br>${escapeHtml(services.heading_line_2)}</h2>
      <p class="section__intro">${escapeHtml(services.intro)}</p>
    </div>
    <div class="services__list">
      ${services.items.map((item) => `
        <article class="service">
          <span class="service__number">${escapeHtml(item.number)}</span>
          <h3 class="service__title">${escapeHtml(item.title)}</h3>
          <p class="service__description">${escapeHtml(item.description)}</p>
          <span class="service__icon" aria-hidden="true">↗</span>
        </article>
      `).join('')}
    </div>
  </div>
</section>
`;

const renderPhilosophy = (philosophy) => `
<section class="section philosophy fade-in" id="filozofia">
  <div class="philosophy__grid">
    <div class="philosophy__media">
      <img src="${escapeAttr(philosophy.image.src)}" alt="${escapeAttr(philosophy.image.alt)}" loading="lazy" decoding="async">
    </div>
    <div class="philosophy__content">
      <h2 class="philosophy__title">
        ${escapeHtml(philosophy.title_main)}
        <span class="philosophy__title-accent">${escapeHtml(philosophy.title_accent)}</span>
        ${escapeHtml(philosophy.title_tail)}
      </h2>
      <div class="philosophy__text">
        ${philosophy.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
      <div class="philosophy__signature">
        <img src="${escapeAttr(philosophy.signature.avatar.src)}" alt="${escapeAttr(philosophy.signature.avatar.alt)}" loading="lazy" decoding="async">
        <div>
          <span class="philosophy__signature-name">${escapeHtml(philosophy.signature.name)}</span>
          <span class="philosophy__signature-role">${escapeHtml(philosophy.signature.role)}</span>
        </div>
      </div>
    </div>
  </div>
</section>
`;

const renderTeam = (team) => `
<section class="section section--bordered team fade-in" id="zespol">
  <div class="team__head">
    <h2 class="section__heading">${escapeHtml(team.heading)}</h2>
    <p class="section__intro">${escapeHtml(team.intro)}</p>
  </div>
  <div class="team__grid">
    ${team.members.map((member) => `
      <article class="team-card">
        <div class="team-card__media">
          <img src="${escapeAttr(member.image.src)}" alt="${escapeAttr(member.image.alt)}" loading="lazy" decoding="async">
        </div>
        <h3 class="team-card__name">${escapeHtml(member.name)}</h3>
        <span class="team-card__role">${escapeHtml(member.role)}</span>
        <p class="team-card__bio">${escapeHtml(member.bio)}</p>
      </article>
    `).join('')}
  </div>
</section>
`;

const renderTrackRecord = (record) => `
<section class="section track-record fade-in" id="track-record">
  <div class="track-record__head">
    <span class="eyebrow">${escapeHtml(record.eyebrow)}</span>
    <h2 class="section__heading">${escapeHtml(record.heading)}</h2>
  </div>
  <div class="track-record__list">
    ${record.items.map((item) => `
      <article class="track-item">
        <div class="track-item__year">${escapeHtml(item.year)}</div>
        <div>
          <span class="track-item__sector">${escapeHtml(item.sector)}</span>
          <span class="track-item__category">${escapeHtml(item.category)}</span>
        </div>
        <p class="track-item__description">${escapeHtml(item.description)}</p>
      </article>
    `).join('')}
  </div>
</section>
`;

const renderInsights = (insights) => `
<section class="section section--bordered insights fade-in" id="insights">
  <div class="insights__head">
    <div>
      <h2 class="section__heading">${escapeHtml(insights.heading)}</h2>
      <p class="section__intro">${escapeHtml(insights.intro)}</p>
    </div>
    <a class="insights__all" href="${escapeAttr(insights.all_href)}">${escapeHtml(insights.all_label)}</a>
  </div>
  <div class="insights__grid">
    ${insights.items.map((item) => `
      <a class="insight-card" href="${escapeAttr(item.href)}">
        <div class="insight-card__header">
          <span class="insight-card__category">${escapeHtml(item.category)}</span>
          <span aria-hidden="true">↗</span>
        </div>
        <div>
          <span class="insight-card__date">${escapeHtml(item.date)}</span>
          <h3 class="insight-card__title">${escapeHtml(item.title)}</h3>
          <p class="insight-card__excerpt">${escapeHtml(item.excerpt)}</p>
        </div>
      </a>
    `).join('')}
  </div>
</section>
`;

const renderContact = (contact) => `
<section class="section contact fade-in" id="kontakt">
  <div class="contact__head">
    <h2 class="section__heading">${escapeHtml(contact.heading)}</h2>
    <p class="section__intro">${escapeHtml(contact.intro)}</p>
  </div>
  <div class="contact__form-wrap">
    <form class="contact__form" data-contact-form data-endpoint="${escapeAttr(contact.endpoint)}" novalidate>
      <div class="contact__row">
        <div class="field">
          <input class="field__input" type="text" id="contact-name" name="name" required placeholder="Imię i nazwisko" autocomplete="name">
          <label class="field__label" for="contact-name">Imię i nazwisko</label>
        </div>
        <div class="field">
          <input class="field__input" type="email" id="contact-email" name="email" required placeholder="Adres e-mail" autocomplete="email">
          <label class="field__label" for="contact-email">Adres e-mail</label>
        </div>
      </div>
      <div class="field field--select">
        <label class="sr-only" for="contact-topic">Temat rozmowy</label>
        <select class="field__select" id="contact-topic" name="topic" required>
          <option value="" disabled selected>Temat Rozmowy</option>
          ${contact.topics.map((topic) => `
            <option value="${escapeAttr(topic.value)}">${escapeHtml(topic.label)}</option>
          `).join('')}
        </select>
      </div>
      <label class="consent">
        <input class="consent__input" type="checkbox" name="consent" required>
        <span class="consent__box" aria-hidden="true"><span class="consent__check">✓</span></span>
        <span class="consent__text">${escapeHtml(contact.consent)}</span>
      </label>
      <div class="contact__submit-row">
        <button class="contact__submit" type="submit" data-contact-submit>
          <span>${escapeHtml(contact.submit_label)}</span>
          <span class="contact__submit-icon" aria-hidden="true">→</span>
        </button>
      </div>
      <p class="contact__status" data-contact-status role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
`;

const renderFooter = (footer) => `
<footer class="footer">
  <span class="footer__brand">${escapeHtml(footer.brand)}</span>
  <div class="footer__row">
    ${footer.social.map((link) => `<a href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a>`).join('')}
  </div>
  <span class="footer__copy">${escapeHtml(footer.copyright)}</span>
  <div class="footer__row">
    ${footer.legal_links.map((link) => `<a href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a>`).join('')}
  </div>
</footer>
`;

const renderHomePage = (site) => `<!doctype html>
<html lang="${escapeAttr(site.meta.lang)}">
<head>${renderHead(site, { pageTitle: site.meta.title, description: site.meta.description })}</head>
<body>
${renderNav(site)}
<main>
${renderHero(site.hero)}
${renderMarquee(site.marquee)}
${renderServices(site.services)}
${renderPhilosophy(site.philosophy)}
${renderTeam(site.team)}
${renderTrackRecord(site.track_record)}
${renderInsights(site.insights)}
${renderContact(site.contact)}
</main>
${renderFooter(site.footer)}
<script src="/scripts/main.js" defer></script>
</body>
</html>
`;

const renderLegalPage = (site, page) => {
  const pageTitle = `${page.title} | ${site.meta.site_name}`;
  const description = `${page.title} — ${site.meta.site_name}.`;
  return `<!doctype html>
<html lang="${escapeAttr(site.meta.lang)}">
<head>${renderHead(site, { pageTitle, description })}</head>
<body>
${renderNav(site)}
<!-- TODO: weryfikacja prawna -->
<main class="legal">
  <a class="legal__back" href="/">← Powrót na stronę główną</a>
  <h1 class="legal__title">${escapeHtml(page.title)}</h1>
  <span class="legal__notice">${escapeHtml(page.placeholder_notice)}</span>
  <p class="legal__intro">${escapeHtml(page.intro)}</p>
  ${page.sections.map((section) => `
    <section class="legal__section">
      <h2>${escapeHtml(section.heading)}</h2>
      <p>${escapeHtml(section.body)}</p>
    </section>
  `).join('')}
</main>
${renderFooter(site.footer)}
<script src="/scripts/main.js" defer></script>
</body>
</html>
`;
};

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const cleanDist = () => {
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);
};

const copyAssets = () => {
  const assets = [
    { from: path.join(SRC, 'styles', 'main.css'), to: path.join(DIST, 'styles', 'main.css') },
    { from: path.join(SRC, 'scripts', 'main.js'), to: path.join(DIST, 'scripts', 'main.js') },
    { from: path.join(SRC, 'static', '_headers'), to: path.join(DIST, '_headers') },
    { from: path.join(SRC, 'static', '_redirects'), to: path.join(DIST, '_redirects') },
  ];
  for (const asset of assets) {
    ensureDir(path.dirname(asset.to));
    fs.copyFileSync(asset.from, asset.to);
  }
};

const writeFile = (relPath, html) => {
  const target = path.join(DIST, relPath);
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, html);
};

const build = () => {
  const site = loadSite();
  cleanDist();
  copyAssets();
  writeFile('index.html', renderHomePage(site));
  writeFile(`${site.legal_pages.privacy.slug}.html`, renderLegalPage(site, site.legal_pages.privacy));
  writeFile(`${site.legal_pages.disclaimer.slug}.html`, renderLegalPage(site, site.legal_pages.disclaimer));
  process.stdout.write(`Build OK → ${path.relative(ROOT, DIST)}/\n`);
};

build();
