// Embed entrypoint — save as `embed.js` in the project root
(function () {
  // 1) Where we’ll mount the widget
  const placeholder = document.currentScript.parentNode;
  const container = document.createElement("div");
  container.id = "ss-structure-widget";
  placeholder.appendChild(container);

  // 2) Helper to load CSS
  function loadCSS(href) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  // 3) Helper to load JS in sequence
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

  // 4) Base URL of your Netlify site
  const BASE = "https://secondary-structure.netlify.app/";

  // 5) Load your CSS first
  loadCSS(BASE + "style.css");

  // 6) Then load the JSmol core + your widgets in the exact order they appear on your site:
  (async function () {
    try {
      await loadScript(BASE + "jsmol/jsmol/JSmol.min.js");
      await loadScript(BASE + "InstrumentHooks.js");
      await loadScript(BASE + "controls.js");
      await loadScript(BASE + "subviews.js");
      await loadScript(BASE + "ramachandran.js");
      await loadScript(BASE + "moleculeLoaded.js");
      await loadScript(BASE + "builder.js");

      // 7) Finally kick off the text-control playground
      if (typeof mainTextControl === "function") {
        mainTextControl();
      }
    } catch (err) {
      console.error(err);
      container.innerHTML =
        '<p style="color:red;">Failed to load Secondary-Structure widget:<br>' +
        err.message +
        "</p>";
    }
  })();
})();
