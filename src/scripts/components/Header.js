import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className = this.props.embeddedId ? 'myoo-header myoo-header--playing' : 'myoo-header';

    return (
      <header className={className + ' mdl-layout__header mdl-layout__header--waterfall'}>
        <div className="mdl-layout__header-row">
          <a href={this.props.urls.company}>
            <span className="myoo-header__title mdl-layout-title">
              <img className="myoo-header__title--logo" src={this.props.urls.logo} />
            </span>
          </a>
          <div className="mdl-layout-spacer"></div>
          <div className="myoo-navigation-container">
            <div className="myoo-navigation mdl-navigation">
              <a className="mdl-navigation__link" href={this.props.urls.search}>
                <span className="myoo-sprite__search">search</span>
                <span className="myoo-display__sp--none">Serch Video</span>
              </a>
            </div>
          </div>
          <a href={this.props.urls.company}>
            <span className="myoo-header__title--mobile mdl-layout-title">
              <img className="myoo-header__title--logo" src={this.props.urls.logo} />
            </span>
          </a>
        </div>
      </header>
    );
  }
};

Header.propTypes = {
  urls: React.PropTypes.shape({
    company: React.PropTypes.string,
    logo: React.PropTypes.string,
    search: React.PropTypes.string
  }).isRequired,
  embeddedId: React.PropTypes.string
};

Header.defaultProps = {
  embeddedId: null
};
