import React from 'react';
import ReactDOM from 'react-dom';
import Flux from 'flux';
import App from './components/App';
import PlayerUI from './components/PlayerUI';

const Dispatcher = Flux.Dispatcher;
const dispatcher = new Dispatcher();
let homeUrl = location.pathname;
let ooPlayer = null;


if ('content' in document.createElement('template')) {
  // HTML template is supported.
  OO.plugin('PlayerUI', () => {
    return PlayerUI;
  });
}

function postProcess(embeddedId) {
  // Restore the DOM created by MDL
  componentHandler.upgradeDom();

  if (embeddedId) {

    // Create player
    let onError = (err) => {
      console.error('Player error:', err);
    };
    let onCreate= (player) => {
      // Listen for the error event,
      player.mb.subscribe(
        OO.EVENTS.ERROR,
        'test',
        (event, payload) => {
          onError(payload);
        }
      );
    };
    let asyncCreate = () => {
      OO.ready(() => {
        ooPlayer = OO.Player.create(
          'ooyalaplayer',
          embeddedId,
          {
            onCreate,
            platform: 'html5-priority'
          }
        );
      });
    };

    if (ooPlayer) {
      ooPlayer.destroy(asyncCreate);
    } else {
      asyncCreate();
    }
  }
}

dispatcher.register((payload) => {
  if (payload.actionType === 'playback') {
    // Update view
    const embeddedId = payload.embeddedId;

    if (window.history && window.history.pushState) {
      window.history.pushState(embeddedId, 'Playing back contents', embeddedId);
    }

    ReactDOM.render(
      <App dispatcher={dispatcher} embeddedId={embeddedId} homeUrl={homeUrl} />,
      document.querySelector('#myoo-app'),
      () => {
        postProcess(embeddedId)
      }
    );

  }
});

// Listen for the browser's back/forward button
if (window.history && window.history.pushState) {
  window.addEventListener('popstate', function onBack(event) {
    ReactDOM.render(
      <App dispatcher={dispatcher} embeddedId={event.state} homeUrl={homeUrl} />,
      document.querySelector('#myoo-app'),
      () => {
        postProcess(event.state)
      }
    );
  }, false);
}


// Initial view
ReactDOM.render(
  <App dispatcher={dispatcher} homeUrl={homeUrl} />,
  document.querySelector('#myoo-app')
);
