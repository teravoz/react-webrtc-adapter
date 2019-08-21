import React, { createRef, Component, Fragment } from 'react';
import Script from 'react-load-script';
import EventEmitter from 'events';

export default (WrappedComponent, opts) => {

  class HandlerActions {

    constructor(handler) {
      const handle = (method) => (...args) => handler[method](...args);

      this.register = handle('register');
      this.refresh = handle('refresh');
      this.unregister = handle('unregister');
      this.dial = handle('dial');
      this.hold = handle('hold');
      this.unhold = handle('unhold');
      this.mute = handle('mute');
      this.unmute = handle('unmute');
      this.hangUp = handle('hangUp');
      this.sendDTMF = handle('sendDTMF');
      this.setDevices = handle('setDevices');
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
        webRTCStarted: false,
        error: false
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

    handleWebRTCError = (err) => {
      this.handleEvent('fail', err);
      this.setState({ error: true });
    }

    // when the script loads, the HOC should start the Teravoz lib and set all
    // its callbackst to make it available
    handleScriptLoad = () => {
      const eventHandler = (type) => (...payload) => this.handleEvent(type, ...payload);

      Teravoz.start({
        origin: opts.origin || null,
        gatewayCallbacks: {
          closed: eventHandler('gateway-closed'),
          error: eventHandler('gateway-error'),
          success: eventHandler('gateway-success'),
          disconnect: eventHandler('gateway-disconnect'),
          reconnect: eventHandler('gateway-reconnect')
        },
        webRTCCallbacks: {
          success: this.handleWebRTCSuccess,
          error: this.handleWebRTCError,
          registering: eventHandler('registering'),
          registered: eventHandler('registered'),
          registrationFailed: eventHandler('registrationFailed'),
          unregistering: eventHandler('unregistering'),
          unregistered: eventHandler('unregistered'),
          calling: eventHandler('calling'),
          incomingCall: eventHandler('incomingCall'),
          earlyMedia: eventHandler('earlyMedia'),
          acceptedCall: eventHandler('acceptedCall'),
          missedCall: eventHandler('missedCall'),
          hangingUp: eventHandler('hangingUp'),
          hangUp: eventHandler('hangUp'),
          webRTCState: eventHandler('webRTCState'),
          DTMF: eventHandler('DTMF'),
          isReceivingMedia: eventHandler('isReceivingMedia'),
          cleanUp: eventHandler('cleanUp')
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
      const { events, actions, scriptLoaded, scriptError, error, webRTCStarted } = this.state;
      const { apiKey, errorComponent, loadingComponent, url } = opts;
      const props = {
        ...this.props,
        teravoz: {
          events,
          ...actions,
          streams: {
            local: this.teravozAudioLocalStream,
            remote: this.teravozAudioRemoteStream
          }
        }
      };

      const attributes = { 'data-id':'teravoz' };

      if (apiKey) {
        attributes['data-key'] = apiKey;
      }


      return (
        <Fragment>
          {
            ((scriptError || error) && (errorComponent || 'Error loading the Teravoz client')) ||
            (scriptLoaded && webRTCStarted && <WrappedComponent { ...props } />) ||
            ((!error && loadingComponent) || 'Loading')
          }
          {
            <Script
              attributes={ attributes }
              url={ url || "https://cdn.teravoz.com.br/webrtc/v1/teravoz-webrtc.js" }
              onCreate={ () => {} }
              onError={ this.handleScriptError }
              onLoad={ this.handleScriptLoad }
            />
          }
          <audio ref={this.teravozAudioLocalStream} controls autoPlay muted="muted"></audio>
          <audio ref={this.teravozAudioRemoteStream} controls autoPlay></audio>
        </Fragment>
      );
    }
  }

  return TeravozAdapter;
}
