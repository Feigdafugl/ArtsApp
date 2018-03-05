/**
 * @file SpeciesImageViewer.js
 * @author Kjetil Fossheim
 *
 * ImageViewer for species images.
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { StyleProvider, Container, Header,Body, Left, Right, Title, Content,Button, Icon} from 'native-base';
import Toast, {DURATION} from 'react-native-easy-toast';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Actions } from 'react-native-router-flux';

// redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

// theme
import getTheme from '../native-base-theme/components';
import common from '../native-base-theme/variables/commonColor';
import androidTablet from '../native-base-theme/variables/androidTablet';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height - 70 ;

const mapStateToProps = (state) => ({
  ...state.key,
  ...state.settings,
  ...state.nav,
});

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ }, dispatch)
  };
}


class SpeciesImageViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  nextProps.scene.name === 'SpeciesImageViewer';
  };

/**
 * sets the url for the images in the right format.
 * @return {void}
 */
  componentWillMount() {
    this.setState({
      images: this.props.spImage.map((item, i) => {
        if (this.props.platform === 'ios') {
          return { url: item};
        }
        return { url: 'file://' + item};
      }),
    });
  };

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  onClickBack = () => {
    Actions.pop();
  }

  render() {
    return (
      <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
      <Container>
        <View style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={this.onClickBack}>
                <Icon name='ios-arrow-back-outline'/>
              </Button>
            </Left>
            <Body style={{flex: 3}}>
              <Title>{this.props.strings.image}</Title>
            </Body>
            <Right/>
          </Header>
          <Content ref = "cont" scrollEnabled ={false}>
            <View style={styles.container}>
              <ImageViewer style={styles.container} imageUrls = {this.state.images} />
            </View>
          </Content>
        </View>
      </Container>
    </StyleProvider>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 150,
    height: 150,
    margin: 20,
    padding: 20,
  },
  separator: {
    height: 20,
    backgroundColor: 'grey',
  },
  keyText: {
    fontStyle: 'italic',
    color: '#6b6b6b',
  },
  text1:{
    fontSize: 15,
    margin: 10,
    textAlign: 'center',
    color: '#000000',
  },
  text2:{
    fontSize: 10,
    margin: -7,
    textAlign: 'center',
    color: '#000000',
  },
  overlay:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(SpeciesImageViewer);
