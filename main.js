/**
 * Volume Controller for BigBlueButton
 * @author katttanagatari
 **/
(function() {
  'use strict';

  const CONFIG = {
    selectors: {
      target: '[accesskey="A"]', // main element
      remoteMedia: '#remote-media' // audio element
    },
    slider: {
      min: 0, // min volume value
      max: 1, // max volume value
      step: 0.01,   // value change step 
      defaultVolume: 0.5,   // def volume
      styles: {
        base: // styles for showing the slider
        `
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 130px;
          writing-mode: vertical-rl;
          direction: rtl;
          z-index: 999;
        `,
        hidden: // styles for hidden the slider
        `
          display: none;
        `
      }
    },
    retryDelay: 500 // delay between attemps in ms
  }; 

  /**
   * Initialize Volume Controller
  **/
  function init() {
    const targetElement = document.querySelector(CONFIG.selectors.target);  // main element selector
    const remoteMedia = document.getElementById(CONFIG.selectors.remoteMedia.replace('#', '')); // audio selector

    if (!targetElement || !remoteMedia) { // until find targetElement
      return setTimeout(init, CONFIG.retryDelay);
    }

    createVolumeInterface(targetElement, remoteMedia); // create interface
  }

  /**
    * Create interface button and slider
    * @param {HTMLElement} targetElement - location where element is located in the dom structure
    * @param {HTMLElement} remoteMedia - element to control volume
  **/

  function createVolumeInterface(targetElement, remoteMedia) {

    const container = document.createElement('div');  // container 
    const containerForInput = document.createElement('div');  // container for slider 
    const slider = document.createElement('input'); // slider
    const newButton = document.createElement('button'); // mute,unmute btn


    container.style.cssText = // container's style
    ` 
      position: relative;
      display: inline-block;
      margin-right: 8px;
    `;

    containerForInput.style.cssText = // container for slider's style 
    `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    slider.type = 'range';  // сonfigure slider
    slider.min = CONFIG.slider.min;
    slider.max = CONFIG.slider.max;
    slider.step = CONFIG.slider.step;
    slider.value = CONFIG.slider.defaultVolume;
    slider.style.cssText = CONFIG.slider.styles.hidden;

    newButton.innerHTML = // button mute with icon
    `
      <span class="sc-hGPBjI jkgjts">
        <i class="sc-bdvvtL goIptw icon-bbb-volume_up"></i>
      </span>
    `;
    newButton.className = 'sc-dJjYzT jeAcue lg buttonWrapper buttonSound';


    container.appendChild(containerForInput); // create dom structure
    containerForInput.appendChild(slider);
    container.appendChild(newButton);
    targetElement.parentNode.insertBefore(container, targetElement);

    /**
     * Volume change handler
     * @event slider#input
    **/

    slider.addEventListener('input', () => {
      if (remoteMedia) {
        remoteMedia.volume = slider.value;  // set volume on handler
        updateVolumeIcon(newButton, slider.value);  // update icon
      }
    });

    /**
     * Mute change btn
     * @event newButton#click
    **/

    let isMuted = false; // flag
    let tempSliderPosition = slider.value; // temp slider value

    newButton.addEventListener('click', () => {
      if (!remoteMedia) return;

      isMuted = !isMuted;
      remoteMedia.muted = isMuted;

      if (isMuted) { // save position while muted by click
        tempSliderPosition = slider.value;
        slider.value = 0;
      } else {
        slider.value = tempSliderPosition;
        remoteMedia.volume = tempSliderPosition;
      }

      updateVolumeIcon(newButton, slider.value);   // update icon
    });

    /**
     * Hover events
     * @event containerForInput,newButton#mouseover,mouseout
    **/

    [containerForInput, newButton].forEach(el => {
      el.addEventListener('mouseover', () => {
        slider.style.cssText = CONFIG.slider.styles.base;
      });

      el.addEventListener('mouseout', () => {
        slider.style.cssText = CONFIG.slider.styles.hidden;
      });
    });

    /**
     * Update icon volume
     * @param {HTMLElement} button - button for update icon
     * @param {integer} volume - volume value
    **/

    function updateVolumeIcon(button, volume) {
      const icon = button.querySelector('i');
      if (!icon) return;

      const volumeNum = parseFloat(volume);
      icon.className = volumeNum > 0 
        ? 'sc-bdvvtL goIptw icon-bbb-volume_up'
        : 'sc-bdvvtL goIptw icon-bbb-volume_off';
    }
    console.log('everything works fine)');
  }
    init();
})();