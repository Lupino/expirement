import React, { PureComponent } from 'react';
import Layout from '../components/Layout';
import wapperApp from '../components/wapperApp';
import { fetchJSON, getUrl } from '../components/utils';
import SearchField from '../components/SearchField';

import {Card, CardTitle, CardText} from 'material-ui/Card';

import renderHTML from 'react-render-html';

import Router from 'next/router';

async function search(query) {
  const url = getUrl('/api/search', {query});
  return fetchJSON(url)
}


export default wapperApp(class Index extends PureComponent {
  static async getInitialProps({ query, ...ctx }) {
    const result = await search(query.query);
    return result;
  }
  renderHit(hit) {
    return (
      <Card key={hit.id} style={{width: 600, marginBottom: 10}}>
        <CardTitle title={hit.name} />
        <CardText>
          {renderHTML(hit.content)}
        </CardText>
      </Card>
    )
  }
  handleSearch(query) {
    Router.push({
      pathname: '/',
      query: { query },
    })
  }
  render() {
    const hits = this.props.hits || [];
    return (
      <Layout>
        <SearchField hintText='关键词' onSearch={this.handleSearch.bind(this)} />
        {hits.length === 0 && <p> 没有找到结果 </p>}
        {hits.map(this.renderHit.bind(this))}
      </Layout>
    )
  }
});
