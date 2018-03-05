/**
 * @file KeyListElement.js
 * @author Kjetil Fossheim
 *
 * List element of the front-page list of available keys.
 */

import React, { Component } from 'react';
import ImageConfig from '../config/nettwork/ImageConfig';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  TouchableHighlight,
} from 'react-native';
import { Icon } from 'native-base';
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


class KeyListElement extends Component {

  /**
   * downloadedVisible = to show or not small cloud symbol.
   */
  constructor(props) {
    super(props);
    this.state = {
      downloadedVisible: (props.downloaded === 0 ? false : true ),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'Frontpage';
  };

  /**
   * Listens for prop updates on if key has been downloaded.
   * @param {Object} newprops received new prop
   * @return {void}
   */
  componentWillReceiveProps(newprops) {
    if (newprops.downloaded !== this.state.downloadedVisible) {
      this.setState({downloadedVisible: (newprops.downloaded === 0 ? false : true)});
    }
  }


  componentDidMount() {
  }

  /**
   * onlcick handler
   * @see Key.onClick
   * @return {void}
   */
  onClick = () => {
    this.props.onClick(this.props.id, this.props.title, this.state.downloadedVisible);
  }

  render() {
    return(
      <TouchableHighlight underlayColor ='rgba(0, 0, 0, 0.05)' style={styles.container} onPress ={this.onClick}>
        <View style = {styles.container}>
          <Image source ={Platform.OS === 'ios' ? { uri: ImageConfig.getkeyThumbs(this.props.id)} : { uri: 'file://' + ImageConfig.getkeyThumbs(this.props.id)}}
          style = {this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.image : styles.image}>
              {this.state.downloadedVisible === false ? <Icon name="md-cloud-download" style = {this.props.deviceTypeAndroidTablet ? {fontSize: 40} : {fontSize: 20}}/> : null }
          </Image>
          <View style = {styles.textCont}>
            <Text style = {this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.text : styles.text}>{this.props.title}</Text>
          {this.props.level && <Text style = {this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.text2 : styles.text2}>{this.props.strings.level + this.props.level}</Text>}
          {this.props.keyAuthor && <Text style = {this.props.deviceTypeAndroidTablet ? stylesAndroidTablet.text2 : styles.text2}>{this.props.strings.author + this.props.keyAuthor}</Text>}
          </View>
          <View>
            <Icon name="ios-arrow-forward"/>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height:70,
    width: 70,
    marginTop: 5,
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  textCont: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  iconCont: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  text:{
    fontSize: 15,
    margin: 5,
    marginBottom: 0,
    textAlign: 'left',
    color: '#000000',
  },
  text2:{
    fontSize: 10,
    margin: 5,
    marginTop: 3,
    textAlign: 'left',
    color: '#000000',
  },
});

const stylesAndroidTablet = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height:140,
    width: 140,
    marginTop: 5,
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  textCont: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  iconCont: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  text:{
    fontSize: 30,
    margin: 5,
    marginBottom: 0,
    textAlign: 'left',
    color: '#000000',
  },
  text2:{
    fontSize: 20,
    margin: 5,
    marginTop: 3,
    textAlign: 'left',
    color: '#000000',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(KeyListElement);
