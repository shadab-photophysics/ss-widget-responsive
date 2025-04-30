// embed.js — put this at the root of ss-widget-responsive and redeploy
(function () {
  // ─── 1) mount-point (auto) ───
  const placeholder = document.currentScript.parentNode;
  const container = document.createElement("div");
  container.id = "ss-structure-widget";
  placeholder.appendChild(container);

  // ─── 2) base URL ───
  const BASE = "https://secondary-structure.netlify.app/";

  // ─── 3) patch all Image src assignments ───
  const imgProto = HTMLImageElement.prototype;
  const srcDesc = Object.getOwnPropertyDescriptor(imgProto, "src");
  if (srcDesc && srcDesc.set) {
    Object.defineProperty(imgProto, "src", {
      get: srcDesc.get,
      set(v) {
        // rewrite only relative URLs
        const url =
          v && !/^(?:[a-z]+:)?\/\//i.test(v) ? new URL(v, BASE).href : v;
        srcDesc.set.call(this, url);
      },
      configurable: true,
      enumerable: true,
    });
  }

  // ─── 4) load style.css so CSS url(...) resolves relative to BASE ───
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = BASE + "style.css";
  document.head.appendChild(link);

  // ─── 5) helper to load scripts in sequence ───
  function loadScript(path) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = path;
      s.async = false; // preserve order
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load " + path));
      document.head.appendChild(s);
    });
  }

  // ─── 6) main flow: fetch HTML, inject body, then load JS ───
  (async function () {
    try {
      // 6A) fetch and parse index.html
      const res = await fetch(BASE);
      if (!res.ok) throw new Error("Fetch failed: " + res.status);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      // 6B) inject body markup
      container.innerHTML = doc.body.innerHTML;

      // 6C) load your scripts in the exact order needed
      await loadScript(BASE + "jsmol/jsmol/JSmol.min.js");
      // InstrumentHooks.js 404s, so we skip it
      await loadScript(BASE + "controls.js");
      await loadScript(BASE + "subviews.js");
      await loadScript(BASE + "ramachandran.js");
      await loadScript(BASE + "moleculeLoaded.js");
      await loadScript(BASE + "builder.js");

      // 6D) finally initialize the text‐control playground
      if (typeof mainTextControl === "function") {
        mainTextControl();
      }
    } catch (err) {
      console.error("Embed error:", err);
      container.innerHTML =
        '<p style="color:red;">Embed error:<br>' + err.message + "</p>";
    }
  })();
})();
