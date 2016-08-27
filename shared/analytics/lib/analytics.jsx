'use-strict';

import moment from 'moment';

class Analytics {

  constructor() {
    this.eventBuffer = [];
    this.retainedDays = null;
    this.canSendEvents = false;
  }

  track(category, label, action, value, streamId, data) {
    this.buffer({
      category,
      label,
      action,
      value,
      data,
    });
  }

  track2(category, action, label, value, streamId, data) {
    this.buffer({
      category,
      label,
      action,
      value,
      data,
    });
  }

  buffer(trackingObj) {
    const streamId = Bebo.getStreamId();
    const value = Number(trackingObj.value);
    const eventData = Object.assign({}, trackingObj, { value, stream_id: streamId });
    if (this.canSendEvents) {
      this.eventBuffer.push(eventData);
      this.send();
    } else {
      this.eventBuffer.push(eventData);
    }
  }

  send() {
    const aboutToSend = this.eventBuffer.slice();
    this.eventBuffer = [];
    const sendThese = [];

    aboutToSend.forEach((event) => {
      const newEvent = event;
      if (this.retainedDays >= 0) {
        if (event.data) {
          newEvent.data.dropin_days_cnt = this.retainedDays;
        } else {
          newEvent.data = {
            dropin_days_cnt: this.retainedDays,
          };
        }
      }
      sendThese.push(newEvent);
    });
    if (sendThese && sendThese.length > 0) {
      Bebo.sendAnalytics(sendThese, (err, resp) => {
        if (!err) {
          console.log('SENT EVENTS', resp);
        } else {
          console.error('ERROR SENDING EVENTS', err);
        }
      });
    }
  }

  trackRetention() {
    Bebo.onReady(() => {

      console.log('tracking retention');
      Bebo.User.getUser('me', (e, user) => {
        const userId = user.user_id;
        Bebo.Db.get('retention', { user_id: userId }, (err, DBGetResponse) => {
          if (!err) {
            if (DBGetResponse && DBGetResponse.result && DBGetResponse.result.length) {
              const previousData = DBGetResponse.result[0];
              const currentAt = DBGetResponse.current_at;
              const momentCreated = moment(previousData.created_dttm).valueOf();
              const days = Math.floor((currentAt - momentCreated) / 1000 / 60 / 60 / 24);
              if (days > previousData.days_cnt) {
                previousData.days_cnt = days;
                delete previousData.created_dttm;
                delete previousData.updated_dttm;
                Bebo.Db.save('retention', previousData, (er, DBSaveResp) => {
                  if (!er) {
                    console.log('updated', DBSaveResp);
                  } else {
                    console.error(err);
                  }
                });
                this.track(Bebo.getWidgetId(), 'user', 'retained', days);
              }
              this.retainedDays = days;
              this.canSendEvents = true;
              this.send();
            } else {
              Bebo.Db.save('retention', { user_id: userId, days_cnt: 0 }, (error, DBSaveResp) => {
                if (!error) {
                  console.log('created', DBSaveResp);
                  this.track(Bebo.getWidgetId(), 'user', 'retained', 0);
                  this.retainedDays = 0;
                  this.canSendEvents = true;
                  this.send();
                } else {
                  console.error(err);
                }
              });
            }
          } else {
            console.error(err);
          }
        });
      });
    });
  }
}
module.exports = Analytics;
