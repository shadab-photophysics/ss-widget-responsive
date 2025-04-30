// embed.js (place this in your repo root and redeploy)
(function () {
  // 1) find the <script> tag that loaded this and use its parent as mount-point
  const placeholder = document.currentScript.parentNode;
  // 2) create a container div
  const container = document.createElement("div");
  container.id = "ss-structure-widget";
  placeholder.appendChild(container);

  const BASE = "https://secondary-structure.netlify.app/";

  // helper to load CSS
  function loadCSS(href) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }
  // helper to load JS in sequence
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.body.appendChild(s);
    });
  }

  (async function () {
    try {
      // A) fetch your Netlify page
      const res = await fetch(BASE);
      if (!res.ok) throw new Error("Fetch failed: " + res.status);
      const html = await res.text();

      // B) parse and inject the <body> HTML
      const doc = new DOMParser().parseFromString(html, "text/html");
      container.innerHTML = doc.body.innerHTML;

      // ↓ NEW: rewrite every img src to absolute
      Array.from(container.querySelectorAll("img")).forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !/^(https?:)?\/\//.test(src)) {
          img.src = new URL(src, BASE).href;
        }
      });

      // C) inject the CSS
      loadCSS(BASE + "style.css");

      // D) load scripts in order (skipping the 404ing InstrumentHooks.js)
      await loadScript(BASE + "jsmol/jsmol/JSmol.min.js");
      await loadScript(BASE + "controls.js");
      await loadScript(BASE + "subviews.js");
      await loadScript(BASE + "ramachandran.js");
      await loadScript(BASE + "moleculeLoaded.js");
      await loadScript(BASE + "builder.js");

      // E) finally initialize the text-control playground
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
