import React from 'react';
import Header from './Header';
import Drawer from './Drawer';
import Main from './Main';
import Footer from './Footer';

const UI_DATA = {
  header: {
    urls: {
      company: 'http://www.ooyala.com',
      logo: 'images/logo.png',
      search: 'https://www.youtube.com/results?search_query=wes+anderson'
    }
  },
  menu: {
    links: [
      {
        url: '#',
        text: 'Home',
      },
      {
        url: 'http://support.ooyala.com/developers/users/documentation/concepts/player_overview.html',
        text: 'About Ooyala Player',
      },
      {
        url: 'https://en.wikipedia.org/wiki/Wes_Anderson',
        text: 'About Wes Anderson',
      }
    ]
  },
  main: {
    contents: [
      {
        embeddedId: 'k2N3FuMjE6jVNXteVKJr-_K5EBA6RCAH',
        imageUrl: 'images/the-royal-tenenbaums.jpg'
      },
      {
        embeddedId: '0yN3FuMjE6moE0PruhMv4V8_5wF1pDri',
        imageUrl: 'images/the-life-aquatic.jpg'
      },
      {
        embeddedId: 'N4NnFuMjE6JYSTRGibX3jiAhb14Bn5Ym',
        imageUrl: 'images/the-darjeeling-limited.jpg'
      },
      {
        embeddedId: 'J2NnFuMjE6Tb_t7_n_90z5pq8PGoM4wN',
        imageUrl: 'images/moonrise-kingdom.jpg'
      },
      {
        embeddedId: 'gwN3FuMjE6mJhirpGqzTvOxWHLKXbG7N',
        imageUrl: 'images/the-grand-budapest-hotel.jpg'
      }
    ]
  }
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    UI_DATA.menu.links[0].url = this.props.homeUrl;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header has-drawer">
        <Header {...UI_DATA.header} embeddedId={this.props.embeddedId} />
        <Drawer {...UI_DATA.menu} />
        <Main {...UI_DATA.main} dispatcher={this.props.dispatcher} embeddedId={this.props.embeddedId} >
          <Footer {...UI_DATA.menu} />
        </Main>
      </div>
    );
  }
};

App.propTypes = {
  homeUrl: React.PropTypes.string.isRequired,
  dispatcher: React.PropTypes.object.isRequired,
  embeddedId: React.PropTypes.string
};

App.defaultProps = {
  embeddedId: null
};
