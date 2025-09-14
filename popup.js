// --- Single-select dropdown logic for School/Company Qualifications ---
function setupSingleSelectDropdown(btn, dropdown, tag, optionsList) {
  let selected = null;
  function closeDropdown() {
    dropdown.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }
  function openDropdown() {
    dropdown.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }
  function renderDropdown() {
    dropdown.innerHTML = optionsList
      .map((q) => `<div class="row" data-value="${q}">${q}</div>`)
      .join("");
  }
  function setTag(value) {
    if (!value) {
      tag.style.display = "none";
      tag.innerHTML = "";
      selected = null;
      return;
    }
    tag.innerHTML = `${value} <button class="remove-qual" title="Remove" aria-label="Remove">🗑️</button>`;
    tag.style.display = "";
    selected = value;
  }
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dropdown.hidden) {
      renderDropdown();
      openDropdown();
    } else {
      closeDropdown();
    }
  });
  dropdown.addEventListener("click", (e) => {
    const row = e.target.closest(".row");
    if (row) {
      setTag(row.dataset.value);
      closeDropdown();
    }
  });
  tag.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-qual")) {
      setTag(null);
    }
  });
  document.addEventListener("click", (e) => {
    if (!dropdown.hidden) closeDropdown();
  });
  // Expose for form usage
  return {
    getSelected: () => selected,
    setSelected: setTag,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const schoolBtn = document.getElementById("schoolDropdownBtn");
  const schoolDropdown = document.getElementById("schoolDropdown");
  const schoolTag = document.getElementById("schoolSelectedTag");
  const companyBtn = document.getElementById("companyDropdownBtn");
  const companyDropdown = document.getElementById("companyDropdown");
  const companyTag = document.getElementById("companySelectedTag");
  setupSingleSelectDropdown(schoolBtn, schoolDropdown, schoolTag, [
    "Allgemeinbildende Fächer",
    "Arbeitsplätze nach Kundenwunsch ausstatten",
    "Benutzerschnittstellen gestalten und entwickeln",
    "Clients in Netzwerke einbinden",
    "Cyber-physische Systeme ergänzen",
    "Das Unternehmen und die eigene Rolle im Betrieb beschreiben",
    "Daten systemübergreifend bereitstellen",
    "Funktionalität in Anwendungen realisieren",
    "Kundenspezifische Anwendungsentwicklung durchführen",
    "Netzwerke und Dienste bereitstellen",
    "Schutzbedarfsanalyse im eigenen Arbeitsbereich durchführen",
    "Störungsereignisse bearbeiten",
    "Software zur Verwaltung von Daten anpassen",
  ]);
  setupSingleSelectDropdown(companyBtn, companyDropdown, companyTag, [
    "Aufbau und Organisation des Ausbildungsbetriebes",
    "Berufsbildung sowie Arbeits- und Tarifrecht",
    "Betreiben von IT-Systemen",
    "Beurteilen marktgängiger IT-Systeme und kundenspezifischer Lösungen",
    "Durchführen und Dokumentieren von qualitätssichernden Maßnahmen",
    "Erstellen und Dokumentieren von entwicklungsbezogenen Maßnahmen",
    "Entwickeln eines Lösungs- und Auftragsvorschlags",
    "Einrichten von Speicherlösungen",
    "Informieren und Beraten von Kunden und Kundinnen",
    "Konzipieren und Umsetzen von kundenspezifischen Softwarelösungen",
    "Mitwirken bei der Angebotserstellung und Auftragsbearbeitung in Abstimmung mit den kundenspezifischen Geschäfts- und Leistungsprozessen",
    "Programmieren von Softwarelösungen",
    "Sicherstellen der Betriebssicherheit bei der Arbeit",
    "Sicherstellen des Schutzes von Softwareanwendungen",
    "Sonstige Qualifikationen",
    "Umsetzen, Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz",
    "Umweltschutz",
    "Vernetztes Zusammenarbeiten unter Nutzung digitaler Medien",
  ]);
});
// --- Single-select dropdown logic for School/Company Qualifications ---
function setupSingleSelectDropdown(btnId, dropdownId, tagId, optionsList) {
  const btn = document.getElementById(btnId);
  const dropdown = document.getElementById(dropdownId);
  const tag = document.getElementById(tagId);
  let selected = null;

  function closeDropdown() {
    dropdown.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }

  function openDropdown() {
    dropdown.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }

  function renderDropdown() {
    dropdown.innerHTML = optionsList
      .map((q) => `<div class="row" data-value="${q}">${q}</div>`)
      .join("");
  }

  function setTag(value) {
    if (!value) {
      tag.style.display = "none";
      tag.innerHTML = "";
      selected = null;
      return;
    }
    tag.innerHTML = `${value} <button class="remove-qual" title="Remove" aria-label="Remove">🗑️</button>`;
    tag.style.display = "";
    selected = value;
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dropdown.hidden) {
      renderDropdown();
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  dropdown.addEventListener("click", (e) => {
    const row = e.target.closest(".row");
    if (row) {
      setTag(row.dataset.value);
      closeDropdown();
    }
  });

  tag.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-qual")) {
      setTag(null);
    }
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.hidden) closeDropdown();
  });

  // Expose for form usage
  return {
    getSelected: () => selected,
    setSelected: setTag,
  };
}

// popup.js
// Handles UI, storage, and messaging to apply a card or mapped cards to the active tab.

/** @typedef {{
 *  // legacy fields kept for migration only
 *  workTime?: string,
 *  startTime?: string,
 *  endTime?: string,
 *  // new
 *  duration?: string,
 *  texts: { description?: string },
 *  // legacy: qualifications
 *  qualifications?: string[],
 *  schoolQualifications?: string[],
 *  companyQualifications?: string[]
 * }} Card
 */

// School and Company qualification lists
const SCHOOL_QUALIFICATIONS = [
  "Allgemeinbildende Fächer",
  "Arbeitsplätze nach Kundenwunsch ausstatten",
  "Benutzerschnittstellen gestalten und entwickeln",
  "Clients in Netzwerke einbinden",
  "Cyber-physische Systeme ergänzen",
  "Das Unternehmen und die eigene Rolle im Betrieb beschreiben",
  "Daten systemübergreifend bereitstellen",
  "Funktionalität in Anwendungen realisieren",
  "Kundenspezifische Anwendungsentwicklung durchführen",
  "Netzwerke und Dienste bereitstellen",
  "Schutzbedarfsanalyse im eigenen Arbeitsbereich durchführen",
  "Störungsereignisse bearbeiten",
  "Software zur Verwaltung von Daten anpassen",
];

const COMPANY_QUALIFICATIONS = [
  "Aufbau und Organisation des Ausbildungsbetriebes",
  "Berufsbildung sowie Arbeits- und Tarifrecht",
  "Betreiben von IT-Systemen",
  "Beurteilen marktgängiger IT-Systeme und kundenspezifischer Lösungen",
  "Durchführen und Dokumentieren von qualitätssichernden Maßnahmen",
  "Erstellen und Dokumentieren von entwicklungsbezogenen Maßnahmen",
  "Entwickeln eines Lösungs- und Auftragsvorschlags",
  "Einrichten von Speicherlösungen",
  "Informieren und Beraten von Kunden und Kundinnen",
  "Konzipieren und Umsetzen von kundenspezifischen Softwarelösungen",
  "Mitwirken bei der Angebotserstellung und Auftragsbearbeitung in Abstimmung mit den kundenspezifischen Geschäfts- und Leistungsprozessen",
  "Programmieren von Softwarelösungen",
  "Sicherstellen der Betriebssicherheit bei der Arbeit",
  "Sicherstellen des Schutzes von Softwareanwendungen",
  "Sonstige Qualifikationen",
  "Umsetzen, Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz",
  "Umweltschutz",
  "Vernetztes Zusammenarbeiten unter Nutzung digitaler Medien",
];

const els = {
  // Header/Settings
  settingsBtn: document.getElementById("settingsBtn"),
  helpBtn: document.getElementById("helpBtn"),
  // Cards
  cardSelect: document.getElementById("cardSelect"),
  newCardBtn: document.getElementById("newCardBtn"),
  cardName: document.getElementById("cardName"),
  duration: document.getElementById("duration"),
  description: document.getElementById("description"),
  // School
  schoolDropdownBtn: document.getElementById("schoolDropdownBtn"),
  schoolDropdown: document.getElementById("schoolDropdown"),
  schoolSelectedTag: document.getElementById("schoolSelectedTag"),
  // Company
  companyDropdownBtn: document.getElementById("companyDropdownBtn"),
  companyDropdown: document.getElementById("companyDropdown"),
  companySelectedTag: document.getElementById("companySelectedTag"),
  // Actions
  saveBtn: document.getElementById("saveBtn"),
  deleteBtn: document.getElementById("deleteBtn"),
  form: document.getElementById("cardForm"),
  // Mapping UI
  mappingSection: document.getElementById("mappingSection"),
  refreshEntriesBtn: document.getElementById("refreshEntriesBtn"),
  entriesContainer: document.getElementById("entriesContainer"),
  entriesCount: document.getElementById("entriesCount"),
  noEntriesNote: document.getElementById("noEntriesNote"),
  applyAllBtn: document.getElementById("applyAllBtn"),
  // Advanced/Debug
  advancedToggle: document.getElementById("advancedToggle"),
  advancedContent: document.getElementById("advancedContent"),
  highlightBtn: document.getElementById("highlightBtn"),
  copyScanBtn: document.getElementById("copyScanBtn"),
  debugOutput: document.getElementById("debugOutput"),
  // Toast
  toast: document.getElementById("toast"),
};

let currentSelectedName = "";

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  els.toast.style.opacity = 0.98;
  setTimeout(() => {
    els.toast.style.opacity = 0.7;
  }, 1600);
  setTimeout(() => {
    els.toast.hidden = true;
    els.toast.style.opacity = 0.98;
  }, 2000);
}

function getFormCard() {
  /** @type {Card} */
  const card = {
    duration: els.duration.value || "",
    texts: {
      description: els.description.value || "",
    },
    schoolQualifications: getSelectedQualificationsFromTags(
      els.schoolSelectedTag
    ),
    companyQualifications: getSelectedQualificationsFromTags(
      els.companySelectedTag
    ),
  };
  return card;
}

function setFormFromCard(name, card /** @type {Card} */) {
  const migrated = migrateCard(card);
  els.cardName.value = name || "";
  els.duration.value = migrated.duration || "";
  els.description.value = migrated?.texts?.description || "";
  setSelectedQualifications(
    els.schoolDropdown,
    els.schoolSelectedTag,
    migrated.schoolQualifications || []
  );
  setSelectedQualifications(
    els.companyDropdown,
    els.companySelectedTag,
    migrated.companyQualifications || []
  );
}

async function getAllCards() {
  const all = await chrome.storage.local.get(null);
  return /** @type {Record<string, Card>} */ (all || {});
}

async function saveCard(name, card /** @type {Card} */) {
  const data = {};
  data[name] = card;
  await chrome.storage.local.set(data);
}

async function deleteCard(name) {
  await chrome.storage.local.remove(name);
}

function renderCardSelect(cards) {
  els.cardSelect.innerHTML =
    '<option value="">— Select card —</option>' +
    Object.keys(cards)
      .sort()
      .map((n) => `<option value="${encodeURIComponent(n)}">${n}</option>`)
      .join("");
  if (currentSelectedName && cards[currentSelectedName]) {
    els.cardSelect.value = encodeURIComponent(currentSelectedName);
  }
}

function renderQualificationDropdown(container, list) {
  container.innerHTML = list
    .map(
      (q) => `
    <label class="row">
      <input type="checkbox" value="${q}">
      <span>${q}</span>
    </label>`
    )
    .join("");
}

function getSelectedQualificationsFromTags(tagContainer) {
  return Array.from(tagContainer.querySelectorAll("[data-qual]")).map((t) =>
    t.getAttribute("data-qual")
  );
}

function setSelectedQualifications(dropdown, tagContainer, quals) {
  const checkboxes = /** @type {HTMLInputElement[]} */ (
    Array.from(dropdown.querySelectorAll('input[type="checkbox"]'))
  );
  checkboxes.forEach((cb) => {
    cb.checked = quals.includes(cb.value);
  });
  tagContainer.innerHTML = "";
  quals.forEach((q) => addQualificationTag(tagContainer, dropdown, q));
}

function addQualificationTag(tagContainer, dropdown, name) {
  if (!name) return;
  if (tagContainer.querySelector(`[data-qual="${CSS.escape(name)}"]`)) return; // avoid dupes
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.setAttribute("data-qual", name);
  tag.innerHTML = `${name} <button type="button" aria-label="Remove ${name}">✕</button>`;
  tag.querySelector("button").addEventListener("click", () => {
    tag.remove();
    const cb = dropdown.querySelector(
      `input[type="checkbox"][value="${CSS.escape(name)}"]`
    );
    if (cb) cb.checked = false;
  });
  tagContainer.appendChild(tag);
}

function enforceNoCrossDuplicates(changedListName) {
  const school = new Set(getSelectedQualificationsFromTags(els.schoolTags));
  const company = new Set(getSelectedQualificationsFromTags(els.companyTags));
  for (const q of Array.from(school)) {
    if (company.has(q)) {
      if (changedListName === "school") {
        const tag = els.companyTags.querySelector(
          `[data-qual="${CSS.escape(q)}"]`
        );
        if (tag) tag.remove();
        const cb = els.companyDropdown.querySelector(
          `input[type="checkbox"][value="${CSS.escape(q)}"]`
        );
        if (cb) cb.checked = false;
      } else {
        const tag = els.schoolTags.querySelector(
          `[data-qual="${CSS.escape(q)}"]`
        );
        if (tag) tag.remove();
        const cb = els.schoolDropdown.querySelector(
          `input[type="checkbox"][value="${CSS.escape(q)}"]`
        );
        if (cb) cb.checked = false;
      }
    }
  }
}

function attachEvents() {
  // Dropdowns for qualifications
  const toggle = (btn, dropdown) => {
    btn.addEventListener("click", () => {
      const isOpen = !dropdown.hasAttribute("hidden");
      dropdown.toggleAttribute("hidden", isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  };
  toggle(els.schoolDropdownBtn, els.schoolDropdown);
  toggle(els.companyDropdownBtn, els.companyDropdown);

  document.addEventListener("click", (e) => {
    if (
      !els.schoolDropdown.contains(e.target) &&
      e.target !== els.schoolDropdownBtn
    ) {
      els.schoolDropdown.setAttribute("hidden", "");
      els.schoolDropdownBtn.setAttribute("aria-expanded", "false");
    }
    if (
      !els.companyDropdown.contains(e.target) &&
      e.target !== els.companyDropdownBtn
    ) {
      els.companyDropdown.setAttribute("hidden", "");
      els.companyDropdownBtn.setAttribute("aria-expanded", "false");
    }
  });

  const bindDropdown = (dropdown, tagContainer, listName) => {
    dropdown.addEventListener("change", (e) => {
      const target = e.target;
      if (target && target.matches('input[type="checkbox"]')) {
        if (target.checked) {
          addQualificationTag(tagContainer, dropdown, target.value);
        } else {
          const tag = tagContainer.querySelector(
            `[data-qual="${CSS.escape(target.value)}"]`
          );
          if (tag) tag.remove();
        }
        enforceNoCrossDuplicates(listName);
      }
    });
  };
  bindDropdown(els.schoolDropdown, els.schoolTags, "school");
  bindDropdown(els.companyDropdown, els.companyTags, "company");

  // Card select
  els.cardSelect.addEventListener("change", async () => {
    const decoded = decodeURIComponent(els.cardSelect.value || "");
    const all = await getAllCards();
    currentSelectedName = decoded;
    setFormFromCard(
      decoded,
      all[decoded] || {
        duration: "",
        texts: {},
        schoolQualifications: [],
        companyQualifications: [],
      }
    );
  });

  // New card button
  if (els.newCardBtn) {
    els.newCardBtn.addEventListener("click", () => {
      currentSelectedName = "";
      setFormFromCard("", {
        duration: "",
        texts: {},
        schoolQualifications: [],
        companyQualifications: [],
      });
      els.cardName.focus();
    });
  }

  // Save card (create or update)
  els.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const name = (els.cardName.value || "").trim();
      if (!name) return;
      const card = getFormCard();
      const all = await getAllCards();
      if (
        currentSelectedName &&
        currentSelectedName !== name &&
        all[currentSelectedName]
      ) {
        await deleteCard(currentSelectedName);
      }
      await saveCard(name, card);
      currentSelectedName = name;
      const updated = await getAllCards();
      renderCardSelect(updated);
      showToast("Card saved");
    } catch (err) {
      showToast("Failed to save card");
    }
  });

  // Delete card
  els.deleteBtn.addEventListener("click", async () => {
    try {
      const name = (els.cardName.value || "").trim();
      if (!name) return;
      await deleteCard(name);
      const updated = await getAllCards();
      renderCardSelect(updated);
      currentSelectedName = "";
      setFormFromCard("", {
        duration: "",
        texts: {},
        schoolQualifications: [],
        companyQualifications: [],
      });
      showToast("Card deleted");
    } catch {
      showToast("Failed to delete card");
    }
  });

  // Refresh entries mapping
  els.refreshEntriesBtn.addEventListener("click", fetchAndRenderEntries);
  // Apply to All mappings
  els.applyAllBtn.addEventListener("click", async () => {
    const assignments = collectAssignmentsFromUI();
    await chrome.storage.local.set({ ihkAssignments: assignments });
    try {
      await chrome.runtime.sendMessage({
        type: "APPLY_ALL",
        payload: { assignments },
      });
    } catch (err) {}
    showToast("Applying to all mapped entries...");
  });

  // Advanced tools toggle
  if (els.advancedToggle && els.advancedContent) {
    els.advancedToggle.addEventListener("click", () => {
      const expanded = els.advancedContent.hasAttribute("hidden")
        ? false
        : true;
      if (expanded) {
        els.advancedContent.setAttribute("hidden", "");
        els.advancedToggle.setAttribute("aria-expanded", "false");
        els.advancedToggle.querySelector("span").textContent = "▼";
      } else {
        els.advancedContent.removeAttribute("hidden");
        els.advancedToggle.setAttribute("aria-expanded", "true");
        els.advancedToggle.querySelector("span").textContent = "▲";
      }
    });
    els.advancedToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        els.advancedToggle.click();
      }
    });
  }

  // Debug
  els.highlightBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) return;
    await chrome.tabs.sendMessage(tab.id, { type: "HIGHLIGHT_ENTRIES" });
  });

  els.copyScanBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) return;
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "SCAN_ENTRIES",
    });
    const json = JSON.stringify(response || {}, null, 2);
    els.debugOutput.textContent = json;
    try {
      await navigator.clipboard.writeText(json);
      showToast("Scan report copied");
    } catch {
      showToast("Copy failed");
    }
  });

  // Settings/help (future: open modal or page)
  if (els.settingsBtn) {
    els.settingsBtn.addEventListener("click", () => {
      showToast("Settings coming soon");
    });
  }
  if (els.helpBtn) {
    els.helpBtn.addEventListener("click", () => {
      showToast("Help coming soon");
    });
  }
}

function migrateCard(card /** @type {Card} */) {
  const migrated = { ...card };
  // Migrate duration from legacy fields
  if (!migrated.duration) {
    if (migrated.workTime && /^\d{2}:\d{2}$/.test(migrated.workTime))
      migrated.duration = migrated.workTime;
    else if (migrated.startTime && migrated.endTime) {
      try {
        const [sh, sm] = migrated.startTime.split(":").map(Number);
        const [eh, em] = migrated.endTime.split(":").map(Number);
        let mins = eh * 60 + em - (sh * 60 + sm);
        if (mins < 0) mins += 24 * 60;
        const hh = String(Math.floor(mins / 60)).padStart(2, "0");
        const mm = String(mins % 60).padStart(2, "0");
        migrated.duration = `${hh}:${mm}`;
      } catch {}
    }
  }
  if (
    !migrated.schoolQualifications &&
    !migrated.companyQualifications &&
    Array.isArray(migrated.qualifications)
  ) {
    migrated.companyQualifications = Array.from(
      new Set(migrated.qualifications)
    );
    migrated.schoolQualifications = [];
  }
  migrated.schoolQualifications = Array.isArray(migrated.schoolQualifications)
    ? migrated.schoolQualifications
    : [];
  migrated.companyQualifications = Array.isArray(migrated.companyQualifications)
    ? migrated.companyQualifications
    : [];
  const school = new Set(migrated.schoolQualifications);
  migrated.companyQualifications = (
    migrated.companyQualifications || []
  ).filter((q) => !school.has(q));
  return migrated;
}

// Mapping UI --------------------------------------------------------------

/** Render a flat list of open text fields with Card dropdown and per-row duration override. */
function renderEntries(
  entries
) /** @type {{id:string,label?:string,group?:string}[]} */
{
  els.entriesContainer.innerHTML = "";
  const count = entries?.length || 0;
  els.entriesCount.textContent = count ? `${count} open entries` : "";
  if (!entries || count === 0) {
    els.mappingSection.hidden = true;
    els.noEntriesNote.hidden = false;
    return;
  }
  els.noEntriesNote.hidden = true;
  els.mappingSection.hidden = false;
  // Group by entry.group
  const groups = new Map();
  for (const e of entries) {
    const key = e.group || "Unknown date";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }
  let globalIdx = 0;
  for (const [groupName, items] of groups) {
    const header = document.createElement("div");
    header.className = "label";
    header.textContent = `Group ${groupName}`;
    els.entriesContainer.appendChild(header);
    items.forEach((entry) => {
      const idx = ++globalIdx;
      const row = document.createElement("div");
      row.className = "entry-row";

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = entry.label || `Entry #${idx}`;

      const select = document.createElement("select");
      select.dataset.entryId = entry.id;
      select.innerHTML = buildCardsOptionsHtml();

      row.appendChild(label);
      row.appendChild(select);
      els.entriesContainer.appendChild(row);
    });
  }

  // Restore saved assignments
  chrome.storage.local.get("ihkAssignments").then(({ ihkAssignments }) => {
    if (!ihkAssignments) return;
    for (const sel of els.entriesContainer.querySelectorAll(
      "select[data-entry-id]"
    )) {
      const entryId = sel.getAttribute("data-entry-id");
      const saved = ihkAssignments?.[entryId];
      if (saved?.cardName) sel.value = encodeURIComponent(saved.cardName);
    }
  });
}

function buildCardsOptionsHtml() {
  const placeholder = '<option value="">— Select card —</option>';
  return (
    placeholder +
    Array.from(els.cardSelect.options)
      .slice(1)
      .map((o) => `<option value="${o.value}">${o.textContent}</option>`)
      .join("")
  );
}

function collectAssignmentsFromUI() {
  const map = {};
  const selects = els.entriesContainer.querySelectorAll(
    "select[data-entry-id]"
  );
  for (const sel of selects) {
    const id = sel.getAttribute("data-entry-id");
    const cardName = sel.value ? decodeURIComponent(sel.value) : "";
    if (id && cardName) map[id] = { cardName };
  }
  return map;
}

async function fetchAndRenderEntries() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  const response = await chrome.tabs.sendMessage(tab.id, {
    type: "SCAN_ENTRIES",
  });
  if (response && Array.isArray(response.entries)) {
    renderEntries(response.entries);
  } else {
    renderEntries([]);
  }
}

async function init() {
  renderQualificationDropdown(els.schoolDropdown, SCHOOL_QUALIFICATIONS);
  renderQualificationDropdown(els.companyDropdown, COMPANY_QUALIFICATIONS);
  setSelectedQualifications(els.schoolDropdown, els.schoolSelectedTag, []);
  setSelectedQualifications(els.companyDropdown, els.companySelectedTag, []);
  const cards = await getAllCards();
  renderCardSelect(cards);
  fetchAndRenderEntries();
}

attachEvents();
init();
