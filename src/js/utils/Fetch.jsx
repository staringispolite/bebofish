import React from 'react';
import 'whatwg-fetch';

class Fetch extends React.Component {

  constructor() {
    super();
    this.state = {};

  }

 componentDidMount() {
   fetch(this.props.url).then(res => res.json()).then(data => {this.setState({data})})
 }


  render() {
    return this.props.children(this.state);
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
