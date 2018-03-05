/**
 * @file ObservationElement.js
 * @author Kjetil Fossheim
 *
 * list element for user observations in Observation.js
 */


import React, { Component} from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';
import { Content, Grid, Row} from 'native-base';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  ...state.settings,
  ...state.nav,
});

class ObservationElement extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'ObservationElement';
  };

  componentWillReceiveProps(newprops) {
  }

  componentDidMount() {
  }

  render() {
    return(
        <Content>
          <Grid>
            <Row >
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.pecies}</Text>
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.latinName + ' /'}</Text>
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.localName}</Text>
            </Row>
            <Row >
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.date}</Text>
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.obsDateTime}</Text>
            </Row>
            <Row >
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.strings.location}</Text>
            <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.place + ', '}</Text>
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.county + ', '}</Text>
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.latitude + ', '}</Text>
            <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text3 : styles.text3}>{this.props.longitude}</Text>
            </Row>
          </Grid>
        </Content>
    );
  };

}


const styles = StyleSheet.create({
  text3:{
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
    color: '#000000',
  },
});

const AndroidTabletStyles = StyleSheet.create({
  text3:{
    fontSize: 24,
    marginBottom: 5,
    textAlign: 'center',
    color: '#000000',
  },
});

export default connect(mapStateToProps)(ObservationElement);
