# react-webrtc-adapter

Teravoz WebRTC Library as a React Component

# How it works ?

  - It works like a High Order Component in React, wrapping your component appending the WebRTC methods to it.

  - Load WebRTC in a page of your choice.

# How to use ?

  - Generate your **API_KEY** [(Teravoz API Documentation)](https://developers.teravoz.com.br/#webrtc)

  ```jsx
    import React from 'react';
    import teravozWebRTCAdapter from 'react-webrtc-adapter';

    import styles from './style.scss';

    class App extends React.Component {
      componentWillMount() {
        // Listening to the events coming from the WebRTC
        this.props.teravoz.events.on('*', (type, payload) => {
          switch(type) {
            case 'registering':
              /**
               * You are registering the peer
               */
              break;
            case 'registered':
              /**
               * Peer has been registered
               */
              break;
            case 'registrationFailed':
              /**
               * Peer registration failed
               */
              break;
            case 'calling':
              /**
               * Your are calling a number
               * You may add a fake ringing song until it reaches the carrier
               */
              break;
            case 'incomingCall': 
              /**
               * You may accept or decline an incoming call
               * use the payload.accept() to accept or the
               * payload.decline() to decline call. 
               */
              break;
            case 'earlyMedia':
              /**
               *  It reached the carrier, so that a sound will be emitted, event if the call is not picked
               */
              break;
            case 'acceptedCall':
              /**
               * The call was accepted
               * Do something with the UI
               */
              break;
            case 'missedCall':
              /**
               * Someone tried to call you
               */
              break;
            case 'hangingUp':
              /**
               * Hanging up the call
               Add a loader
               */
              break;
            case 'hangup':
              /**
               * Got a hangup
               */
              break;
            case 'webRTCState':
              /**
               * The state of the webrtc connection
               */
              break;
            case 'DTMF':
              /**
               * WebRTC is active
               */
              break;
            case 'isReceivingMedia':
              /**
               * Audio is being received
               */
              break;
            case 'cleanup':
              /**
               * Event emitted right after every WebRTC Peer Connection ends
               */
              break;
          }
        });
      }

      render() {
        return (
          <div className={ styles.main }>
              
          </div>
        )
      }
    }

    export default teravozWebRTCAdapter(App, 'API_KEY')
  ```