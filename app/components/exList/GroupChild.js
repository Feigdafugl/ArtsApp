import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableHighlight,
  Image
} from 'react-native';
import {Row, Icon} from 'native-base';
import { Actions } from 'react-native-router-flux';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  ...state.key,
  ...state.settings,
  ...state.nav,
});

class GroupChild extends Component {

  /**
   * state:
   * - isActive= the value can be disabled.
   * @param {[type]} props [description]
   */
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isActive: props.spValues.indexOf(props.id) !== -1,
    };
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

  componentWillReceiveProps(nextProps) {
    if (!this.arraysIdentical(this.props.spValues, nextProps.spValues) && !nextProps.speciesLeftLoading) {
      this.setState({isActive: nextProps.spValues.indexOf(nextProps.id) !== -1});
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.speciesLeftLoading) {
      return false;
    }
    return  nextProps.scene.name === 'Key';
  };

  componentDidMount() {
    if (typeof this.props.valueImages.get(this.props.id) !== 'undefined') {
      this.setState({
        images: this.props.valueImages.get(this.props.id),
      });
    }
  }

  onClick = () => {
    if (this.state.isActive || this.props.chosenValues.length === 0 || this.props.selected) {
      if(this.props.isSelected) {
        this.props.onClick(this.props.id);
      }
      else if (!this.props.disabled ) {
        this.props.onClick(this.props.id);
      }
    }

  }

  /**
   * sends the user to the ValueInfo page
   * @return {void}
   */
  longclick = () => {
    Actions.ValueInfo({valueInfo: this.props.valueInfo, title:this.props.text, images:this.state.images});
  }

  render() {
    return (
        <TouchableHighlight
          delayLongPress={500}
          onPress ={this.onClick}
          style={ this.props.isSelected ? (this.state.isActive || this.props.chosenValues.length === 0 || this.props.selected ? styles.selected : styles.inActiv) : (this.state.isActive || this.props.chosenValues.length === 0 || this.props.selected ? styles.unSelected : styles.inActiv)}
          underlayColor = {this.state.isActive ? '#dedede' : 'rgba(255, 255, 255, 0)'}
          onLongPress ={this.longclick}
        >
          <Row
            style={{ height: (this.props.deviceTypeAndroidTablet ? 110 : 60),alignItems: 'center',}}>
            <Image source={Platform.OS === 'ios' ? { uri: this.state.images[0]} : { uri: 'file://' + this.state.images[0]}}
            style={this.props.deviceTypeAndroidTablet ? {resizeMode: 'contain', height: 100, width: 100, marginRight: 5,  margin: 5, opacity: this.props.disabled ? 0.3 : 1 } : {resizeMode: 'contain', height: 50, width: 50, marginRight: 5, margin: 5, opacity: this.props.disabled ? 0.3 : 1 }} />
            <Text
              numberOfLines = {3}
              ellipsizeMode = "tail"
              style = {this.props.disabled ? {color: '#a4a4a4', marginRight: 10, fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15), width: Dimensions.get('window').width - (this.props.deviceTypeAndroidTablet ? 180 : 130)}
               : {fontSize: (this.props.deviceTypeAndroidTablet ? 30 : 15), marginRight: 10, width: Dimensions.get('window').width - (this.props.deviceTypeAndroidTablet ? 180 : 130)}}>{this.props.text}
             </Text>
             {this.state.isActive || this.props.chosenValues.length !== 0 && !this.props.selected && <Icon style={{backgroundColor: 'rgba(255, 255, 255, 0)', fontSize: 20, color: 'red', margin: -10 }} name='md-close-circle'/>}
          </Row>
      </TouchableHighlight>
    );
  }
}

GroupChild.defaultProps = {
  text: 'notext',
  id: -1,
  image: '',
};


const styles = StyleSheet.create({
  selected: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#FFEDCC',
    borderWidth: 1,
    borderColor: '#9a9a9a',
  },
  unSelected: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#F5FCFF',
    borderWidth: 1,
    borderColor: '#9a9a9a',
  },
  inActiv: {
    flex: 1,
    opacity: 0.5,
    marginTop: 2,
    backgroundColor: 'rgba(139, 139, 139, 0.23)',
    borderWidth: 1,
    borderColor: '#9a9a9a',
  },
});


export default connect(mapStateToProps)(GroupChild);
