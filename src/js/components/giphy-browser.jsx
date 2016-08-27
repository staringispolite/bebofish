import React from 'react';

import Fetch from '../utils/Fetch.jsx';

class GiphyBrowser extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.broadcastChat = this.broadcastChat.bind(this);
  }

  componentWillMount() {

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
    const { username, user_id } = this.props.actingUser;
    return (<div className="giphy-browser" style={this.props.style}>
      <Fetch url="http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC">
        {({ data }) => data ? (
          <div className="gif-list-container">
            {data.data.map((gif, i) =><div className="gif-wrapper" key={i} onClick={() => {
                const image = {
                  preview: gif.images.downsized_still.url,
                  url: gif.images.downsized_medium.url,
                  width: gif.images.downsized_still.width,
                  height: gif.images.downsized_still.height,
              };
              const message = {
                image,
                username,
                user_id,
                type: 'image',
              };

              Bebo.Db.save('messages', message, this.broadcastChat);

              }}><img className="gif" role="presentation" src={gif.images.downsized.url}/></div>
            )}
          </div>
        ) : null }
      </Fetch>
    </div>);
  }
}

GiphyBrowser.displayName = 'GiphyBrowser';

// Uncomment properties you need
GiphyBrowser.propTypes = {
  switchMode: React.PropTypes.func.isRequired,
  actingUser: React.PropTypes.object.isRequired,
};
// GiphyBrowser.defaultProps = {};


export default GiphyBrowser;
