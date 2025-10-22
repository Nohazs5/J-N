// ./js/main.js

(function () {
  // ===== Diccionario de idiomas =====
  const I18N = {
    esp: {
      _meta: { lang: "es", dir: "ltr" },
      nav: { test: "人", about: "Conócenos", booking: "Reservas", menu: "Menú", login: "Login" },
      bubbles: {
        tempura: "Tempuras",
        nigiri: "Niguiris",
        ramen: "Ramen",
        salads: "Ensaladas",
        maki: "Makis",
        specialChar: "人",
        gyoza: "Gyozas",
        drinks: "Bebidas",
        special: "Menú Especial",
        kids: "Menú Infantil"
      },
      slogans: {
        main: "Ven a J人N y verás que Ñ人M",
        sub:  "Sabor auténtico en cada 人rroz"
      },
      footer: { copy: "© J人N S.A" }
    },
    cat: {
      _meta: { lang: "ca", dir: "ltr" },
      nav: { test: "人", about: "Coneix-nos", booking: "Reserves", menu: "Menú", login: "Inicia sessió" },
      bubbles: {
        tempura: "Tempures",
        nigiri: "Nigiris",
        ramen: "Ramen",
        salads: "Amanides",
        maki: "Makis",
        specialChar: "人",
        gyoza: "Gyozes",
        drinks: "Begudes",
        special: "Menú Especial",
        kids: "Menú Infantil"
      },
      slogans: {
        main: "Vine a J人N i veuràs quin Ñ人M",
        sub:  "Sabor autèntic a cada 人rros"
      },
      footer: { copy: "© J人N S.A" }
    },
    eng: {
      _meta: { lang: "en", dir: "ltr" },
      nav: { test: "人", about: "About us", booking: "Bookings", menu: "Menu", login: "Login" },
      bubbles: {
        tempura: "Tempura",
        nigiri: "Nigiri",
        ramen: "Ramen",
        salads: "Salads",
        maki: "Maki",
        specialChar: "人",
        gyoza: "Gyoza",
        drinks: "Drinks",
        special: "Special Menu",
        kids: "Kids Menu"
      },
      slogans: {
        main: "Come to J人N and you'll go Ñ人M",
        sub:  "Authentic fl人vor in every rice"
      },
      footer: { copy: "© J人N S.A" }
    }
  };

  // Utilidades
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // Lee un valor por ruta "a.b.c" dentro de un objeto
  function getByPath(obj, path) {
    return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
  }

  // Aplica traducciones a todos los [data-i18n] y [data-i18n-placeholder]
  function applyI18n(langCode) {
    const dict = I18N[langCode] || I18N.esp;

    // meta de idioma
    document.documentElement.lang = dict._meta.lang;
    document.documentElement.dir = dict._meta.dir;

    // Texto normal
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = getByPath(dict, key);
      if (typeof val === "string") el.textContent = val;
    });

    // Placeholders
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = getByPath(dict, key);
      if (typeof val === "string") {
        el.setAttribute("placeholder", val);
        el.setAttribute("aria-label", val);
      }
    });

    // Sincroniza el <select> y guarda preferencia
    const sel = $("#lang");
    if (sel && sel.value !== langCode) sel.value = langCode;
    try { localStorage.setItem("lang", langCode); } catch {}
  }

  // Init
  function init() {
    const sel = $("#lang");
    if (!sel) return;

    const saved = (() => {
      try { return localStorage.getItem("lang") || "esp"; }
      catch { return "esp"; }
    })();

    sel.value = saved;
    applyI18n(saved);

    sel.addEventListener("change", (e) => applyI18n(e.target.value));
  }

  // Ejecuta cuando el DOM esté listo (tu script está sin defer en el <head>)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
