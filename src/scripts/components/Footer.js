import React from 'react';

const githubUrl = 'https://github.com/kuu/MyFirstOOPlayer';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <footer className="mdl-mini-footer">
        <div className="mdl-mini-footer--left-section">
          <ul className="mdl-mini-footer--link-list">
            {
              this.props.links.map((link, i) => {
                return <li><a href={link.url} key={i}>{link.text}</a></li>;
              })
            }
          </ul>
          <div className="mdl-logo">Created by Kuu Miyazaki. Source code is <a href={githubUrl}>here</a>.</div>
        </div>
      </footer>
    );
  }
};

Footer.propTypes = {
  links: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      url: React.PropTypes.string,
      text: React.PropTypes.string
    })
  ).isRequired
};
