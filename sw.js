const CACHE='animeq-v1';
const ASSETS=['/','/index.html','/anime.json','/news.json','/manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method==='GET'&&url.origin===location.origin){
    e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>cached)));
    return;
  }
  if(url.hostname.includes('myanimelist')||url.hostname.includes('anilist')){
    e.respondWith(caches.match(e.request).then(cached=>{const fetchPromise=fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>cached);return cached||fetchPromise}));
  }
});
