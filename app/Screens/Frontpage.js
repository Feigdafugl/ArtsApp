/**
 * @file Frontpage.js
 * @author Kjetil Fossheim
 *
 *This Screen holds a list of all available keys for ArtsApp. It sorts them into Beta and Release Keys.
 */


import React, { Component} from 'react';
import {
  StyleSheet,
  BackHandler,
  Text,
  FlatList,
} from 'react-native';
import { StyleProvider, Button, Spinner,Icon, Container, Header, Title, Content, Left, Body, Right, ListItem} from 'native-base';
import KeyListElement from '../components/KeyListElement';
import { Actions } from 'react-native-router-flux';
import Collapsible from 'react-native-collapsible';
import Modal from 'react-native-simple-modal';

// theme
import getTheme from '../native-base-theme/components';
import common from '../native-base-theme/variables/commonColor';
import androidTablet from '../native-base-theme/variables/androidTablet';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as KeyAction from '../actions/KeyAction';
import * as MenuAction from '../actions/MenuAction';
import * as ObservationAction from '../actions/ObservationAction';
import * as SettingsAction from '../actions/SettingsAction';

const mapStateToProps = (state) => ({
  ...state.key,
  ...state.nav,
  ...state.menu,
  ...state.settings,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...KeyAction, ...MenuAction, ...ObservationAction, ...SettingsAction }, dispatch)
  };
}

class Frontpage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      iKey: 1,
      collapsedHeight: 0,
      collapsed: true,
      loading: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackModal', () => {
      if (this.state.loading) {
        return true;
      }
      return false;
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'Frontpage';
  };

  componentWillMount() {
    this.props.actions.setAllKeys();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackModal');
  }


  /**
   * monitors Props to look for updates in downloading of keys, or updated/deleted keys.
   * @see KeyAction.setAllKeys
   * @param {Object} nextProps new received props
   * @return {void}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.keyDownloaded_SUCCESS && nextProps.lastPage === 'Info') {
      this.props.actions.setAllKeys();
      // this.forceUpdate();
    }
    if (nextProps.debugMode && this.state.iKey === 1) {
      this.forceUpdate();
    }
    if (nextProps.keyListUpdated) {
      this.props.actions.keyListUpdated();
      this.props.actions.setAllKeys();

    }
    if (this.props.keyListUpdated && !nextProps.keyListUpdated ) {
      this.forceUpdate();
    }
    if (this.props.scene.sceneKey == 'UpdateKeys' && nextProps.scene.sceneKey == 'Frontpage' ) {
      this.props.actions.setAllKeys();
    }
  }

  /**
   * onClick-handler, if downloaded the key opens, if not the info page opens with options to download the key.
   * if the key has been opened earlier the key opens ones more with same state as user left it, if not the key is reset and the new chosen key is opened.
   * @see this.runKey
   * @param {integer} id         id of selected key
   * @param {String} title      Title of selected key
   * @param {bool} downloaded is key downloaded.
   * @return {void}
   */
  onClick = (id, title, downloaded) => {
    oldKeyID = this.props.chosenKey;
    this.props.actions.setKey(id, title);
    if (downloaded) {
      if (oldKeyID == -1) {
        this.runKey(id, false);
      }
      else if (id === oldKeyID) {
        this.runKey(id, true);
      }
      else {
        this.props.actions.resetKey();
        this.runKey(id, false);

      }
    }
    else {
      this.setState({loading: true});

      setTimeout(() => {
        this.setState({loading: false});
        Actions.Info({showDownload: true});
      }, 700);
    }
  }

  /**
   * opens and closes beta selection.
   * @return {void}
   */
  onClickBeta = () => {
    this.setState({
      collapsed : !this.state.collapsed
    });
  }

  onClickMenu = () => {
    this.props.actions.openMenu();
  }

  /**
   * opens key with or without previous state. If without state, it is loading the data of the new key.
   * @see KeyAction .setTraitValuecombo .setAllSpToKEy .setSpNerby .getAllSpImages .getValueImages
   * @param {integer} id         id of selected key
   * @param {bool} secondTime true if it is the second time in a row the user is using the selected key.
   * @return {void} opens selected key
   */
  runKey(id, secondTime) {
    if (secondTime) {
      Actions.Key({sameKey: true});
    }
    else {
      this.setState({loading: true});
      this.props.actions.setTraitValuecombo(id);
      this.props.actions.setAllSpToKEy(id);
      this.props.actions.setSpNerby(id);
      this.props.actions.getAllSpImages(id);
      this.props.actions.getValueImages(id);
      setTimeout(() => {
        this.setState({loading: false});
        Actions.Key({sameKey: false});
      }, 700);
    }

  }

  renderItem = ({item}) => {
    if (item.keyStatus !== 'beta') {
      return  (<ListItem >
          <KeyListElement
            id ={item.key_id}
            title ={item.title}
            keyImage ={item.keyImage}
            downloaded = {item.keyDownloaded}
            onClick = {this.onClick}
            level = {item.level}
            keyAuthor = {item.author}
          />
      </ListItem>);
    }
    return null;
  }

  renderItemBeta = ({item}) => {
    if (item.keyStatus === 'beta') {
      return  (<ListItem >
          <KeyListElement
            id ={item.key_id}
            title ={item.title}
            keyImage ={item.keyImage}
            downloaded = {item.keyDownloaded}
            onClick = {this.onClick}
            level = {item.level}
            keyAuthor = {item.level}
          />
      </ListItem>);
    }
    return null;
  }

  render() {
    return (
    <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
      <Container>
        <Header>
          <Left>
          <Button transparent onPress={this.onClickMenu}>
              <Icon name='ios-menu' />
          </Button>
          </Left>
          <Body>
            <Title>{this.props.strings.keys}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <FlatList
            initialNumToRender = {9}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.key_id}
            data= {this.props.keys}
          />
        <ListItem style={{justifyContent: 'space-between'}} itemDivider key ={-99} onPress = {this.onClickBeta}>
            <Text style={{fontSize: (this.props.deviceTypeAndroidTablet ? 40 : 20 ), fontWeight: 'bold',}}>{this.props.strings.betaKeys}</Text>
            <Icon  name={this.state.collapsed ? 'ios-arrow-down' : 'ios-arrow-up'}/>
          </ListItem>
          {!this.state.collapsed && <FlatList
            initialNumToRender = {9}
            renderItem={this.renderItemBeta}
            keyExtractor={(item, index) => item.key_id}
            data= {this.props.keys}
          />}
        </Content>
        <Modal
          offset={0}
          animationDuration={200}
          animationTension={40}
          closeOnTouchOutside={false}
          open={this.state.loading}
          modalDidOpen={() => {}}
          modalStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0)',
          }}
        >
          <Spinner color='green' />
        </Modal>
    </Container>
  </StyleProvider>
    );
  };
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  separator: {
    height: 2,
    backgroundColor: 'grey',
  },
  image: {
    height:30,
    width: 30,
    marginTop: 5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Frontpage);
