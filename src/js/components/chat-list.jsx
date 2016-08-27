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

    this.getOldMessages = this.getOldMessages.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
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
    if (data.message) {
      this.handleMessageEvent(data.message);
    } else if (data.presence) {
      this.handlePresenceUpdates(data.presence);
    }
  }

  handleMessageEvent(message) {
    if (!this.state.scrolledPastFirstMessage) {
      this.addNewMessages([message]);
      if (message.user_id === this.props.actingUser.user_id) { this.scrollChatToBottom(); }
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
    if (user.started_typing === this.props.actingUser.user_id || user.stopped_typing === this.props.actingUser.user_id) {
      return;
    }

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
    if (this.state.messages && this.state.messages.length > 0) {
      return (<ul ref="chats" className="chat-list--inner--list">
        {this.state.messages.map((i) => <ChatItem handleNewMessage={this.handleNewMessage} item={i} key={i.id} />)}
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
