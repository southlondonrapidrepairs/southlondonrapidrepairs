// lead-capture.js
(function () {
  const SERVICE_ID = "service_dbstthl";
  const TEMPLATE_ID = "template_4jfreyb";
  const SUPPORT_NUMBER_DISPLAY = "020 8058 3861";
  const SUPPORT_TEL_LINK = "tel:+442080583861";
  const SUPPORT_WA_LINK = "https://wa.me/message/UQT7P5J26OYKC1";

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
      // If duplicate keys exist, the later one will win (fine for our use-case).
      data[key] = String(value).trim();
    });
    return data;
  }

  function normalizePostcode(pc) {
    if (!pc) return "";
    return pc.toUpperCase().replace(/\s+/g, "").trim();
  }

  async function submitHandler(e) {
    e.preventDefault();
    const form = e.currentTarget;

    // Capture callback preferred time (if present) BEFORE we create metadata fields
    const bestTimeEl = form.querySelector('select[name="time"]');
    const bestTime = bestTimeEl ? String(bestTimeEl.value || "").trim() : "";

    const data = formToObject(form);

    // Basic validation
    if (!data.name) return setStatus(form, "err", "Please enter your name.");

    if (!data.phone || data.phone.replace(/\D/g, "").length < 10) {
      return setStatus(form, "err", "Please enter a valid phone number.");
    }

    if (form.querySelector('[name="postcode"]')) {
      data.postcode = normalizePostcode(data.postcode);
      if (!data.postcode) return setStatus(form, "err", "Please enter your postcode.");
    }

    if (form.querySelector('[name="description"]') && !data.description) {
      return setStatus(form, "err", "Please describe the issue.");
    }

    // === Metadata for EmailJS ===
    const timestamp = new Date().toISOString();
    data.source_page = data.source_page || window.location.pathname;
    data.source_url = data.source_url || window.location.href;

    // Always send a submission timestamp (covers templates using either key)
    data.submitted_at = timestamp;
    data.time = timestamp; // legacy compatibility if your template uses {{time}}

    // Preserve preferred callback time (if it exists)
    if (bestTime) data.best_time = bestTime;

    // === Aliases to stop “empty fields” in EmailJS templates ===
    // Many templates use different variable names — these aliases reduce blanks.
    data.service_type =
      data.service_type ||
      data.emergency_type ||
      data.service ||
      "";

    data.issue =
      data.issue ||
      data.description ||
      "";

    data.urgency =
      data.urgency ||
      "Emergency";

    // In case your template includes email but your forms don't:
    data.email = data.email || "";

    if (!window.emailjs || typeof emailjs.send !== "function") {
      setStatus(
        form,
        "err",
        `Form system not loaded. Please refresh or call ${SUPPORT_NUMBER_DISPLAY}.`
      );
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
      setStatus(
        form,
        "err",
        `❌ Couldn’t send. Please call ${SUPPORT_NUMBER_DISPLAY} or WhatsApp us.`
      );
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
