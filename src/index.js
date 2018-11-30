import React, { createRef, Component, Fragment } from 'react';
import Script from 'react-load-script'
import EventEmitter from 'events';

export default (WrappedComponent, opts) => {

  class HandlerActions {

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
        actions: null,
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
        actions: new HandlerActions(handler),
        webRTCStarted: true
      });
    }

    // when the script loads, the HOC should start the Teravoz lib and set all
    // its callbackst to make it available
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

    handleScriptError = (error) => {
      this.setState({ scriptError: true });
    }

    render() {
      const { events, actions, scriptLoaded, scriptError, webRTCStarted } = this.state;
      const { apiKey, errorComponent, loadingComponent } = opts;
      const props = {
        ...this.props,
        teravoz: {
          events,
          ...actions
        }
      };
      return (
        <Fragment>
          {
            (scriptError && (errorComponent || 'Error loading the Teravoz client')) ||
            (scriptLoaded && webRTCStarted && <WrappedComponent { ...props } />) ||
            (loadingComponent || 'Loading')
          }
          <Script
            attributes={{ 'data-id':'teravoz', 'data-key': apiKey }}
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
