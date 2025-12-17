// lead-capture.js
(function () {
  const SERVICE_ID = "service_dbstthl";
  const TEMPLATE_ID = "template_4jfreyb";

  function setStatus(form, type, message) {
    let el = form.querySelector(".form-status");
    if (!el) {
      el = document.createElement("div");
      el.className = "form-status";
      el.style.marginTop = "12px";
      el.style.fontSize = "14px";
      el.style.lineHeight = "1.4";
      form.appendChild(el);
    }

    el.textContent = message;
    el.style.color =
      type === "ok" ? "#1a7f37" : type === "loading" ? "#1a2332" : "#b42318";
  }

  function disableSubmit(form, disabled) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = disabled;
    btn.style.opacity = disabled ? "0.75" : "1";
    btn.style.cursor = disabled ? "not-allowed" : "pointer";
  }

  function formToObject(form) {
    const data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = String(value).trim();
    });
    return data;
  }

  async function submitHandler(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = formToObject(form);

    // Basic validation
    if (!data.name) return setStatus(form, "err", "Please enter your name.");
    if (!data.phone || data.phone.replace(/\D/g, "").length < 10) {
      return setStatus(form, "err", "Please enter a valid phone number.");
    }
    if (form.querySelector('[name="postcode"]') && !data.postcode) {
      return setStatus(form, "err", "Please enter your postcode.");
    }
    if (form.querySelector('[name="description"]') && !data.description) {
      return setStatus(form, "err", "Please describe the issue.");
    }

    // Metadata (helpful in emails)
    data.source_page = window.location.pathname;
    data.submitted_at = new Date().toISOString();

    if (!window.emailjs || typeof emailjs.send !== "function") {
      setStatus(form, "err", "Form system not loaded. Please refresh or call 020 7946 0958.");
      return;
    }

    try {
      disableSubmit(form, true);
      setStatus(form, "loading", "Sending…");

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, data);

      setStatus(form, "ok", "✅ Sent! We’ll contact you shortly.");
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus(form, "err", "❌ Couldn’t send. Please call 020 7946 0958 or WhatsApp us.");
    } finally {
      disableSubmit(form, false);
    }
  }

  function wireForm(id) {
    const form = document.getElementById(id);
    if (form) form.addEventListener("submit", submitHandler);
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireForm("home-form");
    wireForm("callback-form");
    wireForm("roofing-form");
    wireForm("carpentry-form");
  });
})();
