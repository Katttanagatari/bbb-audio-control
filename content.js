/**
 * Volume Controller for BigBlueButton
 * @author katttanagatari
 **/

(async () => {
  const module = await import(
    chrome.runtime.getURL('audio-control.js')
  );

  module.audioControl();
})();