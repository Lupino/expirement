import React, { PureComponent } from 'react';
import Layout from '../components/Layout';
import wapperApp from '../components/wapperApp';
import { fetchJSON, getUrl } from '../components/utils';
import SearchField from '../components/SearchField';

import {Card, CardTitle, CardText} from 'material-ui/Card';

import renderHTML from 'react-render-html';

import Router from 'next/router';

async function getDocument(id) {
  const url = getUrl('/api/document/' + id);
  return fetchJSON(url)
}

export default wapperApp(class Index extends PureComponent {
  static async getInitialProps({ query, ...ctx }) {
    if (!query || !query.id) {
      return {};
    }
    const result = await getDocument(query.id);
    return {...query, ...result};
  }
  handleSearch(query) {
    Router.push({
      pathname: '/',
      query: { query },
    })
  }
  componentDidMount() {
    window.scroll(0, 0);
  }
  render() {
    const { name, content } = this.props;
    return (
      <Layout>
        <SearchField hintText='关键词' onSearch={this.handleSearch.bind(this)} className="search" />
        <Card style={{width: 600, marginBottom: 10}} >
          <CardTitle title={name} />
          <CardText>
            {renderHTML(content)}
          </CardText>
        </Card>
        <style>{`
          .search {
            width: 600px;
          }
        `}</style>
      </Layout>
    )
  }
});

