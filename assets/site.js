
// ----- Minimal Markdown + CSV renderers (no network) -----
function escapeHtml(s) { return s.replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch])); }

function miniMarkdown(md) {
  md = md.replace(/```([\s\S]*?)```/g, (m, code) => `<pre><code>${escapeHtml(code)}</code></pre>`);
  md = md.replace(/`([^`]+)`/g, (m, code) => `<code>${escapeHtml(code)}</code>`);
  for (let i = 6; i >= 1; i--) {
    const re = new RegExp(`^${"#".repeat(i)}\\s*(.+)$`, "gm");
    md = md.replace(re, `<h${i}>$1</h${i}>`);
  }
  md = md.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  md = md.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2">$1</a>`);
  md = md.replace(/(^|\n)-(.*?)(?=\n[^-]|$)/gs, (m, _s, block) => {
    const items = block.trim().split(/\n-\s*/).map(s => s.trim()).filter(Boolean);
    if (items.length <= 1) return m;
    return `\n<ul>` + items.map(li => `<li>${li}</li>`).join("") + `</ul>`;
  });
  md = md.split(/\n{2,}/).map(chunk => {
    if (/^\s*<(h\d|ul|pre|table|blockquote|p|hr|img|div)/.test(chunk.trim())) return chunk;
    return "<p>" + chunk.replace(/\n/g, "<br>") + "</p>";
  }).join("\n");
  return md;
}

function parseCSV(text) {
  const rows = [];
  let row = [], val = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i+1];
    if (c === '"' && inQuotes && n === '"') { val += '"'; i++; continue; }
    if (c === '"') { inQuotes = !inQuotes; continue; }
    if (c === ',' && !inQuotes) { row.push(val.trim()); val = ""; continue; }
    if ((c === '\n' || c === '\r') && !inQuotes) {
      if (val.length || row.length) { row.push(val.trim()); rows.push(row); row = []; val = ""; }
      continue;
    }
    val += c;
  }
  if (val.length || row.length) { row.push(val.trim()); rows.push(row); }
  return rows.filter(r => r.some(x => x.length));
}

// Render Markdown from an inline <script type="text/markdown" id="...">
function renderMarkdownFromScript(scriptId, targetId) {
  const el = document.getElementById(targetId);
  const script = document.getElementById(scriptId);
  if (!el || !script) return;
  const md = script.textContent || script.innerText || "";
  el.innerHTML = miniMarkdown(md);
}

// Render schedule table from inline CSV in <script type="text/csv" id="...">
function renderScheduleFromScript(scriptId, tbodyId = "schedule-body") {
  const script = document.getElementById(scriptId);
  const tbody = document.getElementById(tbodyId);
  if (!script || !tbody) return;
  const text = script.textContent || script.innerText || "";
  const rows = parseCSV(text);
  const header = rows.shift() || ["Date","Topic","Reading","Assignment"];
  tbody.innerHTML = "";
  for (const r of rows) {
    const tr = document.createElement("tr");
    for (let i = 0; i < header.length; i++) {
      const td = document.createElement("td");
      td.innerHTML = (r[i] || "");
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    if (a.getAttribute("href").endsWith(path)) a.setAttribute("aria-current", "page");
  });
}

// Auto-boot on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  if (document.getElementById("home-md") && document.getElementById("home-inline")) {
    renderMarkdownFromScript("home-inline", "home-md");
  }
  if (document.getElementById("schedule-body") && document.getElementById("schedule-inline")) {
    renderScheduleFromScript("schedule-inline", "schedule-body");
  }
  if (document.getElementById("logistics-md") && document.getElementById("logistics-inline")) {
    renderMarkdownFromScript("logistics-inline", "logistics-md");
  }
});
