/* ═══════════════════════════════════════════════════════
   MANMIN 공조 덕트 규격 산정 시스템 — Service Worker
   Ver 2.0  |  캐시 우선 · 오프라인 지원
═══════════════════════════════════════════════════════ */

const CACHE_VER    = 'manmin-duct-v2.0';
const CDN_CACHE    = 'manmin-cdn-v2.0';

// 앱 시작에 필요한 핵심 파일 (즉시 선캐시)
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/icon-192x192-maskable.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.ico'
];

// 네트워크 우선 처리할 CDN 도메인
const CDN_ORIGINS = [
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com'
];

// ── Install: 핵심 파일 선캐시 ──────────────────────────
self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_VER).then(function(cache){
      return cache.addAll(PRECACHE);
    })
  );
});

// ── Activate: 구버전 캐시 정리 ───────────────────────────
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_VER && k !== CDN_CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

// ── Fetch: 전략 분기 ─────────────────────────────────────
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var url = new URL(e.request.url);

  // CDN → 네트워크 우선, 실패 시 캐시 폴백
  if(CDN_ORIGINS.some(function(o){ return url.hostname === o; })){
    e.respondWith(networkFirst(e.request, CDN_CACHE));
    return;
  }
  // 로컬 파일 → 캐시 우선, 미스 시 네트워크 후 캐시 저장
  if(url.origin === self.location.origin){
    e.respondWith(cacheFirst(e.request, CACHE_VER));
    return;
  }
});

function cacheFirst(req, cacheName){
  return caches.match(req).then(function(cached){
    if(cached) return cached;
    return fetch(req).then(function(res){
      if(!res || res.status !== 200 || res.type === 'opaque') return res;
      var clone = res.clone();
      caches.open(cacheName).then(function(c){ c.put(req, clone); });
      return res;
    }).catch(function(){ return new Response('오프라인 상태입니다.', {status:503}); });
  });
}

function networkFirst(req, cacheName){
  return fetch(req).then(function(res){
    if(!res || res.status !== 200) return res;
    var clone = res.clone();
    caches.open(cacheName).then(function(c){ c.put(req, clone); });
    return res;
  }).catch(function(){
    return caches.match(req).then(function(cached){ return cached || Response.error(); });
  });
}

// ── 업데이트 메시지 수신 ────────────────────────────────
self.addEventListener('message', function(e){
  if(e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
