(async () => {
  const module = await import(
    chrome.runtime.getURL('audio-control.js')
  );

  module.audioControl();
})();