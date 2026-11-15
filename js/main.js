(() => {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const setScrolled = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  if (toggle && nav && menu) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = open ? "hidden" : "";
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
        document.body.style.overflow = "";
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.36)}s`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
