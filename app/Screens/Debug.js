
/**
 * @file deug.js
 * @author Kjetil Fossheim
 *
 * debug-page
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Button,
  ScrollView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import KeyDownload  from '../config/network/KeyDownload';
import RNFetchBlob from 'react-native-fetch-blob';
import DB_helper from '../config/DB/DB_helper';


export default class Debug extends Component {

  constructor(props) {
    super(props);
    this.DB_helper = new DB_helper();
    this.KeyDownload = new KeyDownload();
    this.state = {
      count: 0,
      keyList: null,
      path: '',
      // dataSource: ds.cloneWithRows(this.getContant()),
    };
  }

  componentDidMount() {

  }

  poppulateKeys(callback) {
    this.KeyDownload.getkeyListFromApi().then((value) => {
    });
  }


  onClick(a) {
    switch(a) {
    case 1:
      this.DB_helper.deleteDatabase();
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      this.poppulateKeys((a) =>{
      });
      break;
    case 6:
      this.DB_helper.fethObservationNumbers([{keyWeb: 'sneller', key_id: 1}], 60.380939, 5.331510 )
      .then((h) =>{
      })
      .catch((e) => {
      });
      break;
    case 7:
      this.DB_helper.insertNewObservation({
        latinName: 'Canis lupus',
        localName: 'Ulv, ble du redd nå?',
        order: 'Carnivora',
        family:'Canidae',
        species_id: 5219173,
        latitude: '60.380939',
        longitude: '5.331510 ',
        place: 'Bergen',
        county: 'Hordaland',
        key_id: 1,
        obsDateTime: null,})
        .then(this.DB_helper.getObservations()
          .then((ret) =>{
          }))
        .catch();
      break;
    case 8:
      break;
    case 9:
      break;
    case 10:
      break;
    case 11:
      break;
    case 12:
      break;
    case 13:
      break;
    case 20:
      Actions.pop();
      break;
    }
  }

  render() {
    return(
      <ScrollView style={styles.container}>
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(20)}
                  title= "back"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(1)}
                  title= "delete DB"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(2)}
                  title= "tom"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(3)}
                  title= "tom"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(4)}
                  title= "tom"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(5)}
                  title= "hent nøkler fra nett og legg inn i DB"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(6)}
                  title= "get obs fra nett(sneller)"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(7)}
                  title= "insert and retrive Observation test"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(8)}
                  title= "tom"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(9)}
                  title= "tom"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(10)}
                  title= "tom"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(11)}
                  title= "tom"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(12)}
                  title= "tom"
        />
        <Button
                  style={{fontSize: 20, color: 'green', marginTop: 30}}
                  onPress={() => this.onClick(13)}
                  title= "tom"
        />
      </ScrollView>
    );
  };

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f7f9',
    paddingTop:100
  },
  child: {
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
  }
});
