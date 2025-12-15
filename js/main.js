(function () {
  // ===== Diccionario de idiomas =====
  const I18N = {
    esp: {
      _meta: { lang: "es", dir: "ltr" },
      nav: {
        test: "人",
        about: "Conócenos",
        booking: "Reservas",
        menu: "Menú",
        login: "Login"
      },
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
        sub: "Sabor auténtico en cada 人rroz"
      },
      footer: { copy: "© J人N S.A" },

      // === NUEVO: Página CONÓCENOS ===
      conocenos: {
        page: {
          title: "Conócenos",
          text: `
Somos <b>Noha, Javi y Adhan</b>, tres apasionados por la cocina japonesa.  
Creamos <b>J人N</b> para traer a tu mesa lo que más amamos:  
una mezcla entre tradición, creatividad y sabores que cuentan historias.  

Nuestro objetivo es simple:  
<b>que cada bocado te transporte a Japón sin salir de aquí.</b>

Gracias por formar parte de esta experiencia.`
        }
      },

      // === NUEVO: Página RESERVAS ===
      reservas: {
        page: { title: "Reservas" },
        form: {
          name: "Nombre",
          people: "Número de personas",
          date: "Fecha",
          time: "Hora",
          comments: "Comentarios",
          submit: "Confirmar reserva"
        },
        confirmation: {
          ok: "¡Reserva enviada correctamente!",
          back: "Volver"
        }
      }
    },

    // ===== CATALÀ =====
    cat: {
      _meta: { lang: "ca", dir: "ltr" },
      nav: {
        test: "人",
        about: "Coneix-nos",
        booking: "Reserves",
        menu: "Menú",
        login: "Inicia sessió"
      },
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
        sub: "Sabor autèntic a cada 人rros"
      },
      footer: { copy: "© J人N S.A" },

      conocenos: {
        page: {
          title: "Coneix-nos",
          text: `
Som <b>Noha, Javi i Adhan</b>, tres apassionats per la cuina japonesa.  
Vam crear <b>J人N</b> amb la idea de portar-te sabors tradicionals amb un toc creatiu.  

El nostre objectiu és clar:  
<b>que cada mos et transporti al Japó sense sortir d’aquí.</b>

Gràcies per formar part d’aquesta experiència.`
        }
      },

      reservas: {
        page: { title: "Reserves" },
        form: {
          name: "Nom",
          people: "Nombre de persones",
          date: "Data",
          time: "Hora",
          comments: "Comentaris",
          submit: "Confirmar reserva"
        },
        confirmation: {
          ok: "Reserva enviada correctament!",
          back: "Tornar"
        }
      }
    },

    // ===== ENGLISH =====
    eng: {
      _meta: { lang: "en", dir: "ltr" },
      nav: {
        test: "人",
        about: "About Us",
        booking: "Bookings",
        menu: "Menu",
        login: "Login"
      },
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
        sub: "Authentic fl人vor in every rice"
      },
      footer: { copy: "© J人N S.A" },

      conocenos: {
        page: {
          title: "About Us",
          text: `
We are <b>Noha, Javi and Adhan</b>, three lovers of Japanese cuisine.  
We created <b>J人N</b> to bring the flavors we love directly to your table.  

Our goal is simple:  
<b>each bite should transport you to Japan.</b>

Thank you for being part of this experience.`
        }
      },

      reservas: {
        page: { title: "Bookings" },
        form: {
          name: "Name",
          people: "Number of people",
          date: "Date",
          time: "Time",
          comments: "Comments",
          submit: "Confirm booking"
        },
        confirmation: {
          ok: "Booking successfully sent!",
          back: "Back"
        }
      }
    }
  };

  // === UTILIDADES ===
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  function getByPath(obj, path) {
    return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
  }

  function applyI18n(langCode) {
    const dict = I18N[langCode] || I18N.esp;
    document.documentElement.lang = dict._meta.lang;
    document.documentElement.dir = dict._meta.dir;

    // textos normales (incluye innerHTML)
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = getByPath(dict, key);
      if (typeof val === "string") el.innerHTML = val;
    });

    // placeholders
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = getByPath(dict, key);
      if (typeof val === "string") {
        el.setAttribute("placeholder", val);
        el.setAttribute("aria-label", val);
      }
    });

    const sel = $("#lang");
    if (sel && sel.value !== langCode) sel.value = langCode;
    try { localStorage.setItem("lang", langCode); } catch {}
  }

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("langDropdown");
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");

  const select = document.getElementById("lang"); // el select oculto
  const btnFlag = document.getElementById("langBtnFlag");
  const btnText = document.getElementById("langBtnText");

  if (!dropdown || !btn || !menu || !select || !btnFlag || !btnText) return;

  function openMenu() {
    dropdown.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    menu.focus();
  }

  function closeMenu() {
    dropdown.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  function setLang(value, flagPath) {
    // 1) Actualiza UI
    btnText.textContent = value.toUpperCase();
    btnFlag.src = flagPath;

    // 2) Actualiza el select oculto (para compatibilidad con tu i18n)
    select.value = value;

    // 3) Dispara el change por si tu i18n escucha ese evento
    select.dispatchEvent(new Event("change", { bubbles: true }));

    // 4) Marca selected en el menú
    [...menu.querySelectorAll("li[data-lang]")].forEach(li => {
      li.setAttribute("aria-selected", li.dataset.lang === value ? "true" : "false");
    });

    closeMenu();
  }

  // Toggle
  btn.addEventListener("click", () => {
    dropdown.classList.contains("open") ? closeMenu() : openMenu();
  });

  // Click opción
  menu.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-lang]");
    if (!li) return;
    setLang(li.dataset.lang, li.dataset.flag);
  });

  // Teclado (Enter/Espacio sobre opción)
  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      btn.focus();
    }
    if (e.key === "Enter" || e.key === " ") {
      const li = document.activeElement?.closest?.("li[data-lang]");
      if (!li) return;
      e.preventDefault();
      setLang(li.dataset.lang, li.dataset.flag);
    }
  });

  // Cerrar al click fuera
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) closeMenu();
  });

  // Inicializa según el valor actual del select (por si lo cargas guardado)
  const current = select.value || "esp";
  const currentLi = menu.querySelector(`li[data-lang="${current}"]`);
  if (currentLi) setLang(current, currentLi.dataset.flag);
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("hamburguer");
  const menu = document.getElementById("mobileMenu");

  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  // Cierra al hacer click en un enlace
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) menu.classList.remove("open");
  });

  // Cierra al click fuera
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.classList.remove("open");
    }
  });

  // ESC para cerrar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menu.classList.remove("open");
  });
});
