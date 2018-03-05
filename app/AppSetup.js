
/**
 * @file AppSetup.js
 * @author Kjetil Fossheim
 * Adding different startup settings to application. -language -network -position
 */
import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import ArtsApp from './ArtsApp';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SettingsAction from './actions/SettingsAction';
import AsyncStore from './config/AsyncStore';


const mapStateToProps = (state) => ({
  ...state.settings,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...SettingsAction }, dispatch)
  };
}

class AppSetup extends Component {

  constructor(props) {
    super(props);
    this.AsyncStore = new AsyncStore();
    this.languagesetup();
    this.props.actions.getlastDownload();
    this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
    };
  }

/**
 * gets the stored language from AsyncStore and sets the app for that language.
 * @return {void} sets language value in reduxStore
 */
  languagesetup() {
    this.AsyncStore.getLanguage()
    .then((value) => {
      if (value === null) {
        this.props.actions.setContantStrings('no');
        this.props.actions.setLanguage('no');
      }
      else {
        this.props.actions.setContantStrings(value);
      }
    });
  }

/**
 * Added EventListeners to network and to position
 * @return {void} stores new network status and position to reduxStore
 */
  componentDidMount() {
    NetInfo.isConnected.addEventListener('change', (net) => {
      this.props.actions.isOnline(net);
    });

    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.props.actions.setLocation(position.coords.latitude, position.coords.longitude);
    });
  }
/**
 * Removes listeners when component is killed.
 */
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    NetInfo.isConnected.removeEventListener('change');
  }

  render() {
    return <ArtsApp />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSetup);
