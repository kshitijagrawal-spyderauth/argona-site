document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");
navToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Product filter
const pills = document.querySelectorAll(".pill");
const cards = document.querySelectorAll(".product-card");
pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => {
      p.classList.remove("is-active");
      p.setAttribute("aria-selected", "false");
    });
    pill.classList.add("is-active");
    pill.setAttribute("aria-selected", "true");

    const filter = pill.dataset.filter;
    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !match);
    });
  });
});

// Quote form submission
const form = document.getElementById("quoteForm");
const status = document.getElementById("formStatus");
const submitBtn = document.getElementById("formSubmit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  status.className = "form-status";

  const data = new FormData(form);
  const payload = {
    name: data.get("name"),
    business: data.get("business"),
    email: data.get("email"),
    phone: data.get("phone"),
    category: data.get("category"),
    products: data.getAll("products"),
    notes: data.get("notes"),
  };

  if (!payload.name || !payload.business || !payload.email || !payload.category) {
    status.textContent = "Please fill in all required fields.";
    status.classList.add("is-error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  try {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("request failed");

    status.textContent = "Thanks — we'll send your rate sheet within 2 working days.";
    status.classList.add("is-ok");
    form.reset();
  } catch (err) {
    status.textContent = "Something went wrong. Please email sales@arvonachemicals.com directly.";
    status.classList.add("is-error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Request Quote";
  }
});
