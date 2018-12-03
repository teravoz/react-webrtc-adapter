# React WebRTC Adapter 

[![NPM Version][npm-image]][npm-url]
[![PRs Welcome][pr-image]][pr-url]

React HOC that bind the Teravoz WebRTC Library to your component props.

Have Teravoz WebRTC binded wherever you want.

```javascript
import React, { Component } from 'react';
import teravozWebRTCAdapter from '@teravoz/react-webrtc-adapter';

class MyComponent extends Component {

  render() {
    this.props.teravoz.*
    ...
  }
}

exports default teravozWebRTCAdapter(MyComponent, {
  apiKey: '<your-api-key>'
});
```

## Installation

This is a [React](https://github.com/facebook/react) module that wraps the Teravoz WebRTC adapter and is available through the [npm](https://www.npmjs.com/package/@teravoz/react-webrtc-adapter).

Installation is done with `npm install` or `yarn add`:

```bash
npm install --save @teravoz/react-webrtc-adapter
# or
yarn add @teravoz/react-webrtc-adapter
```

## Initialization Options

* **apiKey** *(Required)* - initializes the Teravoz WebRTC pipe (generate you Teravoz api key [here](https://developers.teravoz.com.br/#webrtc)).
* **loadingComponent** - component that will be rendered when loading the Teravoz WebRTC dependencies.
* **errorComponent** - component that will be rendered when an error occurs.

# Methods

There are several methods that enables the communication capabilities.
Below you can find all the methods provided by the Teravoz Library to register a peer and make/receive calls.
For detailed information, see the [Methods Reference](#methods-reference).

### Registering

* [`register`](#register)
* [`unregister`](#unregister)

### General
* [`dial`](#dial)
* [`hold`](#hold)
* [`unhold`](#unhold)
* [`mute`](#mute)
* [`unmute`](#unmute)
* [`hangup`](#hangup)

## Methods Reference

## `register` 
```javascript
this.props.teravoz.register({ username: 'username', password: 'password' });
```

The `register()` method is required to initialize a session with the Teravoz platform.

For initialization it requires a Javascript object with the following properties:
* **username** *(string)* - your peer number
* **password** *(string)* - your peer password

The `register()` method returns a `Promise`. Once the `Promise` is resolved, you are able to make and receive calls.

> PS: you can handle the promise with the `.then()` callback method or using `async/await`.

## `unregister`
```javascript
this.props.teravoz.unregister();
```

The `unregister()` method must be used when a user/peer need to be logged out.

## `dial`
```javascript
this.props.teravoz.dial({ numberTo: '011987654321', error: console.error });
```

The `dial()` method must be used to start a call. It requires a Javascript object with the following properties:
* **numberTo** *(string)* - the number who will be called
* **error** *(function)* - a callback function to handle a call error

## `hold`
```javascript
this.props.teravoz.hold();
```

The `hold()` method put an ongoing call in a holding state.

## `unhold`
```javascript
this.props.teravoz.unhold();
```

The `unhold()` method recovers a holded call to an ongoing state.

## `mute`
```javascript
this.props.teravoz.mute();
```

The `mute()` method mute an ongoing call.

## `unmute`
```javascript
this.props.teravoz.unmute();
```

The `unmute()` method unmute an ongoing call.

## `hangup`
```javascript
this.props.teravoz.hangup();
```

The `hangup()` method hangup an ongoing call.

# Events

There are several events received by the Teravoz WebRTC Adapter during a session.
For detailed information, see the [Events Reference](#events-reference).

### Registering

These events are received when a registration is requested.

* [`registering`](#on-registering)
* [`registered`](#on-registered)
* [`registrationFailed`](#on-registrationfailed)
* [`unregistering`](#on-unregistering)
* [`unregistered`](#on-unregistered)

### Incoming Call

* [`incomingCall`](#on-incomingcall)
* [`acceptedCall`](#on-acceptedcall)
* [`isReceivingMedia`](#on-isreceivingmedia)
* [`DTMF`](#on-dtmf)
* [`hangUp`](#on-hangup)
* [`missedCall`](#on-missedcall)
* [`cleanUp`](#on-cleanup)

### Outgoing Call

* [`calling`](#on-calling)
* [`earlyMedia`](#on-earlymedia)
* [`isReceivingMedia`](#on-isreceivingmedia)
* [`DTMF`](#on-dtmf)
* [`hangingUp`](#on-hangingup)
* [`hangUp`](#on-hangup)
* [`cleanUp`](#on-cleanup)

### WebRTC

* [`webRTCState`](#on-webrtcstate)

## Events Reference

To receive and manage all events indiscriminately, use the `*` operator:

```javascript
this.props.teravoz.events.on('*', (type, payload) => {
  switch(type) {
    case 'registering': 
    case 'registered': 
    ...
  }  
});
```

## on `registering`
```javascript
this.props.teravoz.events('registering', () => { ... });
```

The `registering` event is received when the [`register()`](#register) method is called.

## on `registered`
```javascript
this.props.teravoz.events('registered', () => { ... });
```

The `registered` event is received once the peer is succesfull registered (username and password are valid).

## on `registrationFailed`
```javascript
this.props.teravoz.events('registrationFailed', () => { ... });
```

The `registrationFailed` event is received when the username and password are not valid.

## on `unregistering`
```javascript
this.props.teravoz.events('unregistering', () => { ... });
```

The `unregistering` event is received when the [`unregister()`](#unregister) method is called.

## on `unregistered`
```javascript
this.props.teravoz.events('unregistered', () => { ... });
```

The `unregistered` event is received once the peer is succesfull unregistered.

## on `incomingCall`
```javascript
this.props.teravoz.events('incomingCall', ({ theirNumber, handler: { accept, decline } }) => { ... });
```

The `incomingCall` event is received when an incoming call is received.

The event is an object with two properties:
* **theirNumber** *(string)* - the number who is calling
* **handler** *(object)* - a call management `handler` object

The `handler` object has the methods to accept or decline the incoming call:
* **accept** *(function)* - accepts the current incoming call
* **decline** *(function)* - declines the current incoming call

## on `acceptedCall`
```javascript
this.props.teravoz.events('acceptedCall', () => { ... });
```

The `acceptedCall` event is received when a call is accepted by the [`incomingCall`](#on-incomingcall)'s `handler`.

## on `isReceivingMedia`
```javascript
this.props.teravoz.events('isReceivingMedia', (mediaType, on)) => { ... });
```

The `isReceivingMedia` event is received once the connection is established between the sides. It receives two arguments in the callback:
* **mediaType** *(string)* - the value `audio`
* **on** *(boolean)* - if the media is being transfered

## on `DTMF`
```javascript
this.props.teravoz.events('DTMF', ({ sendTones })) => { ... });
```

The `DTMF` event is received when additional information is requested.

The event receive an object with one function.
* **sendTones** *(function)* - a function to send the tones to the Teravoz Platform

## on `hangingUp`
```javascript
this.props.teravoz.events('hangingUp', () => { ... });
```

The `hangingUp` event is received once a call is succesfully hanged up.

## on `hangUp`
```javascript
this.props.teravoz.events('hangUp', () => { ... });
```

The `hangUp` event is received when the [`hangup()`](#hangup) method is called.

## on `missedCall`
```javascript
this.props.teravoz.events('missedCall', () => { ... });
```

The `missedCall` event is received when you received a call but did not answered it.

## on `cleanUp`
```javascript
this.props.teravoz.events('cleanUp', () => { ... });
```

The `cleanUp` event is received everytime a call lifecycle ends.

## on `calling`
```javascript
this.props.teravoz.events('calling', () => { ... });
```

The `calling` event is received when the [`dial()`](#dial) method is called.

> PS: when the `calling` event is received the call is actually not ringing yet. This event refers to an intermediate state between the `dial` and the `ringing` states of a call. In this point you should consider using some fake audio to simulate the ringing.

## on `earlyMedia`
```javascript
this.props.teravoz.events('earlyMedia', () => { ... });
```

The `earlyMedia` event is received when a connection is in fact established, even if the call goes to the voicemail.


## on `webRTCState`
```javascript
this.props.teravoz.events('webRTCState', () => { ... });
```

The `webRTCState` event is received when there is a change in the WebRTC state. It receive one argument in the callback:
* **on** *(boolean)* - if the WebRTC is on

# Roadmap

* Full test coverage
* v1 Release

[npm-image]: https://img.shields.io/npm/v/@teravoz/react-webrtc-adapter.svg
[npm-url]: https://npmjs.org/package/@teravoz/react-webrtc-adapter
[pr-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[pr-url]: https://github.com/teravoz/react-webrtc-adapter/pulls