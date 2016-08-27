/**
 * Created by jonas on 7/30/16.
 */
const Analytics = require('../../analytics');
class Error {
  constructor() {
    this.errors = [];
    this.canSend = false;
    this.reCheck = null;
  }

  handleErrorThrown(message, source, lineno, colno, error) {
    try {
      const stackTrace = error.stack.split(/\n/);
      const fStackArr = [];
      stackTrace.forEach((stack) => {
        const split = stack.split('@');
        if (split.length && split.length > 1) {
          if (split[1] !== '[native code]') {
            let fileLineCol = split[1].split('/');
            fileLineCol = fileLineCol[fileLineCol.length - 1];
            const output = `${split[0]} — ${fileLineCol} — ${split[1]}`;
            fStackArr.push(output);
          }
        } else {
          let fileLineCol = split[0].split('/');
          fileLineCol = fileLineCol[fileLineCol.length - 1];
          const output = `${fileLineCol} — ${split[1]}`;
          fStackArr.push(output);
        }
      });

      Error.errors.push({
        message,
        source,
        lineNumber: lineno,
        colNumber: colno,
        stackTrace: fStackArr,
      });
      Error.sendErrors();
    } catch (err) {
      console.error('ERRORHANDLER ERROR - handleErrorTrown ::', err);
    }
  }

  initSending() {
    try {
      this.canSend = true;
    } catch (err) {
      console.error('ERRORHANDLER ERROR - initSending ::', err);
    }
  }

  sendErrors() {
    try {
      if (this.canSend) {
        const ErrorQue = this.errors.slice();
        this.errors = [];

        ErrorQue.forEach((error) => {
          const event = Error.buildTrackingEvent(error);

          Analytics.buffer(event);
        });
      } else {
        if (this.reCheck) {
          clearTimeout(this.reCheck);
        }
        this.reCheck = setTimeout(() => {
          this.sendErrors();
        }, 500);
      }
    } catch (err) {
      console.error('ERRORHANDLER ERROR - sendErrors ::', err);
    }
  }

  buildTrackingEvent(error) {
    try {
      const trackingEvent = {
        category: 'Error',
        label: Bebo.getWidgetId(),
        action: error.stackTrace[0].split(' ')[0],
        value: 1,
        data: {
          stackTrace_tx: error.stackTrace,
          mesage_tx: error.message,
        },
      };
      return trackingEvent;
    } catch (err) {
      console.error('ERRORHANDLER ERROR - buildTrackingEvent ::', err);
      return null;
    }
  }
}
module.exports = Error;
