/**
 * @file SpeciesElement.js
 * @author Kjetil Fossheim
 *
 * List element for species in the species lists in SpeciesLeft.js
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { Grid, Row, Col} from 'native-base';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
const mapStateToProps = (state) => ({
  ...state.nav,
  ...state.key,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({}, dispatch)
  };
}

class SpesiesElement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'SpeciesLeft';
  };


  componentWillReceiveProps(newprops) {
    // metode
    // If you need to update the state in response to prop changes
  }

  componentDidMount() {
    if (typeof this.props.spesiecImageList.get(this.props.species_id) !== 'undefined') {
      this.setState({
        images: this.props.spesiecImageList.get(this.props.species_id),
      });
    }
  }

  /**
   * @see SpeciesLeft.onClickSP
   */
  onClick() {
    this.props.onClick;
  }

  /**
   * renders a column with nearby observation, 3x icon + number
   * @return {View}
   */
  renderNerbyObservation() {
    if (this.props.noObs) {
      return(
        <Col size = {0.45} style={{marginLeft: 15, marginRight: 0, alignSelf: 'flex-end'}}>
        <Row >
        <Image style={this.props.isAndroidTablet ? AndroidTabletStyles.image : styles.image} source={require('../images/large.png')}/>
        <Text style={this.props.isAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.obsLarge}</Text>
        </Row>
        <Row>
        <Image style={this.props.isAndroidTablet ? AndroidTabletStyles.image : styles.image} source={require('../images/medium.png')}/>
        <Text style={this.props.isAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.obsMedium}</Text>
        </Row>
        <Row>
        <Image style={this.props.isAndroidTablet ? AndroidTabletStyles.image : styles.image} source={require('../images/small.png')}/>
        <Text style={this.props.isAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.obsSmall}</Text>
        </Row>
        </Col>
      );
    }
    return(
      <Col />
    );
  }

  render() {
    return(
        <View >
            <Grid style= {{width: Dimensions.get('window').width}}>
                <Image source ={Platform.OS === 'ios' ? { uri: this.state.images[0]} : { uri: 'file://' + this.state.images[0]}}
                style={this.props.deviceTypeAndroidTablet ? {resizeMode: 'contain', height: 120, width: 120, marginRight: 5,  margin: 5 } : {resizeMode: 'contain', height: 70, width: 70, marginRight: 5, margin: 5 }}
                />
                <Col size = {1} >
                  <Text style={this.props.isAndroidTablet ? AndroidTabletStyles.text1 : styles.text1}>{this.props.latinName}</Text>
                <Text style={this.props.isAndroidTablet ? AndroidTabletStyles.text2 : styles.text2}>{this.props.localName}</Text>
                </Col>
                {this.renderNerbyObservation()}
            </Grid>
        </View>
    );
  }
}

SpesiesElement.defaultProps = {
  species_id: -99,
  latinName: 'testLatin',
  localName: 'TesteLocal',
  obsSmall: 22,
  obsMedium: 245,
  obsLarge: 344,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text1:{
    fontSize: 15,
    margin: 5,
    color: '#000000',
  },
  text2:{
    fontSize: 12,
    marginLeft: 5,
    color: '#000000',
  },
  text3:{
    fontSize: 10,
    margin: 5,
    textAlign: 'center',
    color: '#000000',
  },
  image: {
    width: 20,
    height: 20,
    margin: 3,
  }
});

const AndroidTabletStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text1:{
    fontSize: 30,
    margin: 5,
    color: '#000000',
  },
  text2:{
    fontSize: 23,
    marginLeft: 10,
    color: '#000000',
  },
  text3:{
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
    color: '#000000',
  },
  image: {
    width: 40,
    height: 40,
    margin: 6,
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(SpesiesElement);
