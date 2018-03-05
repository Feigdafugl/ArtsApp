/**
 * @file MenuContant.js
 * @author Kjetil Fossheim
 *
 * a content render for the drawer menu.
 */

import React, { Component } from 'react';
import {
  Image,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { StyleProvider, Text, List, ListItem, View, Container, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Toast, {DURATION} from 'react-native-easy-toast';

// theme
import getTheme from '../native-base-theme/components';
import common from '../native-base-theme/variables/commonColor';
import androidTablet from '../native-base-theme/variables/androidTablet';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MenuAction from '../actions/MenuAction';
import * as SettingsAction from '../actions/SettingsAction';

const mapStateToProps = (state) => ({
  ...state.settings,
  ...state.menu,
  ...state.nav,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...MenuAction, ...SettingsAction}, dispatch)
  };
}
const drawerImage = require('../images/AA_logo.png');

class MenuContant extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.menuOpen;
  };

  /**
   * handles on language click, changes language to selected language
   * @param {[type]} a id of selected button. 7 = language english, 8 = language Norwegian, 9 = closeMenu
   * @return {void}
   */
  onClick(a) {
    switch(a) {
    case 7: this.props.actions.closeMenu(); this.props.actions.setLanguage('en'); this.props.actions.setContantStrings('en'); break;
    case 8: this.props.actions.closeMenu(); this.props.actions.setLanguage('no'); this.props.actions.setContantStrings('no'); break;
    case 9: this.props.actions.closeMenu(); break;
    }
  }

  /**
   * closes menu and
   * opens the user observation page.(Observation.js)
   * @return {void} [description]
   */
  onClickObs = () => {
    this.props.actions.closeMenu();
    Actions.Observation();
  }

  /**
   * closes menu and
   * opens the observation by location page(UpdateLocation.js).
   * @return {void} [description]
   */
  onClickLocation = () => {
    this.props.actions.closeMenu();
    Actions.UpdateLocation();
  }

  /**
   * closes menu and
   * opens the key info page(Info.js), not usable if user is currently on the front-page.
   * @return {void} [description]
   */
  onClickInfo = () => {
    if (this.props.scene.name !== 'Frontpage') {
      this.props.actions.closeMenu();
      Actions.Info();
    }
  }

  /**
   * closes menu and
   * opens the about page(About.js)
   * @return {void} [description]
   */
  onClickAbout = () => {
    this.props.actions.closeMenu();
    Actions.About();
  }

  /**
   * closes menu and
   * opens the admin key page(UpdateKeys.js)
   * @return {void} [description]
   */
  onClickUpdateKeys= () => {
    this.props.actions.closeMenu();
    Actions.UpdateKeys();
  }

  /**
   * handles alert for language changes.
   * @return {void} [description]
   */
  onClickLang = () => {
    Alert.alert(
      this.props.strings.langChoise,
      this.props.strings.langText + ' ',
      [
      {text: this.props.strings.en, onPress: () => this.onClick(7)},
      {text: this.props.strings.no, onPress: () => this.onClick(8)},
      {text: this.props.strings.cancel, onPress: () => this.onClick(9)},
      ],{ cancelable: false }
    );
  }

  renderList() {
    return (
      <List keyi = {this.props.debugMode} >
      <ListItem button noBorder onPress={this.onClickObs}>
        <Text style={this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.text : styles.text}>{this.props.strings.myObs}</Text>
      </ListItem>
      <ListItem button noBorder onPress={this.onClickLocation}>
        <Text style={this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.text : styles.text}>{this.props.strings.updateLocation}</Text>
      </ListItem>
      <ListItem button noBorder onPress={this.onClickInfo}>
        <Text style={(this.props.scene.name === 'Frontpage') ? (this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.textKeyInfo : styles.textKeyInfo) : (this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.text : styles.text)}>{this.props.strings.keyInfo}</Text>
      </ListItem>
      <ListItem  button noBorder onPress={this.onClickLang}>
        <Text style={this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.text : styles.text}>{this.props.strings.language}</Text>
      </ListItem>
      <ListItem button noBorder onPress={this.onClickUpdateKeys}>
        <Text style={this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.text : styles.text}>{this.props.strings.manageKeys}</Text>
      </ListItem>
    </List>
    );
  }

  render() {
    return (
      <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
      <Container>
         <View
           style={styles.menu}
         >
           <Image
             square
             style={styles.drawerCover}
             source={drawerImage}
           />
           {this.renderList()}
           <Button style={this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.about : styles.about} block transparent onPress={this.onClickAbout}>
             <Image style={this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.logoImg : styles.logoImg} source={require('../images/AA_icon.png')} />
             <Text style={this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.textAbout : styles.textAbout}>{this.props.strings.about}</Text>
           </Button>
         </View>
         <Toast ref="toast"/>
       </Container>
     </StyleProvider>
    );
  }
}

MenuContant.defaultProps = {
  strings: {
    about: '',
    language: '',
    keyInfo: '',
    updateLocation: '',
    myObs: '',
  }
};

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = {
  menu: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 1,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#553917',
  },
  logoImg: {
    resizeMode: 'contain',
    width: 37,
    height: 37,
  },
  drawerCover: {
    backgroundColor: '#553917',
    resizeMode: 'contain',
    height: deviceHeight / 3.5,
    width: null,
    position: 'relative',
    marginBottom: 10,
  },
  about: {
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    bottom: 20,
  },
  text: {
    fontWeight: (Platform.OS === 'ios') ? '500' : '400',
    fontSize: 16,
    marginLeft: 20,
  },
  textAbout: {
    fontWeight: (Platform.OS === 'ios') ? '500' : '400',
    fontSize: 20,
    marginLeft: 20,
    paddingBottom: 20 - (20 * 0.75),
  },
  textKeyInfo: {
    fontWeight: (Platform.OS === 'ios') ? '500' : '400',
    fontSize: 16,
    marginLeft: 20,
    color: '#ababab',
  },
};

const stylesAndroidTablet = {
  menu: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 1,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#553917',
  },
  logoImg: {
    resizeMode: 'contain',
    width: 76,
    height: 76,
  },
  drawerCover: {
    backgroundColor: '#553917',
    resizeMode: 'contain',
    height: deviceHeight / 3.5,
    width: null,
    position: 'relative',
    marginBottom: 10,
  },
  about: {
    height: 80,
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    bottom: 20,
  },
  text: {
    fontWeight: (Platform.OS === 'ios') ? '500' : '400',
    fontSize: 32,
    marginLeft: 20,
  },
  textAbout: {
    fontWeight: (Platform.OS === 'ios') ? '500' : '400',
    fontSize: 40,
    marginLeft: 20,
    paddingBottom: 40 - (40 * 0.75),
  },
  textKeyInfo: {
    fontWeight: (Platform.OS === 'ios') ? '500' : '400',
    fontSize: 32,
    marginLeft: 20,
    color: '#ababab',
  },
};


export default connect(mapStateToProps, mapDispatchToProps)(MenuContant);
