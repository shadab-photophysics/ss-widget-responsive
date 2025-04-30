// embed.js (root of ss-widget-responsive)
(function () {
  // ───── 1) Mount-point: auto-create container ─────
  const placeholder = document.currentScript.parentNode;
  const container = document.createElement("div");
  container.id = "ss-structure-widget";
  placeholder.appendChild(container);

  // ───── 2) Base URL for assets ─────
  const BASE = "https://secondary-structure.netlify.app/";

  // ───── 3) Monkey-patch Image so relative src → absolute BASE+src ─────
  const NativeImage = window.Image;
  window.Image = function (width, height) {
    const img = new NativeImage(width, height);
    Object.defineProperty(img, "src", {
      set(v) {
        let url = v;
        // only rewrite relative URLs (no protocol)
        if (!/^(?:[a-z]+:)?\/\//i.test(v)) {
          url = new URL(v, BASE).href;
        }
        NativeImage.prototype.src.setter.call(this, url);
      },
      get() {
        return NativeImage.prototype.src.getter.call(this);
      },
      configurable: true,
      enumerable: true,
    });
    return img;
  };
  window.Image.prototype = NativeImage.prototype;

  // ───── 4) Helpers to load CSS and JS ─────
  function loadCSS(href) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false; // preserve order
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.body.appendChild(s);
    });
  }

  // ───── 5) The main embedding flow ─────
  (async function () {
    try {
      // 5A) Fetch the Netlify page HTML
      const res = await fetch(BASE);
      if (!res.ok) throw new Error("Fetch failed: " + res.status);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, "text/html");

      // 5B) Inject its <body> markup
      container.innerHTML = doc.body.innerHTML;

      // 5C) Load your CSS (any url(...) inside will resolve at BASE)
      loadCSS(BASE + "style.css");

      // 5D) Sequentially load all JS (skipping the 404 one)
      await loadScript(BASE + "jsmol/jsmol/JSmol.min.js");
      await loadScript(BASE + "controls.js");
      await loadScript(BASE + "subviews.js");
      await loadScript(BASE + "ramachandran.js");
      await loadScript(BASE + "moleculeLoaded.js");
      await loadScript(BASE + "builder.js");

      // 5E) Finally kick off that missing initializer
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
