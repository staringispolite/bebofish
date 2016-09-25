import React from 'react';
import ChatItem from './chat-item.jsx';

import '../../css/_chat-list.scss';

class ChatList extends React.Component {

  constructor() {
    super();
    this.state = {
      maxCount: 50,
      scrolledPastFirstMessage: false,
      isScrolling: false,
      messages: [],
      unloadedMessages: [],
      usersTypingCount: 0,
    };
    this.usersTyping = {};

    this.getOldMessages = this.getOldMessages.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.translateMessage = this.translateMessage.bind(this);
    this.handleEventUpdate = this.handleEventUpdate.bind(this);
    this.handleMessageEvent = this.handleMessageEvent.bind(this);
    this.addNewMessages = this.addNewMessages.bind(this);
    this.handlePresenceUpdates = this.handlePresenceUpdates.bind(this);
    this.scrollChatToBottom = this.scrollChatToBottom.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.updatePresence = this.updatePresence.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
    this.renderNoChatsMessage = this.renderNoChatsMessage.bind(this);
    this.renderMessagesBadge = this.renderMessagesBadge.bind(this);
    this.renderUsersAreTyping = this.renderUsersAreTyping.bind(this);
    this.renderChatList = this.renderChatList.bind(this);
  }

  componentWillMount() {
    this.getOldMessages();
    // eslint-disable-next-line
    Bebo.onEvent(this.handleEventUpdate);
  }

  componentWillUnmount() {
    if(this.presenceTimeout) {
      clearTimeout(this.presenceTimeout);
    }
    if(this.presenceInterval) {
      clearInterval(this.presenceInterval);
    }
  }

  getOldMessages() {
    // eslint-disable-next-line
    Bebo.Db.get('messages', { count: 50 }, (err, data) => {
      if (err) {
        console.log('error getting list');
        return;
      }
      const list = data.result.reverse();
      // Save the object's this state for use in the callback.
      var _this = this;
      // Loop through and translate all messages.
      for (var i = 0; i < list.length; i++) {
        this.translateMessage(list[i], function(translatedMessage) {
          list[i].message = translatedMessage.message;
          _this.setState({ messages: list });
        });
      }
      this.setState({ messages: list });
    });
  }

  handleScroll() {
    const list = this.refs.chatListInner;
    const item = this.refs.chats.lastChild;

    const diff = list.scrollHeight - list.offsetHeight - item.clientHeight;

    if (list.scrollTop <= diff && !this.state.scrolledPastFirstMessage) {
      this.setState({ scrolledPastFirstMessage: true });
    } else if (list.scrollTop >= diff && this.state.scrolledPastFirstMessage) {
      this.scrollChatToBottom();
    }
  }

  handleEventUpdate(data) {
    if (data.type === 'chat_sent') {
      this.handleMessageEvent(data.message);
    }
    if (data.type === 'chat_presence') {
      this.handlePresenceUpdates(data.presence);
    }
  }

  // Calls callback(translatedMessage)
  translateMessage(message, callback) {
    // Google Translate logic here
    var APIkey = 'AIzaSyBuQYwgfhjtnRSD2U90DSbWMwYwkWPfJ4U';

    // Build API call URL.
    var fromLang = undefined;
    // var toLang = 'de';
    var toLang = navigator.language.split('-')[0];
    var URL = 'https://www.googleapis.com/language/translate/v2?key=' +
      APIkey + '&q=' + encodeURIComponent(message.message); 
    if (fromLang !== undefined) {
      URL += '&source=' + fromLang;
    }
    URL += '&target=' + toLang;

    // AJAX to Google Translate
    fetch(URL).then(function(response) {
      return response.json();
    }).then(function(response) {
      // Overwrite client-side message with translated one.
      //console.log("overwriting '" + message.message + "' with '" + response.data.translations[0].translatedText + "'");
      message.message = response.data.translations[0].translatedText;
      console.log(response.data);

      // Success!
      callback(message);
    }).catch(function() {
      console.log("Booo");
    });
  }

  handleMessageEvent(message) {
    var _this = this;
    // Only translate messages that aren't yours.
    if (message.user_id !== this.props.actingUser.user_id) {
      this.translateMessage(message, function(translatedMessage) {
        if (!_this.state.scrolledPastFirstMessage) {
          _this.addNewMessages([message]);
          if (message.user_id === _this.props.actingUser.user_id) {
            _this.scrollChatToBottom();
          }
        } else {
          const messages = _this.state.unloadedMessages;
          messages.push(message);
          _this.setState({ unloadedMessages: messages });
        }
      });
    } else {
      if (!_this.state.scrolledPastFirstMessage) {
        _this.addNewMessages([message]);
        if (message.user_id === _this.props.actingUser.user_id) {
          _this.scrollChatToBottom();
        }
      } else {
        const messages = _this.state.unloadedMessages;
        messages.push(message);
        _this.setState({ unloadedMessages: messages });
      }
    }
  }


  addNewMessages(arr) {
    const messages = this.state.messages.concat(arr);
    this.setState({
      messages,
      unloadedMessages: [],
    });
  }

  handlePresenceUpdates(user) {
    if (user.started_typing === this.props.actingUser.user_id || user.stopped_typing === this.props.actingUser.user_id) {
      return;
    }
    if(this.presenceTimeout) {
      clearTimeout(this.presenceTimeout);
    }
    this.presenceTimeout = setTimeout(() => {
      if(this.presenceInterval) {
        clearInterval(this.presenceInterval);
      }
    }, 4000);

    if (user.started_typing) {
      this.usersTyping[user.started_typing] = Date.now();

      if (!this.presenceInterval) {
        this.updatePresence();
        this.presenceInterval = setInterval(this.updatePresence, 3000);
      }
    } else if (user.stopped_typing && this.usersTyping[user.stopped_typing]) {
      delete this.usersTyping[user.stopped_typing];
      this.updatePresence();
    }
  }
  updatePresence() {
    const usersTypingCount = Object.keys(this.usersTyping).length;
    if(usersTypingCount === 0) {
      clearInterval(this.presenceInterval);
    }
    this.setState({ usersTypingCount });
  }
  scrollChatToBottom() {
    if (this.state.unloadedMessages.length > 0) {
      this.addNewMessages(this.state.unloadedMessages);
    }
    this.refs.chatListInner.scrollTop = this.refs.chatListInner.scrollHeight;

    this.setState({
      scrolledPastFirstMessage: false,
    });
  }


  handleNewMessage() {
    if (!this.state.scrolledPastFirstMessage) {
      this.scrollChatToBottom();
    }
  }

  handleListClick() {
    this.props.blurChat();
  }

  // Renders

  renderNoChatsMessage() {
    return <div className="chat-list--no-messages" />;
  }

  renderMessagesBadge() {
    if (this.state.unloadedMessages.length > 0) {
      return (<div className="chat-list--unseen-messages" onClick={this.scrollChatToBottom}>
        <span className="chat-list--unseen-messages--text">{`${this.state.unloadedMessages.length} New Messages`}</span>
      </div>);
    }
    return null;
  }

  renderUsersAreTyping() {
    const count = this.state.usersTypingCount;
    return (<div className="chat-list--users-typing" style={count > 0 ? {} : { transform: 'translate3d(0,100%,0)' }}>
      <span className="chat-list--users-typing--text">{count === 1 ? '1 person is typing right now...' : `${count} people are typing right now...`}</span>
    </div>);
  }

  renderChatList() {
    const { messages } = this.state;
    if (messages && messages.length) {
      return (<ul ref="chats" className="chat-list--inner--list">
        {messages.map((item, i) => <ChatItem handleNewMessage={this.handleNewMessage} item={item} prevItem={messages[i - 1] || {}} key={item.id} />)}
      </ul>);
    }
    return (<ul className="chat-list--inner--list">
      {this.renderNoChatsMessage}
    </ul>);
  }

  render() {
    const count = this.state.usersTypingCount;
    return (<div className="chat-list">
      {this.renderMessagesBadge()}
      <div style={count > 0 ? { transform: 'translate3d(0,-37px,0)' } : {}} ref="chatListInner" className="chat-list--inner" onScroll={this.handleScroll} onClick={this.handleListClick}>
        {this.renderChatList()}
      </div>
      {this.renderUsersAreTyping()}
    </div>);
  }

}

ChatList.displayName = 'ChatList';

// Uncomment properties you need
ChatList.propTypes = {
  blurChat: React.PropTypes.func.isRequired,
  actingUser: React.PropTypes.object.isRequired,
};
// ChatList.defaultProps = {};

export default ChatList;
