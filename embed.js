// ─── embed.js (put in the root of your repo) ───
(function () {
  // 1) find the <script> tag that loaded this file, use its parent as mount-point
  const placeholder = document.currentScript.parentNode;

  // 2) create a container DIV and attach it
  const container = document.createElement("div");
  container.id = "ss-structure-widget";
  placeholder.appendChild(container);

  const BASE = "https://secondary-structure.netlify.app/";

  // helper: load a CSS file
  function loadCSS(href) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  // helper: load a JS file in sequence
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false; // preserve execution order
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.body.appendChild(s);
    });
  }

  // the main embedding flow
  (async function () {
    try {
      // A) fetch your Netlify page
      const res = await fetch(BASE);
      if (!res.ok)
        throw new Error("Failed to fetch widget HTML (" + res.status + ")");
      const html = await res.text();

      // B) parse the HTML, extract its <body>
      const doc = new DOMParser().parseFromString(html, "text/html");
      container.innerHTML = doc.body.innerHTML;

      // C) inject the CSS
      loadCSS(BASE + "style.css");

      // D) load the scripts in the order they’re referenced on your site
      //    (skipping InstrumentHooks.js since it 404s)
      await loadScript(BASE + "jsmol/jsmol/JSmol.min.js");
      await loadScript(BASE + "controls.js");
      await loadScript(BASE + "subviews.js");
      await loadScript(BASE + "ramachandran.js");
      await loadScript(BASE + "moleculeLoaded.js");
      await loadScript(BASE + "builder.js");

      // E) finally kick off the playground
      if (typeof mainTextControl === "function") {
        mainTextControl();
      }
    } catch (err) {
      console.error(err);
      container.innerHTML =
        '<p style="color:red;">Embed error:<br>' + err.message + "</p>";
    }
  })();
})();
