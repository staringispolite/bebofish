import React from 'react';
import moment from 'moment';
import Linkify from 'react-linkify';

import '../../css/_chat-item.scss';

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

  handleLinkClick(e) {
    e.preventDefault();
    // eslint-disable-next-line
    Bebo.openURI(e.target.href);
  }

  renderAvatar(isRepeat) {
    const { item } = this.props;
    if (isRepeat) {
      return null;
    }
    const pixelRatio = window.devicePixelRatio;
    const size = 36 * pixelRatio;
    // eslint-disable-next-line
    const url = `${Bebo.getImageUrl()}image/user/${item.user_id}?h=${size}&w=${size}`;
    return (<div className="ui-avatar">
      <img src={url} role="presentation" />
    </div>);
  }

  renderTimestamp(isRepeat) {
    const { item } = this.props;
    if (isRepeat) {
      return null;
    }
    return moment(item.created_at).format('LT');
  }

  renderContent(isRepeat) {
    const { type, image } = this.props.item;
    if (type === 'image') {
      const { webp, url, width, height } = image;
      const ratio = 120 / height;
      // eslint-disable-next-line
      const gifUrl = Bebo.getDevice() === 'android' ? webp || url : url;
      return (<span className={`chat-item--inner--message--content ' ${this.state.imageLoaded ? 'is-loaded' : 'is-loading'}`}>
        <div className="chat-item--inner--message--content--image">
          <div style={{ backgroundImage: `url(${gifUrl.replace('http://', 'https://')})`, height: `${height * ratio}px`, width: `${width * ratio}px` }} />
        </div>
      </span>);
    }
    return <Linkify properties={{onClick: this.handleLinkClick}} className="chat-item--inner--message--content">{this.props.item.message}</Linkify>;
  }

  render() {
    const { prevItem, item } = this.props;
    const isRepeat = (item.type !== 'image' && prevItem.user_id === item.user_id) && ((item.created_at-prevItem.created_at) < 60*60*1000);
    return (<li className="chat-item" style={isRepeat ? { padding: 0 } : {}}>
      <div className="chat-item--inner">
        <div className="chat-item--inner--left">
          <div className="chat-item--inner--avatar" style={isRepeat ? { visibility: 'hidden', height: 'auto' } : {}}>
            {this.renderAvatar(isRepeat)}
          </div>
        </div>
        <div className="chat-item--inner--right">
          <div className="chat-item--inner--meta">
            <span style={isRepeat ? { display: 'none' } : {}} className="chat-item--inner--meta--username">{this.props.item.username}</span>
            <span style={isRepeat ? { display: 'none' } : {}} className="chat-item--inner--meta--time">
              {this.renderTimestamp(isRepeat)}
            </span>
          </div>
          <div className="chat-item--inner--message" style={isRepeat ? { margin: 0 } : {}}>
            {this.renderContent(isRepeat)}
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
  prevItem: React.PropTypes.object.isRequired,
};
// ChatItem.defaultProps = {};

export default ChatItem;
