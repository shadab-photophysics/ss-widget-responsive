// embed.js (place in your repo root)
(function () {
  // 1) mount-point: script’s parent
  const placeholder = document.currentScript.parentNode;
  const container = document.createElement("div");
  container.id = "ss-structure-widget";
  placeholder.appendChild(container);

  const BASE = "https://secondary-structure.netlify.app/";

  // 2) fetch page & markup
  async function fetchBody() {
    const res = await fetch(BASE);
    if (!res.ok)
      throw new Error("Failed to fetch widget HTML (" + res.status + ")");
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    container.innerHTML = doc.body.innerHTML;
    return doc;
  }

  // 3) load + rewrite CSS
  async function loadAndRewriteCSS(href) {
    const res = await fetch(href);
    if (!res.ok) throw new Error("Failed to load CSS " + href);
    let css = await res.text();
    css = css.replace(/url\(\s*['"]?([^'"\)]+)['"]?\s*\)/g, (m, url) => {
      // skip absolute/data URLs
      if (/^(data:|https?:\/\/)/.test(url)) return `url(${url})`;
      const abs = new URL(url, href).href;
      return `url(${abs})`;
    });
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  // 4) load JS in sequence
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

  // 5) main flow
  (async function () {
    try {
      // A) fetch & inject body
      const doc = await fetchBody();

      // B) for each CSS <link>, load & rewrite it
      for (let link of doc.querySelectorAll('link[rel="stylesheet"]')) {
        const href = new URL(link.getAttribute("href"), BASE).href;
        await loadAndRewriteCSS(href);
      }
      // also inline styles
      doc.querySelectorAll("style").forEach((style) => {
        document.head.appendChild(style.cloneNode(true));
      });

      // C) load JS in the order you need
      await loadScript(BASE + "jsmol/jsmol/JSmol.min.js");
      // skip InstrumentHooks.js (404)
      await loadScript(BASE + "controls.js");
      await loadScript(BASE + "subviews.js");
      await loadScript(BASE + "ramachandran.js");
      await loadScript(BASE + "moleculeLoaded.js");
      await loadScript(BASE + "builder.js");

      // D) initialize playground
      if (typeof mainTextControl === "function") mainTextControl();
    } catch (err) {
      console.error(err);
      container.innerHTML =
        '<p style="color:red;">Embed error:<br>' + err.message + "</p>";
    }
  })();
})();
