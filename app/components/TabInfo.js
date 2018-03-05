/**
 * @file TabInfo.js
 * @author Kjetil Fossheim
 *
 * TAB for displaying description text about selected species.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import { Card } from 'native-base';

export default class TabInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      infoText: this.textValidate(),
    };
  }

  /**
   * sees if the selected species has a description text available.
   * @return {String}  description text of species, null if non exists.
   */
  textValidate() {
    if (this.props.info !== null) {
      if (this.props.info.length > 3) {
        return this.props.info;
      }
    }
    return null;
  }

  render() {
    return(
        <Card style = {{padding: (this.props.tablet ? 17 : 8)}}>
          <ScrollView>
              <Text style = {{fontSize: (this.props.tablet ? 30 : 15)}}> {this.state.infoText}
              </Text>
              <View style = {{height: 100}}/>
          </ScrollView>
        </Card>
    );
  }
}
