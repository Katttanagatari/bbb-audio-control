// audio-control.js
export function audioControl() {
  'use strict';

  const CONFIG = {
    selectors: {
      target: '[accesskey="A"]', // main element
      remoteMedia: '#remote-media' // audio element
    },
    slider: {
      min: 0, // min volume value
      max: 1, // max volume value
      step: 0.01, // value change step 
      defaultVolume: 0.5, // def volume
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
          background-color: var(--btn-primary-bg,var(--color-primary,#0F70D7));
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
    const targetEl = document.querySelector(CONFIG.selectors.target);  // main element selector
    const remoteMediaEl = document.getElementById(CONFIG.selectors.remoteMedia.replace('#', '')); // audio selector

    if (!targetEl || !remoteMediaEl) { // until find targetElement
      return setTimeout(init, CONFIG.retryDelay);
    }
    const ui = createUI(targetEl);
    createEvents(ui, remoteMediaEl);
    
  }

  /**
   * Create full UI (container, slider, button)
   * @param {HTMLElement} targetEl - element relative to which UI will be inserted
   * @returns {Object} ui elements (container, sliderWrapper, slider, btn)
   **/

  function createUI(targetEl){
    const container = createContainer();
    const sliderWrapper = createForInput();
    const slider = createSlider();
    const btn =  createBtn();

    container.appendChild(sliderWrapper);
    sliderWrapper.appendChild(slider);
    container.appendChild(btn);
    targetEl.parentNode.insertBefore(container, targetEl);

    return {container, sliderWrapper, slider, btn};
  };

  function createContainer(){
    const el = document.createElement('div');
    el.style.cssText = // container's style
    ` 
      position: relative;
      display: inline-block;
      margin-right: 8px;
    `;

    return el;
  };

  function createForInput(){
    const el = document.createElement('div');
    el.style.cssText = // container for slider's style 
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

    return el;
  };

  function createSlider(){
    const el = document.createElement('input');
    el.type = 'range';
    el.min = CONFIG.slider.min;
    el.max = CONFIG.slider.max;
    el.step = CONFIG.slider.step;
    el.value = CONFIG.slider.defaultVolume;
    el.style.cssText = CONFIG.slider.styles.hidden;

    return el;
  };

  function createBtn(){
    const el = document.createElement('button');
    el.innerHTML = // button mute with icon
    `
      <span class="sc-hGPBjI jkgjts">
        <i class="sc-bdvvtL goIptw icon-bbb-volume_up"></i>
      </span>
    `;
    el.className = 'sc-dJjYzT jeAcue lg buttonWrapper buttonSound';

    return el;
  };

  /**
   * Bind all UI events
   * @param {Object} ui - UI elements object
   * @param {HTMLElement} audioEl - audio element to control
  **/
  function createEvents(ui,audioEl){
    changeVolume(ui,audioEl);
    bindHoverEvents(ui);
    bindMuteToggle(ui,audioEl);

  }

  /**
   * Handle volume change via slider
   * @param {Object} ui - UI elements object
   * @param {HTMLElement} audioEl - audio element to control volume
  **/

  function changeVolume(ui,audioEl){
    ui.slider.addEventListener('input', () => {
      if (audioEl) {
        audioEl.volume = ui.slider.value;  // set volume on handler
        console.log(audioEl.volume)
        updateVolumeIcon(ui.btn, ui.slider.value);  // update icon
      }
    });
  }

  /**
   * Bind hover events to show/hide slider
   * @param {Object} ui - UI elements object
  **/

  function bindHoverEvents(ui){
    [ui.sliderWrapper, ui.btn].forEach(el => {
      el.addEventListener('mouseover', () => {
        ui.slider.style.cssText = CONFIG.slider.styles.base;
      });

      el.addEventListener('mouseout', () => {
        ui.slider.style.cssText = CONFIG.slider.styles.hidden;
      });
    });
  };

  /**
   * Handle mute/unmute toggle on button click
   * @param {Object} ui - UI elements object
   * @param {HTMLElement} audioEl - audio element to control
  **/

  function bindMuteToggle(ui,audioEl) {
    let isMuted = false; // flag
    let tempSliderPosition = ui.slider.value; // temp slider value

    ui.btn.addEventListener('click', () => {
      if (!audioEl) return;

      isMuted = !isMuted;
      audioEl.muted = isMuted;

      if (isMuted) { // save position while muted by click
        tempSliderPosition = ui.slider.value;
        ui.slider.value = 0;
      } else {
        ui.slider.value = tempSliderPosition;
        audioEl.volume = tempSliderPosition;
      }

      updateVolumeIcon(ui.btn, ui.slider.value);   // update icon
    });
  }


  /**
    * Update icon volume depending on volume level
    * @param {HTMLElement} button - button for update icon
    * @param {integer} volume - volume value
  **/
   
  function updateVolumeIcon(btn, volume) {
    const icon = btn.querySelector('i');
      if (!icon) return;

      const volumeNum = parseFloat(volume);
      icon.className = volumeNum > 0 
        ? 'sc-bdvvtL goIptw icon-bbb-volume_up'
        : 'sc-bdvvtL goIptw icon-bbb-volume_off';
  };
  init();
};