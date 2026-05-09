/* Admin Dashboard — Firebase Auth + Firestore CRUD
   Edits site content stored at:  collection 'site' / doc 'content'
   Schema: { hero, about, services[], portfolio[], whyMe, contact }
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig, ADMIN_EMAIL } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const SITE_DOC = doc(db, 'site', 'content');

// -------- DEFAULT CONTENT (used if Firestore is empty) --------
const DEFAULTS = {
  hero: {
    badge: "Available for new projects",
    title: "Hi, I'm Mamunur Rashid",
    subtitle: "Digital Growth Expert",
    skills: "Web Development • Shopify Expert • AI Automation • Meta & Google Ads",
    stats: [
      { value: "5+", label: "Years Experience" },
      { value: "100+", label: "Projects Completed" },
      { value: "50+", label: "Happy Clients" },
      { value: "99%", label: "Client Satisfaction" }
    ]
  },
  about: {
    label: "About Me",
    title: "Turning Digital Challenges into Growth Opportunities",
    p1: "I'm Mamunur Rashid, a passionate digital professional dedicated to helping businesses thrive in the online world. With expertise spanning web development, Shopify customization, AI automation, and performance marketing, I deliver comprehensive solutions that drive real results.",
    p2: "My approach combines technical excellence with strategic thinking. Whether you need a stunning website, an optimized e-commerce store, or high-converting ad campaigns, I bring the same level of dedication and expertise to every project.",
    image: "Mamunur-Rashid.png",
    highlights: [
      { title: "Proven Expertise", desc: "Years of hands-on experience in web development and digital marketing." },
      { title: "Result-Driven", desc: "Focused on delivering measurable outcomes that grow your business." },
      { title: "Innovative Solutions", desc: "Leveraging the latest technologies to solve complex challenges." }
    ]
  },
  services: [
    { title: "Web Development", desc: "Custom, responsive websites built with modern technologies that convert visitors into customers.", features: ["Custom Design","Responsive","SEO Optimized","Fast Loading"] },
    { title: "Shopify Development", desc: "Professional Shopify stores with custom themes, seamless checkout, and conversion optimization.", features: ["Theme Customization","App Integration","Payment Setup","Store Migration"] },
    { title: "AI Automation", desc: "Streamline your business operations with intelligent automation solutions powered by AI.", features: ["Workflow Automation","Chatbots","Data Processing","Integration"] },
    { title: "SEO Expert", desc: "Boost your online visibility with proven SEO strategies that drive organic traffic and rankings.", features: ["Keyword Optimization","On-Page SEO","Technical SEO","Link Building"] },
    { title: "Meta Ads", desc: "Strategic Facebook and Instagram advertising campaigns that reach your ideal customers.", features: ["Campaign Strategy","Audience Targeting","Creative Design","Performance Tracking"] },
    { title: "Google Ads", desc: "High-performing Google Ads campaigns that drive qualified traffic and maximize ROI.", features: ["Keyword Research","Ad Copywriting","Bid Management","Conversion Tracking"] }
  ],
  portfolio: [
    { title: "E-Commerce Store", cat: "Shopify Development", desc: "A fully customized Shopify store with optimized checkout and conversion tracking.", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop", overview: "Built a polished online store experience.", features: ["Custom Shopify theme","Mobile-first product pages","Optimized checkout","Conversion tracking"], results: ["Improved buyer journey","Cleaner store management","Better tracking"] },
    { title: "Business Website", cat: "Web Development", desc: "Modern, responsive business website with SEO optimization and fast loading.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop", overview: "Professional business website.", features: ["Responsive layouts","SEO-friendly","Fast loading","Clear contact"], results: ["Stronger online presence","Better mobile UX","More inquiries"] },
    { title: "AI Chatbot Integration", cat: "AI Automation", desc: "Intelligent chatbot solution that automated 70% of customer support queries.", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop", overview: "AI chatbot workflow.", features: ["Automated FAQ","Lead capture","Escalation","Tracking"], results: ["70% queries automated","Faster response","Consistent support"] },
    { title: "Ad Campaign", cat: "Meta & Google Ads", desc: "High-performing ad campaigns that achieved 5x ROAS for an e-commerce brand.", img: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&h=400&fit=crop", overview: "Paid ads strategy.", features: ["Strategy","Targeting","Creative testing","Reporting"], results: ["5x ROAS","Lower CPP","Scaled winners"] },
    { title: "Landing Page", cat: "Web Development", desc: "Conversion-optimized landing page with A/B testing and analytics integration.", img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=400&fit=crop", overview: "Focused landing page.", features: ["Conversion layout","Lead form","Analytics","A/B ready"], results: ["Better conversions","Cleaner data","Faster page"] },
    { title: "SEO Optimization", cat: "SEO Expert", desc: "Comprehensive SEO strategy that increased organic traffic by 200% in 6 months.", img: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&h=400&fit=crop", overview: "Technical + content SEO.", features: ["Keyword research","Tech audit","On-page SEO","Content plan"], results: ["+200% organic traffic","Better visibility","Cleaner foundation"] }
  ],
  whyMe: {
    label: "Why Choose Me",
    title: "A Partner Committed to Your Online Business",
    subtitle: "I don't just complete projects—I build lasting partnerships focused on driving real business results.",
    ctaHeading: "Ready to Transform Your Digital Presence?",
    ctaSubtext: "Let's discuss how I can help you achieve your business goals with tailored digital solutions.",
    reasons: [
      { title: "Result-Oriented Approach", desc: "Every decision I make is focused on achieving measurable outcomes.", points: ["Data-driven decision making","Clear KPIs and tracking","Continuous optimization"] },
      { title: "Clean & Scalable Solutions", desc: "I build systems that are not only beautiful but also maintainable and ready to scale.", points: ["Modern, clean code","Scalable architecture","Easy to maintain"] },
      { title: "Business-Focused Strategies", desc: "Every solution aligns with your strategic objectives.", points: ["ROI-focused planning","Competitive analysis","Growth-oriented tactics"] }
    ]
  },
  contact: {
    email: "mamun441998@gmail.com",
    phone: "+880 1978 529953",
    location: "Available Worldwide",
    whatsapp: "https://wa.me/8801978529953",
    linkedin: "https://www.linkedin.com/in/mamun441998/",
    facebook: "https://web.facebook.com/iammamun441998",
    instagram: "https://www.instagram.com/mamun441998/",
    github: "https://github.com/mamun441998"
  }
};

// -------- AUTH GUARD --------
const $ = (id) => document.getElementById(id);
const showAlert = (msg, type='info') => {
  const a = $('alert');
  a.className = 'alert alert-' + type;
  a.textContent = msg;
  a.classList.remove('hidden');
  if (type === 'success') setTimeout(() => a.classList.add('hidden'), 3500);
};

let state = JSON.parse(JSON.stringify(DEFAULTS));
let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace('login.html');
    return;
  }
  if (user.email && user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    await signOut(auth);
    window.location.replace('login.html');
    return;
  }
  currentUser = user;
  $('who-am-i').textContent = user.email;
  await loadContent();
  $('loading-screen').classList.add('hidden');
  $('dash').classList.remove('hidden');
  renderAll();
  initNav();
  initActions();
});

async function loadContent(){
  try {
    const snap = await getDoc(SITE_DOC);
    if (snap.exists()) {
      state = Object.assign({}, DEFAULTS, snap.data());
      // ensure subkeys exist
      state.hero = Object.assign({}, DEFAULTS.hero, state.hero);
      state.about = Object.assign({}, DEFAULTS.about, state.about);
      state.whyMe = Object.assign({}, DEFAULTS.whyMe, state.whyMe);
      state.contact = Object.assign({}, DEFAULTS.contact, state.contact);
    }
  } catch (e) {
    console.warn('Could not load content from Firestore. Using defaults.', e);
    showAlert('Could not load saved content. Showing defaults. Saving will create fresh content.', 'info');
  }
}

async function saveAll(){
  if (!currentUser) return;
  const btn = $('save-all-btn');
  btn.disabled = true;
  const orig = btn.textContent;
  btn.innerHTML = '<span class="spinner"></span> Saving...';
  try {
    collectFromForms();
    await setDoc(SITE_DOC, state, { merge: false });
    showAlert('All changes saved. Visitors will see the updates after refresh.', 'success');
  } catch (e) {
    console.error(e);
    showAlert('Save failed: ' + (e.message || 'Unknown error') + '. Check Firestore security rules.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

// -------- NAV / SECTION SWITCHING --------
function initNav(){
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l === link));
      document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.dataset.section === section));
      $('section-title').textContent = link.textContent.trim() + (section === 'whyme' ? ' Section' : ' Section');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function initActions(){
  $('save-all-btn').addEventListener('click', saveAll);
  $('logout-btn').addEventListener('click', async () => {
    await signOut(auth);
    window.location.replace('login.html');
  });
  $('add-service-btn').addEventListener('click', () => openServiceDrawer(null));
  $('add-project-btn').addEventListener('click', () => openProjectDrawer(null));
  $('drawer-cancel').addEventListener('click', closeDrawer);
  $('drawer-back').addEventListener('click', closeDrawer);
}

// -------- RENDERERS --------
function renderAll(){
  renderHero();
  renderAbout();
  renderServices();
  renderPortfolio();
  renderWhyMe();
  renderContact();
}

function renderHero(){
  $('hero-badge').value = state.hero.badge || '';
  $('hero-title').value = state.hero.title || '';
  $('hero-subtitle').value = state.hero.subtitle || '';
  $('hero-skills').value = state.hero.skills || '';
  const wrap = $('hero-stats');
  wrap.innerHTML = '';
  (state.hero.stats || []).forEach((s, i) => {
    wrap.insertAdjacentHTML('beforeend', `
      <div class="item-card">
        <div class="field"><label>Value</label><input class="input" data-stat="${i}" data-key="value" value="${escapeAttr(s.value)}"></div>
        <div class="field"><label>Label</label><input class="input" data-stat="${i}" data-key="label" value="${escapeAttr(s.label)}"></div>
      </div>`);
  });
}

function renderAbout(){
  $('about-label').value = state.about.label || '';
  $('about-title').value = state.about.title || '';
  $('about-p1').value = state.about.p1 || '';
  $('about-p2').value = state.about.p2 || '';
  $('about-image').value = state.about.image || '';
  const wrap = $('about-highlights');
  wrap.innerHTML = '';
  (state.about.highlights || []).forEach((h, i) => {
    wrap.insertAdjacentHTML('beforeend', `
      <div class="item-card" style="margin-bottom:.75rem">
        <div class="field"><label>Title #${i+1}</label><input class="input" data-highlight="${i}" data-key="title" value="${escapeAttr(h.title)}"></div>
        <div class="field"><label>Description</label><textarea class="textarea" data-highlight="${i}" data-key="desc">${escapeHtml(h.desc)}</textarea></div>
      </div>`);
  });
}

function renderServices(){
  const wrap = $('services-list');
  wrap.innerHTML = '';
  state.services.forEach((s, i) => {
    wrap.insertAdjacentHTML('beforeend', `
      <div class="item-card">
        <div class="item-title">${escapeHtml(s.title)}</div>
        <div class="item-meta">${escapeHtml((s.features || []).join(' • '))}</div>
        <div class="muted" style="font-size:.8rem">${escapeHtml((s.desc || '').slice(0,90))}${s.desc && s.desc.length>90?'…':''}</div>
        <div class="item-actions">
          <button class="btn btn-secondary btn-sm" data-edit-service="${i}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete-service="${i}">Delete</button>
        </div>
      </div>`);
  });
  wrap.querySelectorAll('[data-edit-service]').forEach(b => b.addEventListener('click', () => openServiceDrawer(parseInt(b.dataset.editService))));
  wrap.querySelectorAll('[data-delete-service]').forEach(b => b.addEventListener('click', () => {
    if (!confirm('Delete this service?')) return;
    state.services.splice(parseInt(b.dataset.deleteService), 1);
    renderServices();
  }));
}

function renderPortfolio(){
  const wrap = $('portfolio-list');
  wrap.innerHTML = '';
  state.portfolio.forEach((p, i) => {
    wrap.insertAdjacentHTML('beforeend', `
      <div class="item-card">
        <img class="thumb" src="${escapeAttr(p.img || '')}" alt="${escapeAttr(p.title)}" onerror="this.style.opacity='.3'">
        <div class="item-title">${escapeHtml(p.title)}</div>
        <div class="item-meta">${escapeHtml(p.cat || '')}</div>
        <div class="muted" style="font-size:.8rem">${escapeHtml((p.desc || '').slice(0,90))}${p.desc && p.desc.length>90?'…':''}</div>
        <div class="item-actions">
          <button class="btn btn-secondary btn-sm" data-edit-project="${i}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete-project="${i}">Delete</button>
        </div>
      </div>`);
  });
  wrap.querySelectorAll('[data-edit-project]').forEach(b => b.addEventListener('click', () => openProjectDrawer(parseInt(b.dataset.editProject))));
  wrap.querySelectorAll('[data-delete-project]').forEach(b => b.addEventListener('click', () => {
    if (!confirm('Delete this project?')) return;
    state.portfolio.splice(parseInt(b.dataset.deleteProject), 1);
    renderPortfolio();
  }));
}

function renderWhyMe(){
  $('why-label').value = state.whyMe.label || '';
  $('why-title').value = state.whyMe.title || '';
  $('why-subtitle').value = state.whyMe.subtitle || '';
  $('why-cta-heading').value = state.whyMe.ctaHeading || '';
  $('why-cta-subtext').value = state.whyMe.ctaSubtext || '';
  const wrap = $('why-reasons');
  wrap.innerHTML = '';
  (state.whyMe.reasons || []).forEach((r, i) => {
    wrap.insertAdjacentHTML('beforeend', `
      <div class="item-card" style="margin-bottom:.75rem">
        <div class="field"><label>Reason title #${i+1}</label><input class="input" data-reason="${i}" data-key="title" value="${escapeAttr(r.title)}"></div>
        <div class="field"><label>Description</label><textarea class="textarea" data-reason="${i}" data-key="desc">${escapeHtml(r.desc)}</textarea></div>
        <div class="field"><label>Points (one per line)</label><textarea class="textarea" data-reason="${i}" data-key="points">${escapeHtml((r.points || []).join('\n'))}</textarea></div>
      </div>`);
  });
}

function renderContact(){
  ['email','phone','location','whatsapp','linkedin','facebook','instagram','github'].forEach(k => {
    const el = $('contact-' + k);
    if (el) el.value = state.contact[k] || '';
  });
}

// -------- COLLECT FORM VALUES BACK INTO state --------
function collectFromForms(){
  state.hero.badge = $('hero-badge').value;
  state.hero.title = $('hero-title').value;
  state.hero.subtitle = $('hero-subtitle').value;
  state.hero.skills = $('hero-skills').value;
  state.hero.stats = (state.hero.stats || []).map((s, i) => ({
    value: document.querySelector(`[data-stat="${i}"][data-key="value"]`)?.value || s.value,
    label: document.querySelector(`[data-stat="${i}"][data-key="label"]`)?.value || s.label
  }));

  state.about.label = $('about-label').value;
  state.about.title = $('about-title').value;
  state.about.p1 = $('about-p1').value;
  state.about.p2 = $('about-p2').value;
  state.about.image = $('about-image').value;
  state.about.highlights = (state.about.highlights || []).map((h, i) => ({
    title: document.querySelector(`[data-highlight="${i}"][data-key="title"]`)?.value || h.title,
    desc: document.querySelector(`[data-highlight="${i}"][data-key="desc"]`)?.value || h.desc
  }));

  state.whyMe.label = $('why-label').value;
  state.whyMe.title = $('why-title').value;
  state.whyMe.subtitle = $('why-subtitle').value;
  state.whyMe.ctaHeading = $('why-cta-heading').value;
  state.whyMe.ctaSubtext = $('why-cta-subtext').value;
  state.whyMe.reasons = (state.whyMe.reasons || []).map((r, i) => ({
    title: document.querySelector(`[data-reason="${i}"][data-key="title"]`)?.value || r.title,
    desc: document.querySelector(`[data-reason="${i}"][data-key="desc"]`)?.value || r.desc,
    points: (document.querySelector(`[data-reason="${i}"][data-key="points"]`)?.value || (r.points||[]).join('\n'))
              .split('\n').map(s => s.trim()).filter(Boolean)
  }));

  ['email','phone','location','whatsapp','linkedin','facebook','instagram','github'].forEach(k => {
    state.contact[k] = $('contact-' + k).value;
  });
}

// -------- DRAWER (service / project edit) --------
let currentDrawer = null;

function openDrawer(html, onSave, onDelete, title){
  $('drawer-title').textContent = title;
  $('drawer-body').innerHTML = html;
  $('drawer').classList.add('open');
  $('drawer-back').classList.add('open');
  $('drawer').setAttribute('aria-hidden', 'false');
  $('drawer-save').onclick = () => { onSave(); closeDrawer(); };
  $('drawer-delete').onclick = () => { if (onDelete && confirm('Delete this item?')) { onDelete(); closeDrawer(); } };
  $('drawer-delete').style.display = onDelete ? '' : 'none';
}

function closeDrawer(){
  $('drawer').classList.remove('open');
  $('drawer-back').classList.remove('open');
  $('drawer').setAttribute('aria-hidden', 'true');
}

function openServiceDrawer(idx){
  const isNew = idx === null;
  const s = isNew ? { title:'', desc:'', features: [] } : state.services[idx];
  const html = `
    <div class="field"><label>Title</label><input class="input" id="d-svc-title" value="${escapeAttr(s.title)}"></div>
    <div class="field"><label>Description</label><textarea class="textarea" id="d-svc-desc">${escapeHtml(s.desc)}</textarea></div>
    <div class="field"><label>Features (one per line)</label><textarea class="textarea" id="d-svc-features">${escapeHtml((s.features||[]).join('\n'))}</textarea></div>`;
  openDrawer(html, () => {
    const obj = {
      title: $('d-svc-title').value.trim(),
      desc: $('d-svc-desc').value.trim(),
      features: $('d-svc-features').value.split('\n').map(x => x.trim()).filter(Boolean)
    };
    if (isNew) state.services.push(obj); else state.services[idx] = obj;
    renderServices();
  }, isNew ? null : () => { state.services.splice(idx,1); renderServices(); }, isNew ? 'Add service' : 'Edit service');
}

function openProjectDrawer(idx){
  const isNew = idx === null;
  const p = isNew ? { title:'', cat:'', desc:'', img:'', overview:'', features:[], results:[] } : state.portfolio[idx];
  const html = `
    <div class="field"><label>Title</label><input class="input" id="d-prj-title" value="${escapeAttr(p.title)}"></div>
    <div class="field"><label>Category</label><input class="input" id="d-prj-cat" value="${escapeAttr(p.cat)}"></div>
    <div class="field"><label>Image URL (paste full https URL)</label><input class="input" id="d-prj-img" value="${escapeAttr(p.img)}"></div>
    <div class="field"><label>Short description (card)</label><textarea class="textarea" id="d-prj-desc">${escapeHtml(p.desc)}</textarea></div>
    <div class="field"><label>Overview (project page)</label><textarea class="textarea" id="d-prj-overview">${escapeHtml(p.overview || '')}</textarea></div>
    <div class="field"><label>Features (one per line)</label><textarea class="textarea" id="d-prj-features">${escapeHtml((p.features||[]).join('\n'))}</textarea></div>
    <div class="field"><label>Results (one per line)</label><textarea class="textarea" id="d-prj-results">${escapeHtml((p.results||[]).join('\n'))}</textarea></div>`;
  openDrawer(html, () => {
    const obj = {
      title: $('d-prj-title').value.trim(),
      cat: $('d-prj-cat').value.trim(),
      img: $('d-prj-img').value.trim(),
      desc: $('d-prj-desc').value.trim(),
      overview: $('d-prj-overview').value.trim(),
      features: $('d-prj-features').value.split('\n').map(x => x.trim()).filter(Boolean),
      results: $('d-prj-results').value.split('\n').map(x => x.trim()).filter(Boolean)
    };
    if (isNew) state.portfolio.push(obj); else state.portfolio[idx] = obj;
    renderPortfolio();
  }, isNew ? null : () => { state.portfolio.splice(idx,1); renderPortfolio(); }, isNew ? 'Add project' : 'Edit project');
}

// -------- HELPERS --------
function escapeHtml(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s){ return escapeHtml(s); }
