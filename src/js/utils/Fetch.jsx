import React from 'react';
import 'whatwg-fetch';

let isMounted = false;

class Fetch extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    isMounted = true;
    fetch(this.props.url.replace('http://', 'https://')).then(res => res.json()).then(data => {
      if (isMounted) {
        this.setState({ data });
      }
    });
  }

  componentWillUnmount() {
    isMounted = false;
  }

  render() {
    return this.props.children(this.state.data || {});
  }
}

Fetch.displayName = 'FetchWrapper';

// Uncomment properties you need
Fetch.propTypes = {
  url: React.PropTypes.string.isRequired,
  children: React.PropTypes.func.isRequired,
};
// Fetch.defaultProps = {};


export default Fetch;
