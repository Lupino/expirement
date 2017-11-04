import React, { cloneElement, Component as ReactComponent } from 'react';
import Router from 'next/router';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {green100, green500, green700} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function getCustemMuiTheme(userAgent) {
  return getMuiTheme({
    palette: {
      primary1Color: green500,
      primary2Color: green700,
      primary3Color: green100,
    },
  }, {
    avatar: {
      borderColor: null,
    },
    userAgent,
  });
}

export default (Component, requireLogin = false) => {
  return class extends ReactComponent {
    static async getInitialProps({ req, res, ...ctx }) {
      let props;
      if (Component.getInitialProps) {
        props = await Component.getInitialProps({ req, res, ...ctx });
      }
      const userAgent = req ? req.headers['user-agent'] : undefined;
      return { ...props, userAgent };
    }
    render() {
      const { children, userAgent, ...props } = this.props;
      const muiTheme = getCustemMuiTheme(userAgent);
      const child = children ? cloneElement(children, props): null;
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <Component {...props}>
            {child}
          </Component>
        </MuiThemeProvider>
      );
    }
  };
};
