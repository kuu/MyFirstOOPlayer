import React from 'react';

const PLAYER_ID = '7267438d470c471eb75a165a8b670617';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.player = null;
  }

  render() {
    /*
    let srcStr = `http://player.ooyala.com/iframe.html?ec=${this.props.embeddedId}&pbid=${PLAYER_ID}&platform=html5-priority`;

    return (
      <div className="myoo-player-container">
        <iframe className="myoo-player" src={srcStr} frameBorder="0"></iframe>
      </div>
    );
    */
    return (
      <div className="myoo-player-container">
        <div id="ooyalaplayer" className="myoo-player"></div>
      </div>
    );
  }
};

Player.propTypes = {
  dispatcher: React.PropTypes.object.isRequired,
  embeddedId: React.PropTypes.string.isRequired
};
