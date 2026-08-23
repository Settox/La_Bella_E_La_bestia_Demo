const tabs=[...document.querySelectorAll('.tab')];
const panels=[...document.querySelectorAll('.panel')];
const nav=document.querySelector('.nav-tabs');
const menu=document.querySelector('.menu-btn');

function showTab(id){
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.tab===id));
  panels.forEach(p=>p.classList.toggle('active',p.id===id));
  try { history.replaceState(null,'','#'+id); } catch (error) { window.location.hash=id; }
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'smooth'});
}

tabs.forEach(t=>t.addEventListener('click',()=>showTab(t.dataset.tab)));
document.querySelectorAll('.tab-link').forEach(t=>t.addEventListener('click',()=>showTab(t.dataset.tab)));
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();showTab('home')});
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});

const initial=location.hash.slice(1); if(initial&&document.getElementById(initial)) showTab(initial);

// Selettore tema chiaro/scuro: default chiaro, preferenza salvata in un cookie.
(function(){
  const key='lb_theme';
  const input=document.getElementById('theme-switch-input');
  function getCookie(){return document.cookie.split('; ').find(x=>x.startsWith(key+'='))?.split('=')[1]||null}
  function setCookie(v){document.cookie=key+'='+v+'; max-age=31536000; path=/; SameSite=Lax'}
  function apply(theme){
    document.body.classList.toggle('dark-theme',theme==='dark');
    if(input) input.checked=theme==='dark';
  }
  const saved=getCookie();
  apply(saved==='dark' ? 'dark' : 'light');
  input?.addEventListener('change',()=>{
    const theme=input.checked?'dark':'light';
    setCookie(theme);
    apply(theme);
  });
})();

const modals=[...document.querySelectorAll('.modal')];
function openModal(id){const modal=document.getElementById(id); if(!modal)return; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); const close=modal.querySelector('.modal-close'); if(close)close.focus();}
function closeModal(modal){modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open');}
document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.modal)));
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',()=>closeModal(el.closest('.modal'))));
document.addEventListener('keydown',e=>{if(e.key==='Escape')modals.filter(m=>m.classList.contains('open')).forEach(closeModal);});

// Gestione consenso cookie: Google Maps è caricato solo dopo il consenso e rimosso alla revoca.
(function(){
  const banner=document.getElementById('cookie-banner');
  const settings=document.getElementById('cookie-settings-panel');
  const reopen=document.getElementById('cookie-reopen');
  const mapConsent=document.getElementById('map-consent');
  const mapMarkup=mapConsent?.outerHTML;
  const key='lb_cookie_consent';
  function get(){return document.cookie.split('; ').find(x=>x.startsWith(key+'='))?.split('=')[1]||null}
  function set(v){document.cookie=key+'='+v+'; max-age=15552000; path=/; SameSite=Lax'}
  function showMap(){
    const placeholder=document.getElementById('map-consent');
    if(!placeholder||document.querySelector('iframe[data-thirdparty-map]'))return;
    const iframe=document.createElement('iframe'); iframe.title='Google Maps - La Bella e La Bestia'; iframe.loading='lazy'; iframe.dataset.thirdpartyMap='true'; iframe.src='https://www.google.com/maps?q=Via%20alla%20Volta%2010%2C%2023827%20Lierna%20LC&output=embed'; placeholder.replaceWith(iframe);
  }
  function hideMap(){
    const iframe=document.querySelector('iframe[data-thirdparty-map]');
    if(!iframe||!mapMarkup)return;
    const template=document.createElement('template'); template.innerHTML=mapMarkup.trim(); iframe.replaceWith(template.content);
  }
  function apply(v){if(v==='all')showMap();else hideMap();}
  const existing=get();
  if(!existing){banner.hidden=false;reopen.hidden=true;} else {banner.hidden=true; apply(existing);}
  document.getElementById('cookie-accept').onclick=()=>{set('all');banner.hidden=true;reopen.hidden=false;showMap()};
  document.getElementById('cookie-reject').onclick=()=>{set('necessary');banner.hidden=true;reopen.hidden=false;apply('necessary')};
  document.getElementById('cookie-settings').onclick=()=>{settings.hidden=false;document.getElementById('cookie-thirdparty').checked=get()==='all'};
  document.getElementById('cookie-settings-close').onclick=()=>settings.hidden=true;
  document.getElementById('cookie-save').onclick=()=>{const v=document.getElementById('cookie-thirdparty').checked?'all':'necessary';set(v);settings.hidden=true;banner.hidden=true;reopen.hidden=false;apply(v)};
  reopen.querySelector('button').onclick=()=>{settings.hidden=false;document.getElementById('cookie-thirdparty').checked=get()==='all'};
  document.querySelectorAll('.cookie-link').forEach(x=>x.onclick=()=>{settings.hidden=true;openModal('privacy-modal')});
  document.addEventListener('click',e=>{if(e.target.closest('#load-map')){set('all');showMap();banner.hidden=true;reopen.hidden=false}});
})();
