/**
 * @file Key.js
 * @author Kjetil Fossheim
 *
 * In this screen the identification process in the app happens. It makes and maintains the list of choses the user can take.
 * Ads and removes choses no longer viable.
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  SectionList,
  Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, StyleProvider, Header, Footer, Subtitle, FooterTab, Thumbnail, Title, Content, Button, Icon, ListItem, Left, Body, Right} from 'native-base';
import TraitWrapper from '../components/exList/TraitWrapper';


// theme
import getTheme from '../native-base-theme/components';
import common from '../native-base-theme/variables/commonColor';
import androidTablet from '../native-base-theme/variables/androidTablet';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as KeyAction from '../actions/KeyAction';
import * as MenuAction from '../actions/MenuAction';

const mapStateToProps = (state) => ({
  ...state.key,
  ...state.nav,
  ...state.menu,
  ...state.observations,
  ...state.settings,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...KeyAction, ...MenuAction}, dispatch)
  };
}

class Key extends Component {

  /**
   * Sets state to component
   * - nerbyLeft: number of species left with observations nearby (length of leftNerbyList)
   * - leftNerbyList: list of species left with observations nearby
   * - relevant: List of relevant traits for the remaining species.
   * - irelevant: List of irrelevant traits for the remaining species.
   * @see this.numberNerby
   */
  constructor(props) {
    super(props);
    list = this.numberNerby(props.fullSpList);
    this.state = {
      error: null,
      alertShown: false,
      nerbyLeft: list.length,
      leftNerbyList: list,
      relevant: this.props.traitValueCombo,
      irelevant: [],
    };
  };

  /**
   * resets the key logic if it is not the second time in a row the user access the key.
   * @return {void}
   */
  componentWillMount() {
    if (!this.props.navigationState.sameKey) {
      this.props.actions.resetKey(this.props.chosenKey);
    }
    this.props.actions.resettingReset();
  }

  componentDidMount() {
  }

  /**
   * compares to arrays to see if they are identical.
   * @param {array} a list a for comparison
   * @param {array} b list b for comparison
   * @return {bool} true if array a and b are identical.
   */
  arraysIdentical(a, b) {
    let i = a.length;
    if (i != b.length) return false;
    while (i--) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  /**
   * sets new values to nerbyLeft and leftNerbyList if there is any changes in the species left lists. Uses full list if no traitvalues are chosen.
   * @param {Object} nextProps next props received to component
   * @see this.numberNerby
   * @see this.arraysIdentical
   * @return {void} sets state to nearby left
   */
  componentWillReceiveProps(nextProps) {
    if (!this.arraysIdentical(this.props.speciesLeft, nextProps.speciesLeft) || nextProps.speciesLeft.length === 0) {
      ret = this.numberNerby(nextProps.chosenValues.length !== 0 ? nextProps.speciesLeft : nextProps.fullSpList);
      this.setState({
        nerbyLeft: ret.length,
        leftNerbyList: ret,
      });
    }
  };

  /**
   * makes a list of species left with some observations locally.
   * @param {array} spList list to use for species left, either from reduced list of species or from total list.
   * @return {array} list of species left with some observations locally
   */
  numberNerby(spList) {
    l = [];
    if (this.props.nerbyList.length !== 0) {
      for (let i = 0; i < this.props.nerbyList.length; i++) {
        k = _.findIndex(spList, {species_id: this.props.nerbyList[i].species_id});
        if (k !== -1) {
          l.push(spList[k]);
        }
      }
    }
    return l;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'Key';
  };

  /**
   * componentDidUpdate monitors the updates of the props, to see if there is 1 or 0 species left in the selection.
   * It shows Alert to the user, were the user can be sent to SpeciesLeft.js.
   * componentDidUpdate also updates State if the key is reset.
   * @return {void}
   */
  componentDidUpdate() {
    if (this.props.speciesLeft.length === 1 && !this.state.alertShown && this.props.chosenValues.length !== 0) {
      this.setState({
        alertShown: true,
      });
      Alert.alert(
        this.props.strings.onSpLesft,
        '',
        [
          {text: 'OK', onPress: () => {}},
          {text: this.props.strings.goToSp, onPress: () => {
            this.onClickSpLeft();
          }},
        ],
        { cancelable: false }
      );
    }
    if (this.props.speciesLeft.length > 1 && this.state.alertShown) {
      this.setState({
        alertShown: false,
      });
    }
    if (this.props.speciesLeft.length === 0 && !this.state.alertShown && this.props.chosenValues.length !== 0 && !this.props.speciesLeftLoading) {
      this.setState({
        alertShown: true,
      });
      Alert.alert(
        this.props.strings.zeroSpLeft,
        '',
        [
          {text: 'OK', onPress: () => {}}
        ],
        { cancelable: false }
      );
    }
    if (this.props.resetting) {
      list = this.numberNerby(this.props.fullSpList);
      this.props.actions.resettingReset();
      this.setState({
        nerbyLeft: list.length,
        leftNerbyList: list,
      });
    }
  }

  onClickMenu = () => {
    this.props.actions.openMenu();
  }

  onClickHome = () => {
    Actions.pop();
  }

  onClickSpLeft = () => {
    Actions.SpeciesLeft({leftNerbyList: this.state.leftNerbyList});
  }

  /**
   * resets the keyExtractor
   * @see KeyAction.resetKey
   */
  resetKey = () => {
    this.setState({
      alertShown: false,
    });
    this.props.actions.resetKey(this.props.chosenKey);  // changeValues([],[]); // kan byttes
  }

  /**
   * Function that manage the user change of values.
   * @param {Integer} newValue id of the new value presses
   * @param {Integer} oldValue id of the old value used if there is already a selected value of that trait.
   * @param {Integer} trigger  trigger id to tell the function what to do, 0 = no previous selected value, 1 = previous selected value is to be replaced, -1 = previous selected value is to be removed
   * @see TraitWrapper.onChildClick
   * @param {Integer} trait    id of the trait of the value selected.
   * @return {void} updates redux State
   * @see KeyAction .changeValues .setSpeciesLeft
   */
  onValueChange = (newValue, oldValue, trigger, trait) => {
    let tempValuelist = this.props.chosenValues;
    let tempTraitList = this.props.chosenTraits;
    if (trigger === 0) {
      tempValuelist.push(newValue);
      tempTraitList.push(trait);
      this.props.actions.changeValues(tempValuelist, tempTraitList, this.props.chosenKey);
      this.props.actions.setSpeciesLeft(tempValuelist,this.props.chosenKey);
    }
    else if (trigger === 1) {
      tempValuelist.push(newValue);
      let i = tempValuelist.indexOf(oldValue);
      tempValuelist.splice(i, 1);
      this.props.actions.changeValues(tempValuelist, tempTraitList, this.props.chosenKey);
      this.props.actions.setSpeciesLeft(tempValuelist,this.props.chosenKey);
    }
    else if (trigger === -1 ) {
      let i = tempValuelist.indexOf(oldValue);
      tempValuelist.splice(i, 1);
      let j = tempTraitList.indexOf(oldValue);
      tempTraitList.splice(j, 1);
      this.props.actions.changeValues(tempValuelist, tempTraitList, this.props.chosenKey);
      this.props.actions.setSpeciesLeft(tempValuelist,this.props.chosenKey);
    }
  }

  /**
   * Sets selection for the Trait list, sort the traits into irrelevant and relevant, and all Traits if no values are chosen.
   * @return {array[Object]} array of Objects for the different lists shown.
   */
  getSections() {
    let ret = [];
    if (this.props.relevant.length !== 0) {
      ret.push({data: this.props.relevant, key: 'relevant'});
    }
    if (this.props.irelevant.length !== 0 ) {
      ret.push({data: this.props.irelevant, key: 'irelevant'});
    }
    if (this.props.relevant.length === 0 && this.props.irelevant.length === 0) {
      ret.push({data: this.props.traitValueCombo, key: 'relevant'});
    }
    return ret;
  }

  renderSectionHeader = ({section}) => {
    switch (section.key) {
    case 'relevant':
      return (
        <View >
      </View>);
      break;
    case 'irelevant':
      return (
        <View style = {{padding: (this.props.deviceTypeAndroidTablet ? 10 : 5 ), marginTop: -1, backgroundColor: '#c9c9c9'}}>
        <Text style = {{ fontSize: (this.props.deviceTypeAndroidTablet ? 26 : 13 )}}>{this.props.strings.irelevant}</Text>
      </View>);
      break;
    default:
      return (
        <View>
        <Title style = {{padding: (this.props.deviceTypeAndroidTablet ? 20 : 10) }}>{section.key}</Title>
        <ListItem itemDivider style = {{ marginTop: -1 }}><Text style = {{fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15 )}}>{section.key}</Text></ListItem>
      </View>);
    }
  }

  /**
   * Test if trait have any species associated with it.
   * This is to make it so the trait only shows in the list if all or parts of the traits species list is left in species selection.
   * @param {array} speciesToTrait array of species for the tested trait.
   * @return {bool} false == if the speciesLeft array contains a species that is not in the traits species list. true == if speciesLeft only contains all or less of speciesToTrait.
   */
  testTrait(speciesToTrait) {
    for (let i = 0; i < this.props.speciesLeft.length; i++) {
      if (!speciesToTrait.includes(this.props.speciesLeft[i].species_id)) {
        return false;
      }
    }
    return true;
  }

  /**
   * function to see if Trait view is to be rendered.
   * @param {Object} item the Trait to be rendered
   * @see testTrait
   * @return {View} List item to display in the Trait list.
   */
  renderData = ({item}) => {
    let noView = false;
    k = _.findIndex(this.props.irelevant, {trait_id: item.trait_id});
    if (k !== -1) {
      noView = true;
    }
    if (item.speciesToTrait.length > 0) {
      if (this.props.speciesLeft.length === 0) {
        return false;
      }
      if (!this.testTrait(item.speciesToTrait) ) {
        return false;
      }
    }

    return (
        <ListItem key= {item.trait_id} style = {noView ? { opacity: 0.5,} : {}}>
          <TraitWrapper
            key= {item.trait_id}
            trait= {item}
            onChildClick = {this.onValueChange}
            traitTitle = {item.traitText}
            traitID = {item.trait_id}
            elimlist = {item.eliminate}
            noView = {noView}
            children={ item.values }/>
        </ListItem>
    );
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
            <Right style={{marginRight: 5}}>
              <Button transparent onPress={this.resetKey}>
                  <Icon name='md-refresh' style={this.props.deviceTypeAndroidTablet ? {fontSize: 40} : {fontSize: 20}} />
                <Text style={this.props.deviceTypeAndroidTablet && {fontSize: 30}}>{this.props.strings.reset}</Text>
                </Button>
            </Right>
          </Header>
          <Content >
            <Subtitle style= {{alignSelf: 'center', padding: 5, fontSize: (this.props.deviceTypeAndroidTablet ? 20 : 10)}}>{this.props.strings.longclick}</Subtitle>
            <SectionList
                renderItem={this.renderData}
                initialNumToRender = {11}
                keyExtractor={(item, index) => item.trait_id}
                renderSectionHeader={ this.renderSectionHeader}
                sections={this.getSections()}
                extraData = {this.props.resetting}
              />
          </Content>
          <Footer>
          <FooterTab>
              <Button transparent onPress={this.onClickHome}>
                  <Icon name='md-home'/>
              </Button>
              {this.props.nerbyList.length !== 0 &&
                <Button transparent onPress={this.onClickSpLeft}>
                    <Text style={this.props.deviceTypeAndroidTablet && {fontSize: 30}}>{this.state.nerbyLeft}</Text>
                    <Icon name='md-globe'/>
                </Button>
              }
              <Button  transparent onPress={this.onClickSpLeft}>
                <Text style={this.props.deviceTypeAndroidTablet && {fontSize: 30}}>{this.props.chosenValues.length === 0 ? this.props.fullSpList.length : this.props.speciesLeft.length }</Text>
                <Icon name='ios-bug'/>
              </Button>
          </FooterTab>
        </Footer>
      </Container>
      </StyleProvider>
    );
  };
}

Key.defaultProps = {
  title: '',
  spLeft: 12,
};


export default connect(mapStateToProps, mapDispatchToProps)(Key);
