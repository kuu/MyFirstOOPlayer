import React from 'react';
import Player from './Player';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  onVideoClicked(embeddedId) {
    this.props.dispatcher.dispatch({
      actionType: 'playback',
      embeddedId: embeddedId
    });
  }

  render() {
    const embeddedId = this.props.embeddedId;

    if (embeddedId) {
      return (
        <main className="mdl-layout__content">
          <Player dispatcher={this.props.dispatcher} embeddedId={embeddedId} />
          {this.props.children}
        </main>
      );
    }

    return (
      <main className="mdl-layout__content">
        <div className="myoo-section mdl-typography--text-center">
          <div className="myoo-section__title">HTML 5 Player</div>
          <div className="myoo-section__sub-title">クロスプラットフォーム</div>
          <p className="myoo-section__description">
            OoyalaプレイヤーはWebページに簡単に組み込むことができるカスタマイズ可能な動画プレイヤーです。
            <br />
            Ooyalaプレイヤーを使えばモバイルやTV等、様々なデバイスで一貫した動画視聴体験を提供することが可能です。
          </p>
          <div className="myoo-grid myoo-grid--scrollable">
            {
              this.props.contents.map((content, i) => {
                return (
                  <div className="myoo-cell--small">
                    <img
                      key={i}
                      className="myoo-cell__image--small"
                      src={content.imageUrl}
                      onClick={this.onVideoClicked.bind(this, content.embeddedId)} />
                  </div>
                );
              })
            }
          </div>
        </div>
        {this.props.children}
      </main>
    );
  }
};

Main.propTypes = {
  contents: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      embeddedId: React.PropTypes.string,
      imageUrl: React.PropTypes.string
    })
  ).isRequired,
  dispatcher: React.PropTypes.object.isRequired,
  embeddedId: React.PropTypes.string
};

Main.defaultProps = { embeddedId: '' };
