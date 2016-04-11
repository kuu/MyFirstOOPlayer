import OOAPI from './OOAPI';

export default class PlayerUI {
  constructor(mb, id) {
    this.mb = mb; // save message bus reference for later use
    this.id = id;
    this.duration = NaN;
    this.playing = false;
    this.init(); // subscribe to relevant events
  }

  init() {
    // subscribe to relevant player events
    this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customUi', this.onPlayerCreate.bind(this));
    this.mb.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'customUi', this.onTimeUpdate.bind(this));
    this.mb.subscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customUi', this.onContentReady.bind(this));
    this.api = new OOAPI('BtbmUyOlamRiH-S0S-iUeNvf_ghr.1Vrkx', 'E6xoX4GJ5tnW3ysIy5biIXgXZuP6NVwQWrlmIOW_');
  }

  onPlayerCreate(event, elementId, params) {
    let main = document.querySelector('main');
    let footer = document.querySelector('footer');

    // Add custom UI
    let template = document.querySelector('.myoo-player__ui-template');
    let playerUiElement = document.importNode(template.content, true);

    this.playButton = playerUiElement.querySelector('.play-button');
    this.playButton.disabled = true;
    this.playButton.addEventListener('click', this.onPlay.bind(this), false);
    this.currentTimeElement = playerUiElement.querySelector('.current-time');
    this.durationElement = playerUiElement.querySelector('.duration');

    this.initTitle(playerUiElement);

    main.insertBefore(playerUiElement, footer);
  }

  initTitle(playerUiElement) {
    let path = location.pathname;

    console.log('path=' + path);
    this.embeddedId = path.slice(path.lastIndexOf('/') + 1);
    this.title = playerUiElement.querySelector('#title-edit');

    console.log('embeddedId=' + this.embeddedId);

    this.api.makeRequest('get', '/v2/assets/' + this.embeddedId)
    .then(
      (info) => {
        console.log(info);
        this.title.textContent = info.name;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onTimeUpdate(event, time=0, duration=0, buffer) {
    this.currentTimeElement.textContent = Math.round(time);
    this.durationElement.textContent = Math.round(duration);
  }

  onContentReady(event, content) {
    this.durationElement.textContent = content.duration / 1000;
    this.playButton.disabled = false;
  }

  onPlay() {
    if (this.playButton.textContent === 'Play') {
      this.mb.publish(OO.EVENTS.PLAY);
      this.playing = true;
      this.playButton.textContent = 'Pause';
    } else {
      this.mb.publish(OO.EVENTS.PAUSE);
      this.playing = false;
      this.playButton.textContent = 'Play';
    }
  }

  static get __end_marker() {
    return true;
  }
};
