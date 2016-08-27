import React from 'react';
import ChatList from './chat-list.jsx';
import ChatBackground from './chat-background.jsx';
import ChatInput from './chat-input.jsx';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      blurInput: true,
    };
    this.blurInput = this.blurInput.bind(this);
  }

  blurInput() {
    this.setState({ blurInput: true });
  }


  render() {
    return (<div className="chat">
      <div className="chat-upper">
        <ChatList blurChat={this.blurInput} />
        <ChatBackground />
      </div>
      <div className="chat-lower">
        <ChatInput blurChat={this.state.blurInput} setChatInputState={this.blurInput} />
      </div>
    </div>);
  }
}

App.displayName = 'App';

// Uncomment properties you need
// App.propTypes = {};
// App.defaultProps = {};


export default App;
