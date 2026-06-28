document.addEventListener("DOMContentLoaded", async () => {
  const { enabled, filterMode } = await chrome.storage.sync.get({
    enabled: true,
    filterMode: "blur"
  });

  const toggle = document.getElementById("enableToggle");
  const modeSelect = document.getElementById("filterMode");
  const scanBtn = document.getElementById("scanBtn");
  const status = document.getElementById("status");

  toggle.checked = enabled;
  modeSelect.value = filterMode;

  toggle.addEventListener("change", async () => {
    await chrome.storage.sync.set({ enabled: toggle.checked });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
      type: "TOGGLE",
      enabled: toggle.checked,
      filterMode: modeSelect.value
    });
    status.textContent = toggle.checked ? "Mute Button is active." : "Mute Button is off.";
  });

  modeSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ filterMode: modeSelect.value });
  });

  scanBtn.addEventListener("click", async () => {
    status.textContent = "Scanning page...";
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
      type: "SCAN",
      filterMode: modeSelect.value
    });
    setTimeout(() => status.textContent = "Scan complete!", 2500);
  });
});