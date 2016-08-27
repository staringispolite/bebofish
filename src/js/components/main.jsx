import React from 'react';
import ChatList from './chat-list.jsx';
import ChatBackground from './chat-background.jsx';
import ChatInput from './chat-input.jsx';
import GiphyBrowser from './giphy-browser.jsx';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      blurInput: true,
      actingUser: {},
      mode: 'text',
    };
    this.blurInput = this.blurInput.bind(this);
    this.handleSwitchMode = this.handleSwitchMode.bind(this);
  }

  componentWillMount() {
    Bebo.User.get('me', (err, resp) => {
      if (err) { return console.error(err); }
      this.setState({ actingUser: resp });
      return null;
    });
  }

  blurInput() {
    this.setState({ blurInput: true });
    this.handleSwitchMode('text');
  }

  handleSwitchMode(mode) {
    if (this.state.mode === 'gif') {
      this.setState({ mode: 'text' });
    } else {
      this.setState({ mode });
    }
  }

  render() {
    return (<div className="chat">
      <div className="chat-upper" style={this.state.mode === 'gif' ? { transform: 'translate3d(33vw,0,0)' } : {}}>
        <ChatList blurChat={this.blurInput} actingUser={this.state.actingUser} />
        <ChatBackground />
      </div>
      <div className="chat-lower" style={this.state.mode === 'gif' ? { transform: 'translate3d(33vw,0,0)' } : {}}>
        <ChatInput blurChat={this.state.blurInput} switchMode={this.handleSwitchMode} setChatInputState={this.blurInput} />
      </div>
      <GiphyBrowser actingUser={this.state.actingUser} style={this.state.mode === 'gif' ? { transform: 'translate3d(0%,0,0)' } : {}} switchMode={this.handleSwitchMode} />
    </div>);
  }
}

App.displayName = 'App';

// Uncomment properties you need
// App.propTypes = {};
// App.defaultProps = {};


export default App;
