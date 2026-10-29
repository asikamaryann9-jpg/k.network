// Shared K.NETWORKING front-end interactions.
document.addEventListener("DOMContentLoaded", () => {
  // Updates the footer year.
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

  // Opens and closes the mobile navigation.
  const menu = document.querySelector(".menu");
  const links = document.querySelector(".links");
  if (menu && links) {
    menu.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.textContent = open ? "×" : "☰";
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      links.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
      menu.textContent = "☰";
    }));
  }

  // Animates the sample statistics when visible.
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        const start = performance.now();
        const update = now => {
          const progress = Math.min((now - start) / 1000, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        obs.unobserve(el);
      });
    }, {threshold: .5});
    counters.forEach(counter => observer.observe(counter));
  }

  // Shows and hides demo passwords.
  document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.textContent = show ? "Hide" : "Show";
    });
  });

  // Handles demo contact, login, and registration forms locally.
  document.querySelectorAll(".demo-form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const feedback = form.querySelector(".feedback");
      const password = form.querySelector('[name="password"]');
      const confirm = form.querySelector('[name="confirmPassword"]');
      if (password && confirm && password.value !== confirm.value) {
        if (feedback) {
          feedback.textContent = "The demo passwords do not match. Please check them.";
          feedback.classList.add("error");
        }
        confirm.focus();
        return;
      }
      if (feedback) {
        feedback.classList.remove("error");
        const type = form.dataset.type;
        feedback.textContent = type === "login"
          ? "Demo only: browser validation passed. No account was authenticated and no credentials were saved."
          : type === "register"
          ? "Demo only: validation passed. No account was created and no information was sent or saved."
          : "Demo only: validation passed. Your message was not sent or stored. Connect a form service to enable delivery.";
      }
      form.reset();
    });
  });

  // Makes newsletter forms show local demo feedback.
  document.querySelectorAll(".newsletter").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const note = form.querySelector("small");
      if (!input || !input.checkValidity()) { input?.reportValidity(); return; }
      if (note) note.textContent = "Demo only — no subscription was created and no email was stored.";
      form.reset();
    });
  });

  // Filters the Insights page articles by text and category.
  const search = document.querySelector("#article-search");
  const cards = [...document.querySelectorAll(".searchable")];
  const filters = document.querySelectorAll("[data-filter]");
  const noResults = document.querySelector(".no-results");
  let category = "all";
  const applyFilters = () => {
    if (!cards.length) return;
    const query = (search?.value || "").trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const matchesCategory = category === "all" || card.dataset.category === category;
      const matchesText = card.textContent.toLowerCase().includes(query);
      const visible = matchesCategory && matchesText;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (noResults) noResults.hidden = shown > 0;
  };
  search?.addEventListener("input", applyFilters);
  filters.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.filter || "all";
    filters.forEach(item => item.classList.toggle("active", item === button));
    applyFilters();
  }));
});
