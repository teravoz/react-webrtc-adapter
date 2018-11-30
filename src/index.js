import React, { createRef, Component, Fragment } from 'react';
import Script from 'react-load-script'
import EventEmitter from 'events';
import { Error, Loading } from './views';

export default (WrappedComponent, opts) => {

  class TeravozAdapterHandler {
    constructor(handler) {
      const handle = (method) => (...args) => handler[method](...args);

      this.register = handle('register');
      this.unregister = handle('unregister');
      this.call = handle('call');
      this.dial = handle('dial');
      this.hold = handle('hold');
      this.unhold = handle('unhold');
      this.accept = handle('accept');
      this.decline = handle('decline');
      this.mute = handle('mute');
      this.unmute = handle('unmute');
      this.hangup = handle('hangup');
    }
  }

  class TeravozAdapter extends Component {

    constructor(props) {
      super(props);
      this.teravozAudioLocalStream = createRef();
      this.teravozAudioRemoteStream = createRef();
      this.state = {
        events: new EventEmitter(),
        handler: null,
        scriptLoaded: false,
        scriptError: false,
        webRTCStarted: false
      };
    }

    handleEvent = (type, ...payload) => {
      this.state.events.emit(type, ...payload);
      this.state.events.emit('*', type, ...payload);
    }

    handleWebRTCSuccess = (handler) => {
      this.handleEvent('success', null);
      this.setState({
        handler: new TeravozAdapterHandler(handler),
        webRTCStarted: true
      });
    }

    handleScriptError = () => {
      this.setState({ scriptError: true });
    }

    handleScriptLoad = () => {
      const eventHandler = (type) => (...payload) => this.handleEvent(type, ...payload);

      Teravoz.start({
        gatewayCallbacks: {
          closed: eventHandler('gateway-closed'),
          error: eventHandler('gateway-error'),
          success: eventHandler('gateway-success')
        },
        webRTCCallbacks: {
          success: this.handleWebRTCSuccess,
          error: eventHandler('error'),
          registering: eventHandler('registering'),
          registered: eventHandler('registered'),
          registrationFailed: eventHandler('registrationFailed'),
          calling: eventHandler('calling'),
          incomingCall: eventHandler('incomingCall'),
          earlyMedia: eventHandler('earlyMedia'),
          acceptedCall: eventHandler('acceptedCall'),
          missedCall: eventHandler('missedCall'),
          hangingUp: eventHandler('hangingUp'),
          hangup: eventHandler('hangup'),
          webRTCState: eventHandler('webRTCState'),
          DTMF: eventHandler('DTMF'),
          isReceivingMedia: eventHandler('isReceivingMedia'),
          cleanup: eventHandler('cleanup')
        }
      }, {
        localStream: this.teravozAudioLocalStream.current,
        remoteStream: this.teravozAudioRemoteStream.current
      });

      this.setState({ scriptLoaded: true });
    }

    render() {
      const { events, handler, scriptLoaded, scriptError, webRTCStarted } = this.state;
      const props = {
        ...this.props,
        teravoz: {
          events,
          ...handler
        }
      };
      return (
        <Fragment>
          {
            (scriptError && <Error />) ||
            (scriptLoaded && webRTCStarted && <WrappedComponent { ...props } />) ||
            <Loading />
          }
          <Script
            attributes={{ 'data-id':'teravoz', 'data-key': opts.apiKey }}
            url="https://cdn.teravoz.com.br/webrtc/v1/teravoz-webrtc.js"
            onCreate={ () => {} }
            onError={ this.handleScriptError }
            onLoad={ this.handleScriptLoad }
          />
          <audio ref={this.teravozAudioLocalStream} controls autoPlay muted="muted"></audio>
          <audio ref={this.teravozAudioRemoteStream} controls autoPlay></audio>
        </Fragment>
      );
    }
  }

  return TeravozAdapter;
}
