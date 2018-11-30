import React, { Component, Fragment } from 'react';
import EventEmitter from 'events';

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

    state = {
      events: new EventEmitter(),
      handler: null,
      loaded: false
    }

    handleEvent = (type, ...payload) => {
      this.state.events.emit(type, ...payload);
      this.state.events.emit('*', type, ...payload);
    }

    handleWebRTCSuccess = (handler) => {
      this.setState({ handler: new TeravozAdapterHandler(handler) });
      this.handleEvent('success', null);
    }

    componentDidMount() {
      const streams = { localStream, remoteStream } = this.opts;
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
      }, streams);
    }

    render() {
      const props = {
        ...this.props,
        teravoz: {
          ...this.state.teravoz,
          ...this.state.handler
        }
      };
      return (
        <Fragment>
          <WrappedComponent ...props />
          <script script data-id="teravoz" data-key={ opts.apiKey } src="https://cdn.teravoz.com.br/webrtc/v1/teravoz-webrtc.js" />
        </Fragment>
      );
    }
  }

  return (<TeravozAdapter />);
}
