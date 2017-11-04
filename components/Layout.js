import React, { Component } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

export default class Layout extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
  }
  render() {
    const { children, title = '文书', muiTheme } = this.props;
    return (
      <div>
        <Head>
          <title>{title}</title>
          <meta name="description" content="" />
          <meta name="author" content="Li Meng Jun" />
          <meta name="HandheldFriendly" content="True" />
          <meta httpEquiv="cleartype" content="on" />
          <style>{'body { margin: 0 }'}</style>
        </Head>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {children}
        </div>
      </div>
    );
  }
}
