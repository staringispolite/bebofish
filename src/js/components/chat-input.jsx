import React from 'react';


class ChatInput extends React.Component {

  constructor() {
    super();
    this.state = {
      messageText: '',
      isTyping: false,
      user: null,
    };
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.blockEnterKey = this.blockEnterKey.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.stoppedTyping = this.stoppedTyping.bind(this);
    this.resetTextarea = this.resetTextarea.bind(this);
    this.handleActionGIF = this.handleActionGIF.bind(this);
  }


  componentWillMount() {
    // do a get on -> http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzCZ
    Bebo.User.getUser('me', (err, data) => {
      this.setState({ user: data });
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.blockEnterKey, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.blurChat) {
      this.refs.textarea.blur();
    } else if (!nextProps.blurChat) {
      this.refs.textarea.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.blockEnterKey);
    this.stoppedTyping();
  }

  blockEnterKey(e) {
    if (e.keyCode === 13) {
      this.handleSendChat(e);
    }
  }

  handleInputChange(e) {
    clearTimeout(this.isTypingTimeout);
    if (!this.state.isTyping) {
      this.setState({ isTyping: true });
      Bebo.emitEvent({ presence: { started_typing: this.state.user.user_id } });
      this.typingInterval = setInterval(() => {
        Bebo.emitEvent({ presence: { started_typing: this.state.user.user_id } });
      }, 3000);
    }
    this.isTypingTimeout = setTimeout(this.stoppedTyping, 3000);
    this.setState({ messageText: e.target.value }, () => {
      if (this.state.messageText.length === 0) {
        this.stoppedTyping();
      }
    });
  }

  stoppedTyping() {
    clearInterval(this.typingInterval);
    Bebo.emitEvent({ presence: { stopped_typing: this.state.user.user_id } });
    this.setState({ isTyping: false });
  }


  handleSendChat(e) {
    e.preventDefault();
    const text = this.state.messageText.trim();
    if (text.length > 0) {
      const message = {
        type: 'message',
        username: this.state.user.username,
        user_id: this.state.user.user_id,
        message: text,
        users: [],
      };

      // TODO mention stuff in users[]

      Bebo.Db.save('messages', message, this.broadcastChat);
      this.resetTextarea();
    } else {
      console.warn('no message, returning');
    }
  }
  resetTextarea() {
    this.setState({ messageText: '' });
  }
  broadcastChat(err, data) {
    if (err) {
      console.log('error', err);
      return;
    }
    const m = data.result[0];
    Bebo.Notification.broadcast('{{{user.username}}}:', m.message, { rate_limit_key: `${m.user_id}_${Math.floor(Date.now() / 1000 / 60 / 60)}` }, (error, resp) => {
      if (error) {
        return console.log('error sending notification', error);
      }
      return console.log('resp', resp); // an object containing success
    });
    Bebo.emitEvent({ message: m });
    // TODO check if any user is in str
  }

  handleInputFocus() {
    this.props.setChatInputState(true);
  }

  handleInputBlur() {
    this.props.setChatInputState(false);
  }

  handleActionGIF() {
    this.props.switchMode('gif');
  }

  renderActions() {
    return (<div className="chat-input--actions">
      <button className="chat-input--actions--item" onClick={this.handleActionGIF}>
        <svg viewBox="1024 508 24 18" version="1.1">
          <path d="M1024,511.994783 C1024,509.788525 1025.78429,508 1027.99005,508 L1044.00995,508 C1046.21359,508 1048,509.791716 1048,511.994783 L1048,522.005217 C1048,524.211475 1046.21571,526 1044.00995,526 L1027.99005,526 C1025.78641,526 1024,524.208284 1024,522.005217 L1024,511.994783 Z M1035.5,514 L1037,514 L1037,520 L1035.5,520 L1035.5,514 Z M1033,514 L1030,514 C1029.4,514 1029,514.5 1029,515 L1029,519 C1029,519.5 1029.4,520 1030,520 L1033,520 C1033.6,520 1034,519.5 1034,519 L1034,517 L1032.5,517 L1032.5,518.5 L1030.5,518.5 L1030.5,515.5 L1034,515.5 L1034,515 C1034,514.5 1033.6,514 1033,514 Z M1043,515.5 L1043,514 L1038.5,514 L1038.5,520 L1040,520 L1040,518 L1042,518 L1042,516.5 L1040,516.5 L1040,515.5 L1043,515.5 Z" id="Combined-Shape" stroke="none" fill="#FC5287" fillRule="evenodd"></path>
        </svg>
      </button>
    </div>);
  }

  render() {
    return (<div className="chat-input" style={this.state.mode === 'gif' ? { transform: 'translate3d(0,-100vh, 0' } : {}}>
      <div className="chat-input--left">
        {this.renderActions()}
      </div>
      <div className="chat-input--middle">
        <input
          type="text"
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          ref="textarea"
          placeholder="type a message.."
          onChange={this.handleInputChange}
          value={this.state.messageText}
        />
      </div>
    </div>);
  }
}

ChatInput.displayName = 'ChatInput';

// Uncomment properties you need
ChatInput.propTypes = {
  setChatInputState: React.PropTypes.func.isRequired,
  switchMode: React.PropTypes.func.isRequired,
};
// ChatInput.defaultProps = {};

export default ChatInput;
