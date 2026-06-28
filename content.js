let isEnabled = true;
let currentFilterMode = "blur";

const style = document.createElement("style");
style.textContent = `
  .mutebutton-blur {
    filter: blur(8px);
    transition: filter 0.3s;
    cursor: pointer;
  }
  .mutebutton-blur:hover { filter: blur(3px); }
  .mutebutton-hide { display: none !important; }
  .mutebutton-warning {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 13px;
    color: #856404;
    cursor: pointer;
    display: inline-block;
  }
`;
document.head.appendChild(style);

async function isHateful(text) {
  try {
    const response = await fetch("http://127.0.0.1:5000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    return data.isHateful && data.confidence > 0.75;
  } catch (err) {
    return false;
  }
}

function filterElement(el, mode) {
  if (el.dataset.mutebutton) return;
  el.dataset.mutebutton = "flagged";

  if (mode === "blur") {
    el.classList.add("mutebutton-blur");
    el.title = "⚠️ Mute Button: Click to reveal";
    el.addEventListener("click", () => {
      el.classList.remove("mutebutton-blur");
      el.dataset.mutebutton = "revealed";
    });
  } else if (mode === "hide") {
    el.classList.add("mutebutton-hide");
  } else if (mode === "replace") {
    const warning = document.createElement("span");
    warning.className = "mutebutton-warning";
    warning.textContent = "⚠️ Hidden by Mute Button. Click to reveal.";
    warning.addEventListener("click", () => {
      el.style.display = "";
      warning.remove();
      el.dataset.mutebutton = "revealed";
    });
    el.style.display = "none";
    el.parentNode.insertBefore(warning, el);
  }
}

function getTextElements() {
  const tags = ["p", "span", "div", "li", "td", "blockquote", "h1", "h2", "h3", "h4"];
  const results = [];
  tags.forEach(tag => {
    document.querySelectorAll(tag).forEach(el => {
      const text = el.innerText?.trim();
      if (text && text.length > 20 && text.length < 1000 &&
          !el.dataset.mutebutton && el.children.length === 0) {
        results.push({ el, text });
      }
    });
  });
  return results;
}

async function scanPage(mode = "blur") {
  if (!isEnabled) return;
  const elements = getTextElements();
  console.log(`Mute Button: Scanning ${elements.length} elements...`);
  for (let i = 0; i < elements.length; i++) {
    const { el, text } = elements[i];
    const hateful = await isHateful(text);
    if (hateful) filterElement(el, mode);
    if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
  }
  console.log("Mute Button: Scan complete ✅");
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE") {
    isEnabled = msg.enabled;
    currentFilterMode = msg.filterMode;
    if (isEnabled) scanPage(currentFilterMode);
  }
  if (msg.type === "SCAN") scanPage(msg.filterMode);
});

async function init() {
  const { enabled, filterMode } = await chrome.storage.sync.get({
    enabled: true, filterMode: "blur"
  });
  isEnabled = enabled;
  currentFilterMode = filterMode;
  if (!isEnabled) return;
  console.log("Mute Button: Connecting to model server...");
  scanPage(currentFilterMode);
}

init();