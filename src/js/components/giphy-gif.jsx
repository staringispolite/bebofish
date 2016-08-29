import React from 'react';

class GiphyGif extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.broadcastChat = this.broadcastChat.bind(this);
  }

  broadcastChat(err, data) {
    if (err) {
      console.log('error', err);
      return;
    }
    const m = data.result[0];
    Bebo.Notification.broadcast('{{{user.username}}}', ' just posted a GIF', { rate_limit_key: `${m.user_id}_${Math.floor(Date.now() / 1000 / 60 / 60)}` }, (error, resp) => {
      if (error) {
        return console.log('error sending notification', error);
      }
      return console.log('resp', resp); // an object containing success
    });
    Bebo.emitEvent({ message: m });

    this.props.switchMode('text');
  }


  render() {
    const { gif, actingUser, children, originalSize } = this.props;
    const { username, user_id } = actingUser;
    const { url, webp } = gif.images.fixed_width_downsampled;
    const gifUrl = Bebo.getDevice() === 'android' ? webp || url : url;
    return (<div
      className="gif-wrapper"
      onClick={this.props.onClick ? (this.props.onClick) : (() => {
        const image = {
          preview: gif.images.downsized_still.url,
          url: gif.images.fixed_width_downsampled.url,
          webp: gif.images.fixed_width_downsampled.webp,
          width: gif.images.fixed_width_downsampled.width,
          height: gif.images.fixed_width_downsampled.height,
        };
        const message = {
          image,
          username,
          user_id,
          type: 'image',
        };
        Bebo.Db.save('messages', message, this.broadcastChat);
      })}
    >
      {originalSize ? (
        <img className="gif" style={{ paddingTop: 0 }} role="presentation" src={gifUrl.replace('http://', 'https://')} />
      ) : (
        <div className="gif" style={{ backgroundImage: `url(${gifUrl.replace('http://', 'https://')})` }} />
      )}

      {children}
    </div>);
  }
}

GiphyGif.displayName = 'GiphyGif';

// Uncomment properties you need
GiphyGif.propTypes = {
  gif: React.PropTypes.object.isRequired,
  actingUser: React.PropTypes.object.isRequired,
  switchMode: React.PropTypes.func.isRequired,
  onClick: React.PropTypes.func,
  children: React.PropTypes.element,
  originalSize: React.PropTypes.bool,
};
// GiphyGif.defaultProps = {};


export default GiphyGif;
