import React from 'react';
import ChatItem from './chat-item.jsx';


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
  }

  componentWillMount() {
    this.getOldMessages();
    Bebo.onEvent(this.handleEventUpdate);
  }

  getOldMessages() {
    Bebo.Db.get('messages', { count: 50 }, (err, data) => {
      if (err) {
        console.log('error getting list');
        return;
      }
      const list = data.result.reverse();
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
    console.log('new event', data);
    if (data.message) {
      this.handleMessageEvent(data.message);
    } else if (data.presence) {
      this.handlePresenceUpdates(data.presence);
    }
  }

  handleMessageEvent(message) {
    if (!this.state.scrolledPastFirstMessage) {
      this.addNewMessages([message]);
      if (message.user_id === this.state.user.user_id) { this.scrollChatToBottom(); }
    } else {
      const messages = this.state.unloadedMessages;
      messages.push(message);
      this.setState({ unloadedMessages: messages });
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
    console.log('user add to obj', user);

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
    // TODO update presence
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
    } else {
      return;
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
    const usersTypingCount = this.state.usersTypingCount;
    if (usersTypingCount > 0) {
      return (<div className="chat-item chat-list--users-typing">
        <span className="chat-list--user-typing--text">{usersTypingCount === 1 ? '1 person is typing right now...' : `${usersTypingCount} people are typing righw now...`}</span>
      </div>);
    }
    return null;
  }

  renderChatList() {
    if (this.state.messages && this.state.messages.length > 0) {
      return (<ul ref="chats" className="chat-list--inner--list">
        {this.state.messages.map((i) => <ChatItem handleNewMessage={this.handleNewMessage} item={i} key={i.id} />)}
        {this.renderUsersAreTyping()}
      </ul>);
    }
    return (<ul className="chat-list--inner--list">
      {this.renderNoChatsMessage}
    </ul>);
  }

  render() {
    return (<div className="chat-list">
      {this.renderMessagesBadge()}
      <div ref="chatListInner" className="chat-list--inner" onScroll={this.handleScroll} onClick={this.handleListClick}>
        {this.renderChatList()}
      </div>
    </div>);
  }

}

ChatList.displayName = 'ChatList';

// Uncomment properties you need
ChatList.propTypes = {
  blurChat: React.PropTypes.func.isRequired,
};
// ChatList.defaultProps = {};

export default ChatList;
