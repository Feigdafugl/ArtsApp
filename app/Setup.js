
/**
* @file Setup.js
* @author Kjetil Fossheim
 * Function that provides the redux store to the main application and starts AppSetup
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppSetup from './AppSetup';
import configureStore from './lib/configureStore';



function Setup():React.Component {
  class Root extends Component {

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        store: configureStore(),
      };
    }

    render() {
      return (
          <Provider store={this.state.store}>
            <AppSetup/>
          </Provider>

      );
    }
  }

  return Root;
}

export default Setup;
