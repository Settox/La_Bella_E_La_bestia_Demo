const tabs=[...document.querySelectorAll('.tab')];
const panels=[...document.querySelectorAll('.panel')];
const nav=document.querySelector('.nav-tabs');
const menu=document.querySelector('.menu-btn');

function showTab(id){
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.tab===id));
  panels.forEach(p=>p.classList.toggle('active',p.id===id));
  history.replaceState(null,'','#'+id);
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'smooth'});
}

tabs.forEach(t=>t.addEventListener('click',()=>showTab(t.dataset.tab)));
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();showTab('home')});
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});

const initial=location.hash.slice(1); if(initial&&document.getElementById(initial)) showTab(initial);

const modals=[...document.querySelectorAll('.modal')];
function openModal(id){const modal=document.getElementById(id); if(!modal)return; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); const close=modal.querySelector('.modal-close'); if(close)close.focus();}
function closeModal(modal){modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open');}
document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.modal)));
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',()=>closeModal(el.closest('.modal'))));
document.addEventListener('keydown',e=>{if(e.key==='Escape')modals.filter(m=>m.classList.contains('open')).forEach(closeModal);});

// Gestione consenso cookie: attiva servizi facoltativi (es. mappa) solo dopo conferma dell'utente.
(function(){
  const banner=document.getElementById('cookie-banner');
  const settings=document.getElementById('cookie-settings-panel');
  const reopen=document.getElementById('cookie-reopen');
  const mapConsent=document.getElementById('map-consent');
  const key='lb_cookie_consent';
  function get(){return document.cookie.split('; ').find(x=>x.startsWith(key+'='))?.split('=')[1]||null}
  function set(v){document.cookie=key+'='+v+'; max-age=15552000; path=/; SameSite=Lax'}
  function showMap(){
    if(!mapConsent)return;
    const iframe=document.createElement('iframe'); iframe.title='Google Maps - La Bella e La Bestia'; iframe.loading='lazy'; iframe.src='https://www.google.com/maps?q=Via%20alla%20Volta%2010%2C%2023827%20Lierna%20LC&output=embed'; mapConsent.replaceWith(iframe);
  }
  function apply(v){if(v==='all')showMap();}
  const existing=get();
  if(!existing){banner.hidden=false;reopen.hidden=true;} else {banner.hidden=true; apply(existing);}
  document.getElementById('cookie-accept').onclick=()=>{set('all');banner.hidden=true;reopen.hidden=false;showMap()};
  document.getElementById('cookie-reject').onclick=()=>{set('necessary');banner.hidden=true;reopen.hidden=false};
  document.getElementById('cookie-settings').onclick=()=>{settings.hidden=false;document.getElementById('cookie-thirdparty').checked=false};
  document.getElementById('cookie-settings-close').onclick=()=>settings.hidden=true;
  document.getElementById('cookie-save').onclick=()=>{const v=document.getElementById('cookie-thirdparty').checked?'all':'necessary';set(v);settings.hidden=true;banner.hidden=true;reopen.hidden=false;apply(v)};
  reopen.querySelector('button').onclick=()=>{settings.hidden=false;document.getElementById('cookie-thirdparty').checked=get()==='all'};
  document.querySelectorAll('.cookie-link').forEach(x=>x.onclick=()=>{settings.hidden=true;openModal('privacy-modal')});
  document.getElementById('load-map')?.addEventListener('click',()=>{set('all');showMap();banner.hidden=true;reopen.hidden=false});
})();
