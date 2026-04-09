/**
 * Volume Controller for BigBlueButton
 * @author katttanagatari
 **/

(async () => {
  const module = await import(
    chrome.runtime.getURL('audio-control.js')
  );
  
  const messagesModule = await import(
    chrome.runtime.getURL('prepared-messages.js')
  );

  module.audioControl();
  messagesModule.preparedMessage();
})();