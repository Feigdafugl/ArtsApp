/**
 * @file TabDistribution.js
 * @author Kjetil Fossheim
 *
 * TAB for the Species.js page, displaying distribution maps of the selected species if available.
 */
import React, { Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { Card} from 'native-base';


// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => ({
  ...state.settings,
  ...state.nav,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({}, dispatch)
  };
}


class TabDistribution extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      noDistrubution: false,
    };
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'Species';
  };

  componentWillMount() {
    if (this.props.distributionLocal === null || typeof this.props.distributionLocal === 'undefined') {
      this.setState({noDistrubution: true});
    }
  }

  componentWillUnmount() {
  }

  render() {
    return(
        <Card >
          {this.props.isConnected ? <ScrollView>
            {!this.state.noDistrubution ?
              <View>
                <Image
                  source={{uri: this.props.distributionCountry + '&lon=' + this.props.longitude + '&lat=' + this.props.latitude}}
                  style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.image : styles.image}/>
                  <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text : styles.text}>{this.props.strings.nationalDistrubution + this.state.latitude}</Text>
                <Image
                  source={{uri: this.props.distributionLocal + '&lon=' + this.props.longitude + '&lat=' + this.props.latitude}}
                  style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.image : styles.image}/>
                  <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text : styles.text}>{this.props.strings.regonalDistrubution}</Text>
                <View style = {{height: (this.props.deviceTypeAndroidTablet ? 100 : 50)}}/>
              </View> :
              <Text style={this.props.deviceTypeAndroidTablet ? AndroidTabletStyles.text : styles.text}>{this.props.strings.noDistrubution}</Text>
            }
        </ScrollView> : <Text style={{margin: 10, textAlign: 'center'}}>{this.props.strings.disNoNetwork}</Text>}
        </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    borderWidth: 1,
    borderColor: 'black',
    width: 340,
    height: 300,
    margin: 10,
    marginTop: 10,
    marginBottom: 0,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  text: {
    borderWidth: 1,
    borderColor: 'black',
    width: 340,
    marginTop: 0,
    marginBottom: 20,
    padding: 5,
    alignSelf: 'center'
  }
});

const AndroidTabletStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    borderWidth: 2,
    borderColor: 'black',
    width: 680,
    height: 600,
    margin: 20,
    marginTop: 20,
    marginBottom: 0,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  text: {
    borderWidth: 1,
    borderColor: 'black',
    width: 680,
    marginTop: 0,
    marginBottom: 30,
    padding: 10,
    fontSize: 30,
    alignSelf: 'center'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TabDistribution);
