
/**
 * @file Splash.js
 * @author Kjetil Fossheim
 *
 * First screen the user sees. It is a screen to cover loading of data and setups of the app. Setup and download for first time use of the app.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from 'react-native';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import DbHelper from '../config/DB/DB_helper';
import KeyDownload  from '../config/network/KeyDownload';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SettingsAction from '../actions/SettingsAction';




const mapStateToProps = (state) => ({
  ...state.settings,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...SettingsAction }, dispatch)
  };
}
/**
 * Strings of welcome text
 * @type {Object}
 */
const introstrings = {
  a1: 'Gjør ArtsApp klar',
  a2: 'Gjør ArtsApp klar for dine arter',
  a3: 'ArtsApp gleder seg til å hjelpe deg med artsidentifisering',
  a4: 'Hvilken art har du i dag?',
  a5: 'Artsidentifisering er gøy',
  a6: 'ArtsApp, artsidentifisering rett i lomma',
  a7: 'Snart er vi klar for artsidentifisering',
  a8: 'La oss komme i gang med artsidentifisering',
  a9: 'Straks er vi klar til artsidentifisering',
  a10: 'ArtsApp er snart klar'
};

class Splash extends Component {

  constructor(props) {

    super(props);
    this.DbHelper = new DbHelper();
    this.KeyDownload = new KeyDownload();
    this.state = {
      progress: [],
      text: introstrings['a' + this.getRandomInt()],
    };
  };

/**
 * @return {Integer} random number between 1 - 10
 */
  getRandomInt() {
    min = Math.ceil(1);
    max = Math.floor(11);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  };

  componentWillReceiveProps(newprops) {
    if (newprops.keysformApi_succsess) {
      let d = new Date();
      this.props.actions.setlastDownloaddate(d.getDate()  + '-' +  d.getMonth() + '-' +  d.getFullYear());
      this.startUp();
    }
  };

  componentDidMount() {
    this.startApp();
  };

  startUp() {
    setTimeout(() => {
      Actions.Frontpage();
    }, 2000);
  };
/**
 * Test if the app has been used before, if not, downloads the list of available keys.
 * Asks for network if not available.
 * @return {void} starts the app when ready
 * @see SettingsAction
 */
  startApp() {
    this.DbHelper.testDatabase().then(()=>{
      if (this.props.lastDownloaddate === -1) {
        if (this.props.isConnected) {
          this.props.actions.getkeysFromApi();
        }
        else {
          Alert.alert(
            this.props.strings.noNetWorkTitle,
            this.props.strings.firstNoNett + ' ',
            [
            {text: this.props.strings.ok, onPress: () => this.startApp()},
            ]
          );
        }
      }
      else {
        this.startUp();
      }
    });
  };



  render() {
    return(
      <View style={styles.container}>
        <Image source ={require('../images/AA_logo.png')} style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.image : styles.image}/>
        <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.subheading : styles.subheading}>
          {this.props.strings.introText}
        </Text>
        {this.props.lastDownloaddate === -1 &&
          <View>
            <Spinner color='green' />
          <Text numberOfLines = {2} ellipsizeMode = "tail" style={{textAlign: 'center', color: '#ffffff', fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15 )}}>{this.state.text}</Text>
          </View>
        }
      </View>
    );
  }
}

Splash.defaultProps = {
  strings: {
    introText: '',
  },
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  image: {
    height:350,
    width: 350,
    margin: 30,
    marginTop: 70,
    marginBottom: 0,
    justifyContent: 'center',
  },
  subheading: {
    fontSize: 30,
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 5,
  },
});

const AndroidTabletStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  image: {
    height:700,
    width: 700,
    margin: 60,
    marginTop: 100,
    marginBottom: 0,
    justifyContent: 'center',
  },
  subheading: {
    fontSize: 60,
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
