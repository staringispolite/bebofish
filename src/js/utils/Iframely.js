import React from 'react';

class Iframely extends React.Component {

  componentDidMount() {
    window.iframely && iframely.load();
  }

  getIframelyHtml() {
  // If you use embed code from API
  //return {__html: this.iframelyEmbedHtmlCode};
    if(!this.props.url) {
      return null;
    }
  // Alternatively, if you use plain embed.js approach without API calls:
  return {__html: '<a href="' + this.props.url + '" data-iframely-url></a>'};
  // no title inside <a> eliminates the flick
}

  render() {
    return <div dangerouslySetInnerHTML={this.getIframelyHtml()} />
  }
}

Iframely.displayName = 'Iframely';

// Uncomment properties you need
// Iframely.propTypes = {};
// Iframely.defaultProps = {};


export default Iframely;
