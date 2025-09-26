// contentScript.js
// Runs on meineihk.service.ihk.de pages. Scans open report-entry fields, observes lazy loads, and applies mappings.

(function () {
  function dispatchAllEvents(element) {
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function normalizeText(text) {
    return (text || "").trim().toLowerCase();
  }

  // Shadow DOM utilities -----------------------------------------------------
  function forEachNodeDeep(root, visit) {
    const start =
      root && root.nodeType === Node.DOCUMENT_NODE
        ? /** @type {Document} */ (root).documentElement
        : root;
    const stack = start ? [start] : [];
    while (stack.length) {
      const node = stack.pop();
      visit(node);
      // Traverse shadow roots if open
      if (node instanceof Element && node.shadowRoot) {
        stack.push(node.shadowRoot);
      }
      // Traverse children
      const children =
        node instanceof DocumentFragment || node instanceof Element
          ? Array.from(node.children || [])
          : [];
      for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
    }
  }

  function queryAllDeep(root, selector) {
    const results = [];
    forEachNodeDeep(root, (node) => {
      if (node instanceof Element || node instanceof DocumentFragment) {
        try {
          const found = node.querySelectorAll
            ? node.querySelectorAll(selector)
            : [];
          for (const el of found) results.push(el);
        } catch {}
      }
    });
    return Array.from(new Set(results));
  }

  function deepClosest(start, predicate) {
    let node = start;
    while (node) {
      if (node instanceof Element && predicate(node)) return node;
      // climb regular DOM
      let next = node.parentElement || node.parentNode;
      // if we reached a shadow root, jump to its host
      if (next instanceof ShadowRoot) next = next.host;
      node = next || null;
    }
    return null;
  }

  // --- Scanning: open text fields only -----------------------------------

  function isOpenReportTextarea(el) {
    if (!(el instanceof HTMLTextAreaElement)) return false;
    if (el.disabled || el.readOnly) return false;
    // Heuristics: placeholder like "Neuer Eintrag" or visible and sizeable
    const ph = normalizeText(el.getAttribute("placeholder") || "");
    const visible =
      el.offsetParent !== null && el.clientHeight > 0 && el.clientWidth > 0;
    return visible && (/neuer eintrag/.test(ph) || el.value !== undefined);
  }

  function ensureStableId(node) {
    if (node.dataset && node.dataset.ihkEntryId) return node.dataset.ihkEntryId;
    const id = "entry-" + Math.random().toString(36).slice(2, 10);
    node.dataset.ihkEntryId = id;
    return id;
  }

  function findOpenEntries(root) {
    const entries = [];
    const textareas = queryAllDeep(root, "textarea");
    for (const ta of textareas) {
      if (!isOpenReportTextarea(ta)) continue;
      // Find the container that also holds the time controls (HH/MM or input[type=time])
      const container =
        deepClosest(ta, (el) => {
          if (!(el instanceof Element)) return false;
          if (el.classList.contains("eintrag")) return true; // specific to IHK entries
          try {
            const hasTime =
              queryAllDeep(
                el,
                'input[type="time"], input[placeholder*="hh" i], input[placeholder*="mm" i]'
              ).length > 0;
            return hasTime;
          } catch {
            return false;
          }
        }) || ta.parentElement;

      // Qualification button
      const redBtn =
        (container &&
          queryAllDeep(
            container,
            [
              "button.qualifications-button",
              "button",
              "a",
              'div[role="button"]',
              '[aria-haspopup="dialog"]',
              'button[aria-label*="qualifikation" i]',
            ].join(",")
          )[0]) ||
        null;

      // Determine if any time control exists within the container
      const hasTime = !!(
        container &&
        queryAllDeep(
          container,
          [
            'input[type="time"]',
            'input[placeholder*="hh" i]',
            'input[placeholder*="mm" i]',
            'input[aria-label*="dauer" i]',
          ].join(",")
        ).length
      );

      if (redBtn && hasTime) {
        const id = ensureStableId(container);
        entries.push({ id, node: container, textarea: ta, redBtn });
      }
    }
    // dedupe by id
    const seen = new Set();
    return entries.filter((e) =>
      seen.has(e.id) ? false : (seen.add(e.id), true)
    );
  }

  // Observe dynamic loads (lazy content)
  const observer = new MutationObserver(() => {
    /* scanning happens on demand */
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Cache of nodes by id for apply steps
  const entryCache = new Map();
  function buildCache() {
    entryCache.clear();
    for (const e of findOpenEntries(document.documentElement || document))
      entryCache.set(e.id, e);
  }

  // --- Automation helpers -------------------------------------------------

  function scrollIntoViewIfNeeded(el) {
    try {
      el.scrollIntoView({ behavior: "instant", block: "center" });
    } catch {}
  }

  function openQualificationDialog(entry) {
    if (!entry.redBtn) return false;
    entry.redBtn.click();
    return true;
  }

  function closeQualificationDialog() {
    const btn = queryAllDeep(
      document,
      'button[aria-label*="schließen" i], button[aria-label*="close" i], button[title*="Schließen" i]'
    )[0];
    if (btn) btn.click();
  }

  function selectQualifications(labels) {
    const wanted = Array.from(labels || []).map(normalizeText);
    console.log("🔍 Looking for qualifications:", wanted);
    
    // Prefer Angular CDK overlay content when present
    const overlayRoot =
      document.querySelector(".cdk-overlay-container") || document.body;
    const dialog =
      queryAllDeep(
        overlayRoot,
        '[role="dialog"], .mat-mdc-dialog-container, .cdk-overlay-pane'
      )[0] || overlayRoot;
    
    // Find all mat-checkbox elements in the dialog
    const checkboxes = queryAllDeep(dialog, "mat-checkbox");
    console.log("📋 Found checkboxes:", checkboxes.length);
    
    for (const wantedLabel of wanted) {
      console.log("🎯 Looking for:", wantedLabel);
      let found = false;
      
      for (const checkbox of checkboxes) {
        // Get the label text from the mat-checkbox
        const labelElement = checkbox.querySelector('label.mdc-label');
        const labelText = labelElement ? normalizeText(labelElement.textContent || "") : "";
        
        console.log("📝 Checkbox label:", labelText);
        
        // Check if this checkbox matches our wanted label
        if (labelText.includes(wantedLabel)) {
          console.log("✅ Match found! Clicking checkbox for:", labelText);
          // Find the actual input element and click it
          const input = checkbox.querySelector('input[type="checkbox"]');
          if (input && !input.checked) {
            input.click();
            // Also trigger change event for Angular
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            found = true;
          }
          break;
        }
      }
      
      if (!found) {
        console.log("❌ No match found for:", wantedLabel);
      }
    }
  }

  function setDuration(entry, duration) {
    if (!duration) return;
    // Prefer native time input if present
    const nativeTime = queryAllDeep(
      entry.node,
      'input[type="time"], input[aria-label*="dauer" i]'
    )[0];
    if (nativeTime) {
      nativeTime.value = duration;
      dispatchAllEvents(nativeTime);
      return;
    }
    // Handle HH/MM split fields (ngx-mat-timepicker)
    const [hh, mm] = (duration || "").split(":");
    const hInput = queryAllDeep(
      entry.node,
      'input[placeholder="HH" i], input[placeholder*="hh" i]'
    )[0];
    const mInput = queryAllDeep(
      entry.node,
      'input[placeholder="MM" i], input[placeholder*="mm" i]'
    )[0];
    if (hInput && mInput) {
      if (hh != null) {
        hInput.value = hh;
        dispatchAllEvents(hInput);
      }
      if (mm != null) {
        mInput.value = mm;
        dispatchAllEvents(mInput);
      }
    }
  }

  function highlight(entries) {
    entries.forEach(({ node }) => {
      const prev = node.style.outline;
      node.style.outline = "2px solid #f59e0b";
      setTimeout(() => {
        node.style.outline = prev;
      }, 1500);
    });
  }

  async function applyMapping(assignments, cardsByName) {
    console.log("🚀 applyMapping called with:", { assignments, cardsByName });
    buildCache();
    for (const [entryId, config] of Object.entries(assignments || {})) {
      console.log("📝 Processing entry:", entryId, config);
      const entry = entryCache.get(entryId);
      if (!entry) {
        console.log("❌ Entry not found:", entryId);
        continue;
      }
      const card = cardsByName[config.cardName];
      if (!card) {
        console.log("❌ Card not found:", config.cardName);
        continue;
      }
      console.log("🎴 Card found:", card);
      
      const quals = new Set([
        ...(card.schoolQualifications || []),
        ...(card.companyQualifications || []),
        ...(card.qualifications || []),
      ]);
      console.log("🎯 Final qualifications:", Array.from(quals));
      
      const duration = config.duration || card.duration || card.workTime || "";
      scrollIntoViewIfNeeded(entry.node);
      openQualificationDialog(entry);
      await waitFor(
        () => !!queryAllDeep(document, '[role="dialog"], .modal').length
      );
      selectQualifications(Array.from(quals));
      closeQualificationDialog();
      setDuration(entry, duration);
      setDescription(entry, card.texts?.description || "");
      function setDescription(entry, description) {
        if (!description) return;
        if (entry.textarea) {
          entry.textarea.value = description;
          dispatchAllEvents(entry.textarea);
        }
      }
    }
  }

  function waitFor(predicate, timeoutMs = 3000, intervalMs = 50) {
    return new Promise((resolve) => {
      const start = Date.now();
      const h = setInterval(() => {
        if (predicate()) {
          clearInterval(h);
          resolve(true);
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(h);
          resolve(false);
        }
      }, intervalMs);
    });
  }

  // --- Messaging ---------------------------------------------------------
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === "SCAN_ENTRIES") {
      buildCache();
      const cacheEntries = Array.from(entryCache.values());
      // Derive group and label per entry based on nearest date container
      const withMeta = cacheEntries.map((e) => {
        const header = deepClosest(
          e.node,
          (el) =>
            el.classList?.contains("bericht") ||
            el.classList?.contains("mat-mdc-card")
        );
        let group = "";
        if (header) {
          try {
            const day =
              queryAllDeep(
                header,
                ".bericht-datum .datum-tag"
              )[0]?.textContent?.trim() || "";
            const month =
              queryAllDeep(
                header,
                ".bericht-datum .datum-monat"
              )[0]?.textContent?.trim() || "";
            group = [day, month].filter(Boolean).join(" ");
          } catch {}
        }
        return { id: e.id, node: e.node, group };
      });
      // Compute positions within group for labels
      const positions = new Map();
      const entries = withMeta.map((x) => {
        const key = x.group || "Unbekannt";
        const idx = (positions.get(key) || 0) + 1;
        positions.set(key, idx);
        return { id: x.id, label: `Field ${idx}`, group: key };
      });
      const debug = {
        textareaCount: queryAllDeep(document, "textarea").length,
      };
      if (entries.length === 0 && window === window.top) {
        setTimeout(() => sendResponse({ entries, debug }), 300);
      } else {
        sendResponse({ entries, debug });
      }
      return true;
    }
    if (msg?.type === "HIGHLIGHT_ENTRIES") {
      const entries = Array.from(entryCache.values());
      if (entries.length === 0 && window === window.top) {
        setTimeout(() => sendResponse({ highlighted: 0 }), 300);
      } else {
        highlight(entries);
        sendResponse({ highlighted: entries.length });
      }
      return true;
    }
    if (msg?.type === "APPLY_ALL") {
      const assignments = msg.payload?.assignments || {};
      chrome.storage.local.get(null).then((all) => {
        const cardsByName = all || {};
        applyMapping(assignments, cardsByName).then(() =>
          sendResponse({ ok: true })
        );
      });
      return true;
    }
    if (msg?.type === "APPLY_CARD" && msg.payload?.card) {
      const card = msg.payload.card;
      const quals = new Set([
        ...(card.schoolQualifications || []),
        ...(card.companyQualifications || []),
        ...(card.qualifications || []),
      ]);
      const any =
        Array.from(entryCache.values())[0] ||
        findOpenEntries(document.documentElement || document)[0];
      if (any) {
        scrollIntoViewIfNeeded(any.node);
        openQualificationDialog(any);
        selectQualifications(Array.from(quals));
        closeQualificationDialog();
        const duration = card.duration || card.workTime || "";
        setDuration(any, duration);
      }
      sendResponse({ ok: true });
      return true;
    }
  });
})();
