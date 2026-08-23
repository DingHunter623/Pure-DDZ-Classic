const CACHE='pure-ddz-v1.1.0-overview-r1';
const ASSETS=[
  './',
  './index.html',
  './css/style.css?v=20260823-v110',
  './css/qilylean-theme.css?v=20260823-v110',
  './js/qilylean-theme.js?v=20260823-v110',
  './js/card-theme.js?v=20260823-v110',
  './js/ai-expert.js?v=20260823-v110',
  './js/game.js?v=20260823-v110',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/pure-ddz/avatar-king.webp',
  './assets/pure-ddz/airplane-joker.png'
];

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim())
));

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(
    caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }).catch(()=>caches.match('./index.html')))
  );
});
