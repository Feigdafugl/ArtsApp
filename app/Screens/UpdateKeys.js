/**
 * @file UpdateKeys.js
 * @author Kjetil Fossheim
 *
 * Screen for administrating keys.
 */
import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  BackHandler,
  FlatList,
  Text,
} from 'react-native';
import { StyleProvider, Container, Header, FooterTab, Footer, List, Input, Spinner, CheckBox, Body, InputGroup, Left, Right, ListItem, Title, Content,Button, Icon} from 'native-base';
import Modal from 'react-native-simple-modal';
import Toast, {DURATION} from 'react-native-easy-toast';
import { Actions } from 'react-native-router-flux';
import KeyDownload from '../config/network/KeyDownload';


// theme
import getTheme from '../native-base-theme/components';
import common from '../native-base-theme/variables/commonColor';
import androidTablet from '../native-base-theme/variables/androidTablet';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as KeyAction from '../actions/KeyAction';
import * as SettingsAction from '../actions/SettingsAction';

const mapStateToProps = (state) => ({
  ...state.key,
  ...state.settings,
  ...state.nav,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...KeyAction, ...SettingsAction }, dispatch)
  };
}


class UpdateKeys extends Component {

  constructor(props) {
    super(props);
    this.KeyDownload = new KeyDownload();
    let updatelist = this.initList();
    this.state = {
      chosenKeys: [],
      open: false,
      disableAll: false,
      showUP: updatelist > 0 ? true : false,
      lUpdate: false,
      listLength: updatelist,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackModal', () => {
      if (this.props.keysUpdated_loading || this.state.disableAll) {
        return true;
      }
      return false;
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'UpdateKeys';
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackModal');
  }

  componentWillMount() {
    this.props.actions.setUpdateList();
  }

  /**
   * monitors new props to see if the user is updating keys, or if the update is finished, or if a key is deleted.
   * @param {Object} newProps received props
   * @return {void} if keys is updated sends user to frontpage, else updates keylist if deleted.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.keysUpdated_loading === true) {
      this.setState({disableAll: true});
      setTimeout(() => {
        this.setState({disableAll: false});
        if (this.props.keysUpdated) {
          this.props.actions.setAllKeys();
          this.props.actions.resetUpdateKey();
          Actions.popTo('Frontpage');
        }
      }, 1000);
    }
    if (nextProps.keysUpdated) {
      this.props.actions.setAllKeys();
      this.props.actions.resetUpdateKey();
      Actions.popTo('Frontpage');
    }
    if (nextProps.deleted) {
      this.props.actions.setUpdateList();
      this.props.actions.resetUpdateKey();
    }
  }

  componentDidUpdate(prevProps, prevState) {
  }

  /**
   * init list of keys that are downloaded.
   * @return {array} List of downloaded keys
   */
  initList() {
    let c = 0;
    keyL = [];
    for (let i = 0; i < this.props.keys.length; i++) {
      if (this.props.keys[i].keyDownloaded === 1 && this.props.keys[i].updateTrigger === 1 ) {
        keyL.push(this.props.keys[i]);
        c ++;
      }
    }
    return c;
  }

  /**
   * Looks for update for downloaded keys. and updates the list shown to user.
   * @see KeyDownload.lookForUpdate
   * @return {void} set state to show or not show update buttons, or shows alert for no network.
   */
  lookforupdate = () => {
    if (this.props.isConnected) {
      this.setState({lUpdate: true, disableAll : true});
      this.KeyDownload.lookForUpdate(this.props.keys).then((value) => {
        this.props.actions.setUpdateList();
        if(value.someUpdate) {
          this.setState({showUP: true, lUpdate: false, disableAll: false});
        }
        else {
          this.setState({lUpdate: false, disableAll: false});
        }

      })
      .catch((err) => {
        this.setState({lUpdate: false, disableAll: false});
      });
    }
    else {
      Alert.alert(
        this.props.strings.noNetwork,
        this.props.strings.disNoNetwork,
        [
        {text: this.props.strings.ok, onPress: () => {}, style: 'cancel'}
        ],
        { cancelable: true }
      );
    }
  }

  onClickSelectKey= () => {
    if (i > 0) {
      this.refreshList(i);
    }
  }

  onClickHome = () => {
    Actions.popTo('Frontpage');
  }

  onClickLookUpdate = () => {

  }

  /**
   * function that updates selected keys. shows no network toast if no internet.
   * @see SettingsAction.updateKeys
   * @return {void}
   */
  updateKeys = () => {
    if (this.props.isConnected && this.state.chosenKeys.length >= 1) {
      ret = [];
      keys = this.props.updateList;
      for (let i = 0; i < this.state.chosenKeys.length; i++) {
        k = keys[_.findIndex(keys, {key_id: this.state.chosenKeys[i]})];
        if (typeof k !== 'undefined') {
          ret.push(k);
        }
      }
      this.props.actions.updateKeys(ret);
    }
    else if (!this.props.isConnected) {
      this.refs.toast.show(this.props.strings.noNetwork,1500);
    }
    else if (this.state.chosenKeys.length < 1) {
      this.refs.toast.show(this.props.strings.noKey,1500);
    }
  }

  /**
   * Refresh list of keys user have chosen for update.
   * @param {integer} i the id for selected key
   * @return {void} sets new list of keys to state
   */
  refreshList = (i) => {
    j = this.state.chosenKeys.indexOf(i);
    if(j === -1) {
      this.setState({chosenKeys: this.state.chosenKeys.concat([i])});
    }
    else if (this.state.chosenKeys.length === 1 && j !== -1) {
      this.setState({chosenKeys: []});
    }
    else{
      let a = this.state.chosenKeys;
      a.splice(j, 1);
      this.setState({chosenKeys: a});
    };
  }

  /**
   * Shows Alert for deleting of keydata and deletes selected key if pressed yes.
   * @param {integer} i id of selected key.
   * @return {void} deletes selected key.
   */
  onClickDelete = (i) => {
    Alert.alert(
      this.props.strings.deleteKeyHeader,
      this.props.strings.deleteKey + ' ',
      [
      {text: this.props.strings.cancel, onPress: () => {}, style: 'cancel'},
        {text: this.props.strings.acsept, onPress: () => {
          this.props.actions.deletedata(i);
        }},
      ],
      { cancelable: true }
    );
  }

  keyExtractor = (item) => {
    return item.key_id;
  }


  renderItem = (item) => {
    if (item.item.keyDownloaded === 1 ) {
      return (
        <ListItem
          icon
          style = {{margin: 1}}
          key = {item.item.key_id}
          onPress={this.refreshList.bind(this, item.item.key_id)}>
          <Left>
            <Icon style = {{alignSelf: 'center'}} name='ios-trash' onPress={this.onClickDelete.bind(this, item.item.key_id)}/>
          </Left>
          <Body>
            <Text adjustsFontSizeToFit = {true} minimumFontScale = {0.9} numberOfLines = {2} ellipsizeMode = {'head'} style = {this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.listTextKey : styles.listTextKey}>{item.item.title}</Text>
          </Body>
          <Right >
            {item.item.updateTrigger === 1 &&
              <View>
            <Icon  name={this.state.chosenKeys.some((a) => {
              return a === item.item.key_id;
            }) ? 'ios-radio-button-on' :  'ios-radio-button-off'}/>
            <Text style= {{fontSize: (this.props.deviceTypeAndroidTablet ?  20 : 10 )}} >{this.props.strings.needUpdate}</Text>
            </View>
        }
          </Right>
        </ListItem>
      );
    }
    return null;
  }


  render() {
    return (
      <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
      <Container>
        <View style={styles.container}>
          <Header>
            <Left>
              <Button transparent disabled ={this.props.keysUpdated_loading || this.state.disableAll} onPress={this.onClickHome}>
                <Icon name='ios-arrow-back-outline'/>
              </Button>
            </Left>
            <Body style={{flex: 3}}>
              <Title>{this.props.strings.manageKeys}</Title>
            </Body>
            <Right style={{flex: 2, marginRight: - 5}}>
              <Button transparent disabled ={false} onPress={this.lookforupdate}>
                <Text style = {{marginRight: 2, textAlign: 'center', fontSize: (this.props.deviceTypeAndroidTablet ? 20 : 10)}}>{this.props.strings.lookForUpdate}</Text>
                <Icon name='md-refresh'/>
              </Button>
            </Right>
          </Header>
          <View>
            {this.state.listLength > 0 || this.state.showUP ?
              <Text style = {this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text1 : styles.text1}> {this.props.strings.updateKeyText} </Text> :
              <Text style = {this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text1 : styles.text1}> {this.props.strings.noKeys} </Text>
            }
            <View key = 'divider' style={{height: 2, backgroundColor: '#dadada'}}/>
          </View>
          <Content>
            {this.props.updateList.length === 0 && <Text style = {this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text1 : styles.text1}> {this.props.strings.noKeysDownloaded}</Text>}
            <FlatList
              extraData = {this.state.chosenKeys.length}
              data = {this.props.updateList}
              keyExtractor = {this.keyExtractor}
              renderItem = {this.renderItem}
              ref = "list">
            </FlatList>
          </Content>
          <Toast ref="toast"/>
        </View>
        {this.state.listLength > 0 || this.state.showUP ?
          <Footer>
            <Button block transparent disabled ={this.props.keysUpdated_loading || this.state.disableAll} onPress={this.updateKeys}>
              <Text style = {this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text1 : styles.text1}>{this.props.strings.updateKey}</Text>
              <Icon name='md-download'/>
            </Button>
          </Footer> : null
        }

        <Modal
          offset={0}
          animationDuration={200}
          animationTension={40}
          closeOnTouchOutside={false}
          open={this.props.keysUpdated_loading || this.state.disableAll}
          modalDidOpen={() => {}}
          modalDidClose={() => {}}
        >
        <View>
            {!this.state.lUpdate &&
              <Text style = {styles.text1}>{this.props.strings.downloading}</Text>
             }
            <Spinner color='green'/>
         </View>
       </Modal>
      </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  text1:{
    fontSize: 15,
    margin: 10,
    textAlign: 'center',
    color: '#000000',
  },
  listTextKey:{
    fontSize: 15,
    margin: 10,
    textAlign: 'left',
    color: '#000000',
  },
  listTextupdate:{
    fontSize: 10,
    margin: 10,
    textAlign: 'center',
    color: '#000000',
  },
  text2:{
    fontSize: 10,
    margin: -7,
    textAlign: 'center',
    color: '#000000',
  },
});

const AndroidTabletStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  text1:{
    fontSize: 30,
    margin: 10,
    textAlign: 'center',
    color: '#000000',
  },
  listTextKey:{
    fontSize: 30,
    margin: 10,
    textAlign: 'center',
    color: '#000000',
  },
  listTextupdate:{
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
  },
  text2:{
    fontSize: 20,
    margin: -7,
    textAlign: 'center',
    color: '#000000',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateKeys);
