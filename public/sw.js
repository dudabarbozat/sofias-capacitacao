/* Service worker da Sofias: guarda o app para abrir sem internet e serve os módulos baixados. */
const VERSAO = "v3-1";
const CACHE_APP = "sofias-app-" + VERSAO;
const CACHE_PAGINAS = "sofias-paginas-" + VERSAO;
const CACHE_MODULOS = "sofias-modulos-v1";
const ESCOPO = new URL(self.registration.scope).pathname; // termina em "/"
const SHELL = ["", "offline/", "estudos/", "teste/", "certificado/", "manifest.webmanifest", "img/simbolo-sofias.png", "img/icone-192.png"].map((p) => ESCOPO + p);

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(CACHE_APP).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys().then((nomes) => Promise.all(nomes.filter((n) => n.startsWith("sofias-") && ![CACHE_APP, CACHE_PAGINAS, CACHE_MODULOS].includes(n)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

async function doCache(req) {
  return caches.match(req, { ignoreSearch: true });
}

async function redePrimeiro(req) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const c = await caches.open(CACHE_PAGINAS);
      c.put(req.url.split("?")[0], res.clone());
    }
    return res;
  } catch (e) {
    const salvo = await doCache(req);
    if (salvo) return salvo;
    if (req.mode === "navigate") {
      const inicio = await caches.match(ESCOPO + "offline/");
      if (inicio) return inicio;
    }
    throw e;
  }
}

async function cachePrimeiro(req) {
  const salvo = await doCache(req);
  if (salvo) return salvo;
  const res = await fetch(req);
  if (res.ok) {
    const c = await caches.open(CACHE_APP);
    c.put(req, res.clone());
  }
  return res;
}

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(ESCOPO)) return;
  if (url.pathname.includes("/_next/static/") || url.pathname.includes("/img/")) {
    ev.respondWith(cachePrimeiro(req));
  } else {
    ev.respondWith(redePrimeiro(req));
  }
});
