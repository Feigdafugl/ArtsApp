/**
 * @file Species.js
 * @author Kjetil Fossheim
 *
 * Screen for showcase the selected species and information about it. Information contains: -images -description -distribution -local regestraited observations.
 * In addition the user has a possibility to store its own observations.
 */


import React, { Component } from 'react';
import {StyleProvider, Button, Container, Header, Title, Subtitle, Content, Footer, FooterTab,  Icon, Tabs, Tab, Grid, Row, Col, Left, Right, Body} from 'native-base';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast, {DURATION} from 'react-native-easy-toast';
import Modal from 'react-native-simple-modal';
import TabInfo from '../components/TabInfo';
import TabDistribution from '../components/TabDistribution';

// theme
import getTheme from '../native-base-theme/components';
import common from '../native-base-theme/variables/commonColor';
import androidTablet from '../native-base-theme/variables/androidTablet';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as KeyAction from '../actions/KeyAction';
import * as ObservationAction from '../actions/ObservationAction';

const mapStateToProps = (state) => ({
  ...state.key,
  ...state.observations,
  ...state.settings,
  ...state.nav,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...KeyAction, ...ObservationAction }, dispatch)
  };
}

class Species extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      open: false,
      place: '',
      county: '',
      images: [],
      selectedSpeciesImages: [],
      nerby: props.nerby,
    };
  }

  componentWillMount() {
    date = new Date();
    this.setState({ obsDateTime: date.getDate()  + '-' +  date.getMonth() + '-' +  date.getFullYear()});

  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'Species';
  };

  componentDidMount() {
    if (typeof this.props.spesiecImageList.get(this.props.selectedSpecies.species_id) !== 'undefined') {
      this.setState({
        selectedSpeciesImages: this.props.spesiecImageList.get(this.props.selectedSpecies.species_id),
      });
    }
  }

  componentWillUnmount() {
  }

  onClickBack = () => {
    Actions.pop();
  }

  onClickNewObs = () => {
    this.setState({open: false});
    this.saveNewObs();
  }

  onClickSPImage = () => {
    if (this.state.selectedSpeciesImages.length !== 0) {
      Actions.SpeciesImageViewer({spImage: this.state.selectedSpeciesImages});
    }
  }

  /**
   * Function to store a new observation. makes a  observation object and saves it to DB
   * @see ObservationAction.insertObservation
   * @return {void}
   */
  saveNewObs() {
    newObs = {
      latinName: this.props.selectedSpecies.latinName,
      localName: this.props.selectedSpecies.localName,
      order: this.props.selectedSpecies.order,
      family: this.props.selectedSpecies.family,
      species_id: this.props.selectedSpecies.species_id,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      place: this.state.place,
      county: this.state.county,
      key_id: this.props.chosenKey,
      obsDateTime: this.state.obsDateTime,
    };
    this.props.actions.insertObservation(newObs);
    this.refs.toast.show(this.props.strings.newObsAddeed);
  }

/**
 * Tests coordinate and sets it for use in new observations.
 * @return {void} setState
 */
  getCoordinate = () => {
    if (this.props.latitude !== 'undefined') {
      this.setState({latitude: this.props.latitude, longitude: this.props.longitude, open: true});
    }
    else if (this.props.latitude === 'undefined') {
      alert(this.props.strings.noLocation);
    }
  }

/**
 * Renders the header after the available information about the species.
 * @return {View} Header View
 */
  renderHeader() {
    if (this.props.selectedSpecies.latinName === 'NA' && this.props.selectedSpecies.localName === 'NA') {
      return (
        <Body style={{flex: 3}}>
          <Title>{}</Title>
          <Subtitle>{}</Subtitle>
        </Body>
      );

    }
    else if (this.props.selectedSpecies.latinName === 'NA') {
      return (
        <Body style={{flex: 3}}>
          <Title>{this.props.selectedSpecies.localName}</Title>
        </Body>
      );

    }
    else if (this.props.selectedSpecies.localName === 'NA') {
      return (
        <Body style={{flex: 3}}>
          <Title>{this.props.selectedSpecies.latinName}</Title>
        </Body>
      );
    }
    return (
      <Body style={{flex: 3}}>
        <Title>{this.props.selectedSpecies.localName}</Title>
      <Subtitle style = {this.props.deviceTypeAndroidTablet ? {fontSize: 29, marginLeft: 10, marginBottom: 5, marginTop: -10} : {}}>{this.props.selectedSpecies.latinName}</Subtitle>
      </Body>
    );
  }

/**
 * render nearby observation if available.
 * @return {View} Nearby text view
 */
  renderNerby() {
    if (this.props.nerby !== 0 ) {
      return (
        <Row style={{justifyContent: 'center',}}>
          <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.containerSpecies : styles.containerSpecies}>{this.props.strings.nObs + this.props.nerby}</Text>
        </Row>
      );
    }
    return (
      <Row style={{justifyContent: 'center',}}>
        <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.containerSpecies : styles.containerSpecies}>{''}</Text>
      </Row>
    );
  }

  render() {
    return (
      <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
      <Container>
          <Header hasTabs>
            <Left>
              <Button transparent onPress={this.onClickBack}>
                <Icon name='ios-arrow-back-outline'/>
              </Button>
            </Left>
            {this.renderHeader()}
            <Right/>
          </Header>
          <Content scrollEnabled ={false}>
            <Grid>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>
                  <Col style={{flex: 1}}>
                    <Button
                      transparent
                      success
                      block
                      style= {{flexDirection: 'column', height: 100}}
                      title={this.props.strings.image}
                      onPress={this.onClickSPImage}
                      disabled = {this.state.selectedSpeciesImages.length === 0 ? true : false} >
                      <Icon name='md-photos' style={this.state.selectedSpeciesImages.length === 0 ? {color: 'grey'} : {}}/>
                      <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.image}</Text>
                    </Button>
                    </Col>
                <Col style={{flex: 2}}>
                  <TouchableHighlight  underlayColor = {'rgba(223, 223, 223, 0.14)'} onPress={this.onClickSPImage}>
                    <Image style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.image : styles.image} source={this.props.platform === 'ios' ? { uri: this.state.selectedSpeciesImages[0]} : { uri: 'file://' + this.state.selectedSpeciesImages[0]}}/>
                  </TouchableHighlight>
                  </Col>
                <Col style={{flex: 1}}>
                      <Button
                        title = {this.props.strings.save}
                        transparent
                        success
                        block
                        style= {{flexDirection: 'column', height: 100}}
                        onPress={this.getCoordinate} >
                        <Icon name="ios-folder-open" />
                        <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.save}</Text>
                      </Button>
                    </Col>
                </Row>
                {this.renderNerby()}
            </Grid>
            <Tabs style={{flex: 1}}>
              <Tab heading={this.props.strings.spInfo}>
                <View style={{ height: (this.props.deviceTypeAndroidTablet ? 670 : 335), margin: (this.props.deviceTypeAndroidTablet ? 20 : 5)}}>
                  <TabInfo  tablet = {this.props.deviceTypeAndroidTablet} style = {styles.container} info = {this.props.selectedSpecies.speciesText}/>
                </View>
            </Tab>
              <Tab heading={this.props.strings.distribution}>
                <View style={{ height: (this.props.deviceTypeAndroidTablet ? 670 : 335), margin: (this.props.deviceTypeAndroidTablet ? 20 : 5)}}>
                  <TabDistribution distributionLocal = {this.props.selectedSpecies.distributionLocal} distributionCountry = {this.props.selectedSpecies.distributionCountry}/>
                </View>
              </Tab>
            </Tabs>
         </Content>
         <Modal
           offset={0}
           animationDuration={200}
           animationTension={40}
           closeOnTouchOutside={false}
           open={this.state.open}
           modalDidClose={() => this.setState({open: false})}
         >
         <View>
           <Text style={{fontSize: (this.props.deviceTypeAndroidTablet ? 40 : 20), marginBottom: 10, textAlign: 'center'}}>{this.props.strings.newObs}</Text>
           <View key = 'divider' style={{height: 2, backgroundColor: '#dadada'}}/>
           <View style={{flexDirection: 'row'}}>
             <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.species + ':   '}</Text>
             <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.selectedSpecies.latinName + ' / ' + this.props.selectedSpecies.localName }</Text>
           </View>
           <View style={{flexDirection: 'row'}}>
             <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.date + ':   '}</Text>
           <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.state.obsDateTime}</Text>
           </View>
           <View style={{flexDirection: 'row'}}>
             <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.coordinate + ':   '}</Text>
             <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.state.latitude + ', ' + this.state.longitude }</Text>
           </View>
           <View style={{flexDirection: 'column'}}>
             <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.location + ':   '}</Text>
             <TextInput
               placeholder= {this.props.strings.place}
               style={{ height: (this.props.deviceTypeAndroidTablet ? 60 : 35), fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15), borderColor: 'gray', borderWidth: 1, margin: 5, marginBottom: 1}}
               onChangeText={(place) => this.setState({place})}
               value={this.state.place}
             />
           <View style = {{height: 10 }}/>
             <TextInput
               placeholder= {this.props.strings.county}
               style={{height: (this.props.deviceTypeAndroidTablet ? 60 : 35), fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15), borderColor: 'gray', borderWidth: 1, margin: 5, marginTop: 1}}
               onChangeText={(county) => this.setState({county})}
               value={this.state.county}
             />
           </View>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
             <Button  iconLeft style = {{padding: 10}} transparent bordered onPress={() => this.setState({open: false})}>
               <Icon name="ios-close-circle" />
             <Text style = {this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3 }>{this.props.strings.cancel}</Text>
             </Button>
             <Button
               disabled = {this.state.county === '' || this.state.place === '' || this.state.latitude === '' ? true : false}
               transparent
               iconLeft
               bordered
               onPress={this.onClickNewObs}>
               <Icon name="ios-folder-open" />
             <Text style = {this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3 }>{this.props.strings.save}</Text>
             </Button>
           </View>
          </View>
        </Modal>
        <Toast ref="toast"/>
     </Container>
   </StyleProvider>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  containerSpecies: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    fontSize: 15,
  },
  image: {
    alignSelf: 'center',
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#c2c2c2',
    width: 150,
    height: 150,
    margin: 20,
    padding: 20,
  }
});

const AndroidTabletStyles = StyleSheet.create({
  text3:{
    fontSize: 30,
    marginBottom: 5,
    textAlign: 'center',
    color: '#000000',
  },
  containerSpecies: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    fontSize: 30,
  },
  image: {
    alignSelf: 'center',
    borderRadius: 150,
    borderWidth: 1,
    borderColor: '#c2c2c2',
    width: 300,
    height: 300,
    margin: 40,
    padding: 40,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Species);
