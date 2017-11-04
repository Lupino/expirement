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
    if (!query || !query.query) {
      return {};
    }
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
    const total_hits = this.props.total_hits || 0;
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SearchField hintText='关键词' onSearch={this.handleSearch.bind(this)} className="search" />
          {total_hits === 0 ? <p> 没有找到结果 </p> : <p> 找到 {total_hits} 个结果 </p>}
          {hits.map(this.renderHit.bind(this))}
        </div>
        <style>{`
          .search {
            width: 600px;
          }
        `}</style>
      </Layout>
    )
  }
});
