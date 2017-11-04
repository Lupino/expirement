import React, { PureComponent } from 'react';
import Layout from '../components/Layout';
import wapperApp from '../components/wapperApp';


export default wapperApp(class Index extends PureComponent {
  render() {
    return (
      <Layout>
        <h1> Hi there! </h1>
      </Layout>
    )
  }
});
