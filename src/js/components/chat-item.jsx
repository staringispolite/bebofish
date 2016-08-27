import React from 'react';
import moment from 'moment';

class ChatItem extends React.Component {

  constructor() {
    super();
    this.state = {
      item: null,
      imageLoaded: false,
    };
  }


  componentWillMount() {
    const obj = this.props.item;
    if (this.props.item.username === '') {
      obj.username = obj.user_id.substr(0, 7);
    }
    this.setState({ item: obj });
  }

  componentDidMount() {
    this.props.handleNewMessage();
  }

  handleImageLoaded() {
    this.setState({ imageLoaded: true });
  }

  renderAvatar() {
    return (<div className="ui-avatar">
      <img src={`${Bebo.getImageUrl()}image/user/${this.state.item.user_id}`} role="presentation" />
    </div>);
  }

  renderTimestamp() {
    const d = moment(this.props.item.created_at).format('LT');
    return d;
  }

  renderContent() {
    if (this.props.item.type === 'image') {
      return (<span className={`chat-item--inner--message--content ' ${this.state.imageLoaded ? 'is-loaded' : 'is-loading'}`}>
        <div className="chat-item--inner--message--content--image">
          <img onLoad={this.handleImageLoaded} src={this.props.item.image.url} role="presentation" />
        </div>
      </span>);
    }
    return <span className="chat-item--inner--message--content">{this.props.item.message}</span>;
  }

  render() {
    return (<li className="chat-item">
      <div className="chat-item--inner">
        <div className="chat-item--inner--left">
          <div className="chat-item--inner--avatar">
            {this.renderAvatar()}
          </div>
        </div>
        <div className="chat-item--inner--right">
          <div className="chat-item--inner--meta">
            <span className="chat-item--inner--meta--username">{this.props.item.username}</span>
            <span className="chat-item--inner--meta--time">
              {this.renderTimestamp()}
            </span>
          </div>
          <div className="chat-item--inner--message">
            {this.renderContent()}
          </div>
        </div>
      </div>
    </li>);
  }
}

ChatItem.displayName = 'ChatItem';

// Uncomment properties you need
ChatItem.propTypes = {
  item: React.PropTypes.object.isRequired,
  handleNewMessage: React.PropTypes.func.isRequired,
};
// ChatItem.defaultProps = {};

export default ChatItem;
