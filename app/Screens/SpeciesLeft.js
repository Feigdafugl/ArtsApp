/**
 * @file SpeciesLeft.js
 * @author Kjetil Fossheim
 *
 * Screen displaying the list of species left after selection of trait values. It sorts the species(SP) into three categories, SP left, SP left locally, SP eliminated
 */
import React, { Component } from 'react';
import {
  SectionList,
  Text,
  View,
  BackHandler,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {List, ListItem} from 'native-base/backward';
import { Button, Spinner,Icon, Container, StyleProvider, Header, Footer, FooterTab, Title, Content,Left, Body, Right,} from 'native-base';
import SpeciesElement from '../components/SpeciesElement';
import Modal from 'react-native-simple-modal';
import Toast, {DURATION} from 'react-native-easy-toast';

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

const mapStateToProps = (state) => ({
  ...state.key,
  ...state.nav,
  ...state.menu,
  ...state.observations,
  ...state.settings,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...KeyAction, ...MenuAction, ... ObservationAction }, dispatch)
  };
}


class SpeciesLeft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      count: 0,
      loading: false,
      spElim: this.setElimList(),
      leftNerbyList: (props.navigationState.leftNerbyList ? props.navigationState.leftNerbyList : []),
      leftNotGeo: this.setNotNerby(props.nerbyList),
    };
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackModal', () => {
      if (this.props.nerby_updated_loading) {
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackModal');
  }

  componentWillMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'SpeciesLeft';
  };

  componentDidUpdate(prevProps, prevState) {
  }

  /**
   * componentWillReceiveProps monitors the nextProps and nextState for updates.
   * Handles updates of the nearby observed list, and sorts species thereafter. Also handles update errors.
   * @param {Object} nextProps
   * @param {Object} nextState
   * @return {void}
   */
  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.getGerbyList && nextProps.nerbyList.length !== this.props.nerbyList.length) {
      l = [];
      if (nextProps.nerbyList.length !== 0) {
        if (nextProps.speciesLeft.length !== 0 ) {
          for (let i = 0; i < nextProps.nerbyList.length; i++) {
            k = _.findIndex(nextProps.speciesLeft, {species_id: nextProps.nerbyList[i].species_id});
            if (k !== -1) {
              l.push(nextProps.speciesLeft[k]);
            }
          }
        }
        else if (nextProps.chosenValues.length === 0) {
          for (let i = 0; i < nextProps.nerbyList.length; i++) {
            k = _.findIndex(nextProps.fullSpList, {species_id: nextProps.nerbyList[i].species_id});
            if (k !== -1) {
              l.push(nextProps.fullSpList[k]);
            }
          }
        }

      }
      this.setState({
        leftNerbyList: (l ? l : []),
        leftNotGeo: this.setNotNerby(nextProps.nerbyList),
      });
    }

    if (nextProps.nerby_updated) {
      if (nextProps.modalOpen) {
        this.props.actions.changeModal();
      }
      this.refs.toast.show(this.props.strings.updateSuccess, 1500);
      this.props.actions.changeUpdateSuccess();
      this.props.actions.setSpNerby(this.props.chosenKey);

    }
    else if (nextProps.nerby_updatedErrorBool ) {
      this.props.actions.updateReset();
      alert(this.props.strings.updateUnavailableError);
    }
  }


  onClickMenu = () => {
    this.props.actions.openMenu();
  }

  onClickHome = () => {
    Actions.popTo('Frontpage');
  }

  onClickKey = () => {
    Actions.pop();
  }

  onClickSP = (sp, nerBy) => {
    Actions.Species({nerby: nerBy, selectedSpecies: sp});
  }

  /**
   * used for setting the state of the list of all species that is left in collection, but not have any observations locally.
   * @param {array} nerbyList list of species that has observations locally
   * @return {array}
   */
  setNotNerby(nerbyList) {
    let spList = this.props.chosenValues.length === 0 ? this.props.fullSpList : this.props.speciesLeft;
    l = [];
    for (let i = 0; i < spList.length; i++) {
      k = _.findIndex(nerbyList, {species_id: spList[i].species_id});
      if (k === -1) {
        l.push(spList[i]);
      }
    }
    return l;
  }

  /**
   * used for making a list of all eliminated species
   * @return {array}
   */
  setElimList() {
    if (this.props.chosenValues.length === 0) {
      return [];
    }
    return this.props.fullSpList.filter(x => _.findIndex(this.props.speciesLeft, {species_id: x.species_id}) == -1);
  }

  /**
   * if connected to internett will it update the list of locally observed species to current location.
   * @return {void}
   */
  geoOnPress = () => {
    if (this.props.isConnected) {
      if (this.props.latitude !== 'undefined') {
        k = this.props.keys[_.findIndex(this.props.keys, {key_id: this.props.chosenKey})];
        this.props.actions.updateNerbyList([k], this.props.latitude, this.props.longitude);
      }
      else if (this.props.latitude === 'undefined') {
        alert(this.props.strings.noLocation);
      }
      else if (!this.props.isConnected) {
        this.refs.toast.show(this.props.strings.noNetwork,1500);
      }
    }
  }

  /**
   * set selections lists with data
   * @return {void}
   */
  getSections() {
    let ret = [];
    if (this.state.leftNerbyList.length !== 0) {
      ret.push({data: this.state.leftNerbyList, key: 'geo'});
    }
    if (this.state.leftNotGeo.length !== 0) {
      ret.push({data: this.state.leftNotGeo, key: 'left'});
    }
    if (this.state.spElim.length !== 0 ) {
      ret.push({data: this.state.spElim, key: 'elim'});
    }
    return ret;
  }

  renderSectionHeader = ({section}) => {
    switch (section.key) {
    case 'geo':
      return (
        <View style = {{padding: (this.props.deviceTypeAndroidTablet ? 10 : 5 ), backgroundColor: '#c9c9c9'}}>
        <Text style = {{fontSize: (this.props.deviceTypeAndroidTablet ? 26 : 13 )}}>{this.props.strings.leftGeo}</Text>
      </View>);
      break;
    case 'left':
      if (this.props.nerbyList.length === 0) {
        return (
          <View style = {{padding: (this.props.deviceTypeAndroidTablet ? 4 : 2 ), marginTop: -1, backgroundColor: '#c9c9c9'}}>
        </View>);
      }
      return (
        <View style = {{padding: (this.props.deviceTypeAndroidTablet ? 10 : 5 ), marginTop: -1, backgroundColor: '#c9c9c9'}}>
        <Text style = {{ fontSize: (this.props.deviceTypeAndroidTablet ? 26 : 13 )}}>{this.props.strings.leftNotGeo}</Text>
      </View>);
      break;
    case 'elim':
      return (
        <View>
        <Title style = {{ color: '#F8F8F8',backgroundColor: '#F0A00C', padding: (this.props.deviceTypeAndroidTablet ? 20 : 10) }}>{this.props.strings.eliminated}</Title>
      </View>);
      break;
    default:
      return (
        <View>
        <Title style = {{padding: (this.props.deviceTypeAndroidTablet ? 20 : 10) }}>{this.props.strings.eliminated}</Title>
        <ListItem itemDivider style = {{ marginTop: -1 }}><Text style = {{fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15 )}}>{this.props.strings.eliminated}</Text></ListItem>
      </View>);
    }
  }

  /**
   * renders item, sorts after if locally found.
   * @param {Object} item Secies object
   * @return {View} Species list item view
   */
  renderItem = ({item}) => {
    let t = this.props.nerbyList[_.findIndex(this.props.nerbyList, {species_id: item.species_id})];
    if (this.props.nerbyList.length !== 0 && typeof t !== 'undefined' ) {
      return (
        <ListItem button key= {item.species_id} onPress={this.onClickSP.bind(this,item, t.obsSmall )}>
          <SpeciesElement
            key= {item.species_id}
            species_id = {item.species_id}
            latinName =  {item.latinName}
            localName = {item.localName}
            obsSmall = {t.obsSmall}
            obsMedium = {t.obsMedium}
            obsLarge = {t.obsLarge}
            isAndroidTablet = {this.props.deviceTypeAndroidTablet}
            noObs = {this.props.nerbyList.length === 0 ? false : true}
            />
        </ListItem>
      );
    }
    return (
      <ListItem button key= {item.species_id} onPress={this.onClickSP.bind(this,item, 0 )}>
        <SpeciesElement
          key= {item.species_id}
          species_id = {item.species_id}
          latinName =  {item.latinName}
          localName = {item.localName}
          obsSmall = {0}
          obsMedium = {0}
          obsLarge = {0}
          isAndroidTablet = {this.props.deviceTypeAndroidTablet}
          noObs = {this.props.nerbyList.length === 0 ? false : true}
        />
      </ListItem>
    );
  }

  /**
   * Extracts key for species item.
   * @param {Object} item  species object
   * @param {Integer} index position of item
   * @return {Integer} id of species
   */
  keyExtractor = (item, index) => {
    return item.species_id;
  }


  render() {
    return(
      <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
        <Container>
          <Header>
              <Left>
              <Button transparent onPress={this.onClickMenu}>
                  <Icon name='ios-menu' />
              </Button>
              </Left>
              <Body style={{flex: 3}}>
                <Title>{this.props.chosenKeyTitle}</Title>
              </Body>
              <Right>
                <Button transparent>
                    <Icon name='ios-pin' onPress={this.geoOnPress}/>
                </Button>
              </Right>
            </Header>
          <Content >
            <Title style = {{ color: '#F8F8F8',backgroundColor: '#5FBB5A', padding: (this.props.deviceTypeAndroidTablet ? 20 : 10) }}>{this.props.strings.left}</Title>
          {this.state.leftNotGeo.length === 0 && this.props.speciesLeft.length === 0 && <View style = {{ height: (this.props.deviceTypeAndroidTablet ? 100 : 50), backgroundColor: '#FFF'}}/>}
          <SectionList
              renderItem={this.renderItem}
              initialNumToRender = {11}
              keyExtractor={this.keyExtractor}
              renderSectionHeader={ this.renderSectionHeader}
              sections={this.getSections()}
            />
          <View style = {{ height: (this.props.deviceTypeAndroidTablet ? 100 : 50), backgroundColor: '#FFF'}}/>
          </Content>
          <Footer>
            <FooterTab>
                <Button transparent onPress={this.onClickHome}>
                    <Icon name='md-home'/>
                </Button>
                <Button transparent onPress={this.onClickKey}>
                    <Icon name='md-key'/>
                </Button>
                <Button transparent >
                  <Text style={this.props.deviceTypeAndroidTablet && {fontSize: 30}}>{this.props.chosenValues.length === 0 ? this.props.fullSpList.length : this.props.speciesLeft.length }</Text>
                  <Icon name='ios-bug'/>
                </Button>
            </FooterTab>
          </Footer>
          <Toast ref="toast"/>
          <Modal
            offset={0}
            animationDuration={200}
            animationTension={40}
            closeOnTouchOutside={false}
            open={this.props.nerby_updated_loading}
            modalDidOpen={() => {}}
          >
            <Text style={{textAlign: 'center', fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15)}}>{this.props.strings.downloading}</Text>
            <Spinner color='green' />
          </Modal>
          <Modal
            offset={0}
            animationDuration={200}
            animationTension={40}
            closeOnTouchOutside={false}
            open={this.state.loading}
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

export default connect(mapStateToProps, mapDispatchToProps)(SpeciesLeft);
