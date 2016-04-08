import React from 'react';

export default class Drawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="myoo-drawer mdl-layout__drawer">
        <nav className="mdl-navigation">
          {
            this.props.links.map((item, i) => {
              return (
                <a className="mdl-navigation__link" href={item.url} key={i}>{item.text}</a>
              );
            })
          }
        </nav>
      </div>
    );
  }
};

Drawer.propTypes = {
  links: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      url: React.PropTypes.string,
      text: React.PropTypes.string
    })
  ).isRequired
};
