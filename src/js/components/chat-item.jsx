import React from 'react';
import moment from 'moment';

class ChatItem extends React.Component {

  constructor() {
    super();
    this.state = {
      item: null,
      imageLoaded: false,
    };
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderTimestamp = this.renderTimestamp.bind(this);
    this.renderContent = this.renderContent.bind(this);
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
    return moment(this.props.item.created_at).format('LT');
  }

  renderContent() {
    const { type, image } = this.props.item;
    if (type === 'image') {
      const { webp, url, width, height } = image;
      const ratio = 120 / height;
      const gifUrl = Bebo.getDevice() === 'android' ? webp || url : url;
      return (<span className={`chat-item--inner--message--content ' ${this.state.imageLoaded ? 'is-loaded' : 'is-loading'}`}>
        <div className="chat-item--inner--message--content--image">
          <div style={{ backgroundImage: `url(${gifUrl.replace('http://', 'https://')})`, height: `${height * ratio}px`, width: `${width * ratio}px` }} />
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
