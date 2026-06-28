chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true, filterMode: "blur" });
  console.log("Mute Button installed!");
});