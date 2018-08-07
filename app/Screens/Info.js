/**
 * @file Info.js
 * @author Kjetil Fossheim
 *
 * An screen showing information about the Key the user is currently are using.
 * It is also used in as a screen showing the same information before the key is downloaded, then with a download button.
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  BackHandler,
  Dimensions,
  Alert,
} from 'react-native';
import { Container, StyleProvider, Header, Footer, FooterTab, Title, Spinner, Content,Button, Left, Right, Body, Icon, H2, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-simple-modal';
import Toast, {DURATION} from 'react-native-easy-toast';
import HTMLView from 'react-native-htmlview';
import ImageZoom from 'react-native-image-pan-zoom';

// theme
import getTheme from '../native-base-theme/components';
import common from '../native-base-theme/variables/commonColor';
import androidTablet from '../native-base-theme/variables/androidTablet';

// redux
import ImageConfig from '../config/network/ImageConfig';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as KeyAction from '../actions/KeyAction';



const mapStateToProps = (state) => ({
  ...state.key,
  ...state.settings,
  ...state.nav,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...KeyAction }, dispatch)
  };
}


class Info extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'Info';
  };

  componentWillMount() {
    this.getSelectedKey();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackModal', () => {
      if (this.props.keyDownloaded_LOADING) {
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackModal');
  }

  /**
   * Retrives the information about the selected key.
   * @return {void} sets key to state
   */
  getSelectedKey() {
    for (let i = 0; i < this.props.keys.length; i++) {
      if (this.props.keys[i].key_id === this.props.chosenKey) {
        return this.setState({key: this.props.keys[i]});
      }
    }
    // default
    return this.setState({
      key:{
        keyDownloaded:0,
        keyImage: '',
        keyInfo: 'NANANANAANANANANANNANANANANANANANANANANANANANANA___NA___NANANANANANANANANANANANANA',
        keyWeb: 'NA',
        key_id: 999999,
        title: 'Ikke noe navn',
        updateTrigger: 0,
        version: 0,
        level: 'low'
      },
    });
  }


  /**
   * [onClickBack description]
   */
  onClickBack = () => {
    Actions.pop();
  }

  /**
   * function for after download modal is closed
   * @return {void} returns to Frontpage if success and shows error toast if failed.
   */
  modalClose = () => {
    if (this.props.keyDownloaded_SUCCESS) {
      this.refs.toast.show(this.props.strings.downloaded, 1500);
      setTimeout(() => {
        Actions.pop();
      }, 800);
    }
    else if (typeof this.props.keyDownloaded_ERROR !== 'undefined') {
      this.refs.toast.show(this.props.strings.updateError, 1500);
    }
  }

  /**
   * shows download dialog. downloads key if internet is available.
   * @see KeyAction
   */
  onClickDownload = () => {
    if (this.props.isConnected === false) {
      new Alert.alert(  this.props.strings.noNetwork,
        '',
        [
          {text: this.props.strings.ok, onPress: () => {}},
        ],
        { cancelable: false }
      );
    }
    else if (this.props.isConnected === true) {
      this.props.actions.downloadKey(this.state.key.keyWeb);
    }
  }

  /**
   * Cleans HTML removing <br>
   */
  removeHtmlBr() {
    if (this.state.key.keyInfo === null) {
      return this.props.strings.noText;
    }
    return this.state.key.keyInfo.replace(/(\n|<br>)/gm,'');
  }

  /**
   * shows the hidden download buttons
   * @return {View} Fotter for the Screen
   */
  showDownload() {
    return (
      <Footer>
        <FooterTab>
            <Button transparent onPress={this.onClickBack}>
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.cancel}</Text>
            </Button>
            <Button transparent onPress={this.onClickDownload}>
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.download}</Text>
            </Button>
        </FooterTab>
      </Footer>
    );
  }

  render() {
    return (
      <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
      <Container>
        <Header>
          <Left>
            <Button transparent  onPress={this.onClickBack}>
              <Icon name='ios-arrow-back-outline' />
            </Button>
          </Left>
          <Body style={{flex: 3}}>
            <Title>{this.props.strings.keyInfo}</Title>
          </Body>
          <Right/>
        </Header>
        <Content>
          <Grid>
            <Col style={styles.container}>
              {this.state.key.image === 1 &&
                <ImageZoom
                  cropWidth={Dimensions.get('window').width - 20}
                  cropHeight={this.props.deviceTypeAndroidTablet ? 560 : 280}
                  imageWidth={Dimensions.get('window').width - 20}
                  imageHeight={this.props.deviceTypeAndroidTablet ? 540 : 270}>
                  <Image style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.image : styles.image}
                    source={this.props.platform === 'ios' ? {uri: ImageConfig.getInfoImg(this.props.chosenKey)} : {uri: 'file://' + ImageConfig.getInfoImg(this.props.chosenKey)}}/>
                </ImageZoom>
              }
              <Text  numberOfLines = {2} style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text : styles.text}>{this.state.key.title}</Text>
              <View style={styles.separator} />
              <View style = {styles.textBox}>
                <HTMLView
                  value = {this.removeHtmlBr()}
                  stylesheet={this.props.deviceTypeAndroidTablet ? htmlstylesAndroidTablet : htmlstyles}
                />
              </View>
            </Col>
          </Grid>
        </Content>
        {this.props.showDownload ? this.showDownload() : null }
        <Modal
          offset={0}
          animationDuration={200}
          animationTension={40}
          closeOnTouchOutside={false}
          open={this.props.keyDownloaded_LOADING}
          modalDidOpen={() => {}}
          modalDidClose={this.modalClose}
        >
          <Text style={{fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15), textAlign: 'center',}}>{this.props.strings.downloading}</Text>
          <Spinner color='green' />
        </Modal>
        <Toast ref="toast"/>
      </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: Dimensions.get('window').width - 50,
    height: 250,
    margin: 20,
    resizeMode: 'contain',
    padding: 20,
  },
  separator: {
    height: 20,
    backgroundColor: 'grey',
  },
  textBox: {
    margin: 10,
  },
  text3:{
    fontSize: 15,
    marginBottom: 5,
    textAlign: 'center',
    color: '#000000',
  },
  text:{
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
});

const htmlstyles = StyleSheet.create({
  br: {
    margin: 0,
    padding: 0,
  },
  p: {
    fontSize: 15
  }
});

const htmlstylesAndroidTablet = StyleSheet.create({
  br: {
    margin: 0,
    padding: 0,
  },
  p: {
    fontSize: 30
  }
});

const AndroidTabletStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: Dimensions.get('window').width - 50,
    height: 500,
    margin: 20,
    resizeMode: 'contain',
    padding: 20,
  },
  separator: {
    height: 20,
    backgroundColor: 'grey',
  },
  textBox: {
    margin: 10,
  },
  text3:{
    fontSize: 30,
    marginBottom: 5,
    textAlign: 'center',
    color: '#000000',
  },
  text:{
    fontSize: 40,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
});



export default connect(mapStateToProps, mapDispatchToProps)(Info);
