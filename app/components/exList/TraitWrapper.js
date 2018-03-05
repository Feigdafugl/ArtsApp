/**
 * @file TraitWrapper.js
 * @author Kjetil Fossheim
 *
 * Wraps a set of value views in a wrapper that controls click and value states.
 */
import React, { Component } from 'react';
import {
  Text,
  Platform,
  View,
  StyleSheet
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {Button,Icon} from 'native-base';
import GroupChild from './GroupChild';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as KeyAction from '../../actions/KeyAction';

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


class TraitWrapper extends Component {

  /**
   * state:
   * selected = selected value, no value selected = -1
   * collapsed = TraitWrapper collapsed and values is not showing
   */
  constructor(props) {
    super(props);
    this.state = {
      selected: -1,
      collapsedHeight: 0,
      collapsed: true,
      groupId: props.traitID,

    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'Key';
  };

  /**
   * monitors props for changes if trait is disabled or key is reset
   * @param {Object} nextProps
   * @return {void}
   */
  componentWillReceiveProps(nextProps) {
    if(this.props.elimlist.length !== 0) {
      this.setState({ disable: this.disableTrait() });
    }
    if (nextProps.resetting) {
      this.setState({collapsed: true, selected: -1,});
    }
  }


  /**
   * sets selected to selected value id
   * @return {void}
   */
  componentDidMount() {
    if (this.props.chosenValues.length > 0) {
      for (let i = 0; i < this.props.children.length; i++) {
        if(this.props.chosenValues.includes(this.props.children[i].value_id)) {
          this.setState({
            selected : this.props.children[i].value_id,
            collapsed: false,
          });
        }
      };
    }
  }

  /**
   * collapses and display value list
   */
  toggle = () => {
    this.setState({
      collapsed : !this.state.collapsed
    });
  }

  /**
   * manage the user change of values within the trait wrapper
   * trigger:
   * returns -1 if the earlier selected id is to be removed
   * returns 0 if there has not been a chosen id earlier
   * returns number of the old selected value to be removed
   * @param {Integer} id [description]
   * @return {void} run parent onChildClick, sends id of value, trigger, trait id
   */
  onChildClick = (id) => {
    trigger = 0;

    if (this.state.selected === id) {
      this.setState({selected: -1});
      trigger = -1;
    }
    else if (this.state.selected === -1) {
      trigger = 0;
      this.setState({selected: id});
    }
    else {
      trigger = 1;
      this.setState({selected: id});
    }
    this.props.onChildClick(id, this.state.selected, trigger, this.props.traitID);
  }
  /**
   * in use but has no meaning to the app, to be removed
   * @return {bool} true = disable false = not disable
   */
  disableTrait() {
    return this.props.elimlist.some( v => {
      return this.props.chosenValues.indexOf(v) >= 0;
    });
  }


  renderWrapper() {
    const wrapp = [];
    const childList = this.props.children;
    for (let j = 0; j < childList.length; j++) {
      wrapp.push(
          <GroupChild
            isSelected= {childList[j].value_id === this.state.selected}
            selected = {this.state.selected !== -1}
            disabled = {this.state.disable}
            onClick={this.onChildClick}
            key={childList[j].value_id}
            id={childList[j].value_id}
            valueInfo= {childList[j].valueInfo}
            text={childList[j].valueText}/>
      );
    }
    if (Platform.OS === 'ios') {
      return (<Collapsible collapsed = {this.state.collapsed} align="center" style={styles.body}>
        {wrapp}
      </Collapsible>);

    }
    return (<View style = {{height: this.state.collapsed ? 0 : null}}>{wrapp}</View>);
  }

  render() {
    return (
      <View style= {styles.container}>
      <Button iconRight block transparent full
        disabled = {this.state.disable}
        textStyle = {this.state.disable ? {color: '#a4a4a4'} : null}
        key={this.props.traitID} id= {this.props.traitID} title= {this.props.traitTitle} onPress={this.toggle}>
        <Text style = {{fontSize:(this.props.deviceTypeAndroidTablet ? 30 : 15)}}>{this.props.traitTitle}</Text>
      {this.props.noView && <Icon style={{backgroundColor: 'rgba(255, 255, 255, 0)', fontSize: 20, color: 'red', margin: -10, justifyContent: 'flex-end'}} name='md-close-circle'/>}
      </Button>
      {!this.state.collapsed && this.renderWrapper()}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  selected: {
    backgroundColor: '#21c9e0',
  },
  unSelected: {
    backgroundColor: '#bee6f7',
  },
  container   : {
    backgroundColor: '#fff',
    margin:0,
    flex: 1,
  },
  titleContainer : {
    flexDirection: 'row'
  },
  inActiv: {
    flex: 1,
    opacity: 0.5,
    marginTop: 0,
    backgroundColor: 'rgba(139, 139, 139, 0.23)',
  },
  title       : {
    padding : 10,
    color   :'#2a2f43',
    fontWeight:'bold'
  },
  button      : {

  },
  buttonImage : {
    width   : 30,
    height  : 25
  },
  body        : {

    padding     : 10,
    paddingTop  : 0
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(TraitWrapper);
