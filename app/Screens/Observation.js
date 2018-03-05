/**
 * @file Observation.js
 * @author Kjetil Fossheim
 *
 * Displays list of user stored observations.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { StyleProvider, Container, Header, Title, Content, List, ListItem, Icon, Button, Left, Right, Body} from 'native-base';
import ObservationElement from '../components/ObservationElement';
import { Actions } from 'react-native-router-flux';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ObservationAction from '../actions/ObservationAction';

// theme
import getTheme from '../native-base-theme/components';
import common from '../native-base-theme/variables/commonColor';
import androidTablet from '../native-base-theme/variables/androidTablet';


const mapStateToProps = (state) => ({
  ...state.key,
  ...state.observations,
  ...state.settings,
  ...state.nav,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...ObservationAction }, dispatch)
  };
}


class Observation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      deleteobsNr: -1,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'Observation';
  };

  componentDidMount() {
    this.props.actions.getObservations();
  }


  onClickBack = () => {
    Actions.pop();
  }

  /**
   * Show Delete dialog, and deletes entry if yes is selected.
   * @param {integer} i id of selected observation
   */
  onClickDelete = (i) => {
    Alert.alert(
      this.props.strings.deleteObsTitle,
      this.props.strings.deleteObs + ' ',
      [
      {text: this.props.strings.cancel, onPress: () => {}, style: 'cancel'},
      {text: this.props.strings.acsept, onPress: () => this.props.actions.deleteObservation(i)},
      ],
      { cancelable: true }
    );
    // this.setState({open: true, deleteobsNr: i,});
  }

/**
 * Renders list of all user observations.
 * @return {array} list of Listitems of user observations
 */
  renderList() {
    ret = [];
    for (let i = 0; i < this.props.obsevationsList.length; i++) {
      ret.push(
        <ListItem key = {this.props.obsevationsList.item(i).userObservation_id}>
            <ObservationElement
              latinName = {this.props.obsevationsList.item(i).latinName}
              localName = {this.props.obsevationsList.item(i).localName}
              place = {this.props.obsevationsList.item(i).place}
              county = {this.props.obsevationsList.item(i).county}
              latitude = {this.props.obsevationsList.item(i).latitude}
              longitude = {this.props.obsevationsList.item(i).longitude}
              obsDateTime = {this.props.obsevationsList.item(i).obsDateTime}
            />
          <Button style={this.props.deviceTypeAndroidTablet ? {alignSelf: 'center'} : {}} transparent onPress={this.onClickDelete.bind(this, this.props.obsevationsList.item(i).userObservation_id )}>
            <Icon style={this.props.deviceTypeAndroidTablet ? {fontSize: 50, alignSelf: 'center'} : {}} name='ios-trash' />
          </Button>
        </ListItem>
      );
    }
    return ret;
  }

  renderEmpty() {
    return (
        <View style={styles.container}>
          <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text : styles.text}>{this.props.strings.noObservations}</Text>
        </View>
    );
  }

  render() {
    return(
      <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.onClickBack}>
                  <Icon name='ios-arrow-back-outline'/>
              </Button>
            </Left>
            <Body style={{flex: 3}}>
            <Title>{this.props.strings.myObs}</Title>
            </Body>
            <Right/>
          </Header>
         <Content >
            <List>
               {this.props.obsevationsList.length === 0 ? this.renderEmpty() : <List>{this.renderList()}</List>}
            </List>
         </Content>
       </Container>
     </StyleProvider>
    );
  };

}

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    fontSize: 20,
    color: '#999999',
  },
  text3: {
    marginBottom: 20,
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    color: '#000000',
  },
  container: {
    flex: 1,
  },
  modal: {
    position:'absolute',
    marginTop: 50,
    left: 0,
    top: 0,
  }
});

const AndroidTabletStyles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    fontSize: 40,
    color: '#999999',
  },
  text3: {
    marginBottom: 20,
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    color: '#000000',
  },
  container: {
    flex: 1,
  },
  modal: {
    position:'absolute',
    marginTop: 50,
    left: 0,
    top: 0,
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Observation);
