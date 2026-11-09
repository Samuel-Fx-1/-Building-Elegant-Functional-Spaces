(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("primary-nav");
  const body = document.body;

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    body.classList.remove("nav-open");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      body.classList.toggle("nav-open", isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 991) closeNav();
    });
  }

  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themeColors = { light: "#024768", dark: "#07171f" };

  const storedTheme = () => {
    try {
      const value = localStorage.getItem("theme");
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  };

  const applyTheme = (theme, persist = false) => {
    const isDark = theme === "dark";
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? themeColors.dark : themeColors.light);
    }

    if (themeToggle) {
      const label = isDark ? "Switch to light mode" : "Switch to dark mode";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.title = label;
    }

    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (error) {
        /* Storage can be unavailable in private or embedded contexts. */
      }
    }
  };

  applyTheme(storedTheme() || (themeQuery.matches ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
  }

  const handleSystemTheme = (event) => {
    if (!storedTheme()) applyTheme(event.matches ? "dark" : "light");
  };

  if (typeof themeQuery.addEventListener === "function") {
    themeQuery.addEventListener("change", handleSystemTheme);
  } else if (typeof themeQuery.addListener === "function") {
    themeQuery.addListener(handleSystemTheme);
  }

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

  if (revealItems.length > 0) {
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );

      revealItems.forEach((item) => revealObserver.observe(item));
    }
  }

  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    const status =
      form.parentElement.querySelector("[data-newsletter-status]") ||
      document.querySelector("[data-newsletter-status]");
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (status) {
        status.textContent = "";
        status.classList.remove("is-visible", "is-error");
      }

      const email = form.querySelector('input[name="email"]');

      if (!email || !email.value.trim()) {
        if (email) email.reportValidity();
        return;
      }

      if (!email.checkValidity()) {
        email.reportValidity();
        return;
      }

      if (button) {
        button.dataset.label = button.textContent.trim();
        button.disabled = true;
        button.textContent = "Subscribing…";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Something went wrong. Please try again.");
        }

        form.reset();

        if (status) {
          status.textContent = data.message || "You're on the list!";
          status.classList.add("is-visible");
        }
      } catch (error) {
        if (status) {
          status.textContent = error.message;
          status.classList.add("is-visible", "is-error");
        }
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = button.dataset.label || "Subscribe Now";
        }
      }
    });
  });
})();
