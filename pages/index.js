import React, { PureComponent } from 'react';
import Layout from '../components/Layout';
import Pagenav from '../components/Pagenav';
import wapperApp from '../components/wapperApp';
import { fetchJSON, getUrl } from '../components/utils';
import SearchField from '../components/SearchField';

import {Card, CardTitle, CardText} from 'material-ui/Card';

import renderHTML from 'react-render-html';

import Router from 'next/router';

async function search(query) {
  const url = getUrl('/api/search/', query);
  return fetchJSON(url)
}

export default wapperApp(class Index extends PureComponent {
  static async getInitialProps({ query, ...ctx }) {
    if (!query || !query.query) {
      return {};
    }
    const result = await search(query);
    return {...query, ...result};
  }
  handleDetail(hit) {
    Router.push({
      pathname: '/document',
      query: { id: hit.id }
    })
  }
  renderHit(hit) {
    return (
      <Card key={hit.id} style={{width: 600, marginBottom: 10}} >
        <CardTitle title={hit.name} style={{cursor: 'pointer'}} onClick={this.handleDetail.bind(this, hit)} />
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
  handlePage(from) {
    const { size, query } = this.props;
    Router.push({
      pathname: '/',
      query: { query, from, size },
    })
    window.scroll(0, 0);
  }
  render() {
    const hits = this.props.hits || [];
    const total_hits = this.props.total_hits || 0;
    const size = this.props.size || 10;
    const from = this.props.from || 0;
    return (
      <Layout>
        <SearchField hintText='关键词' onSearch={this.handleSearch.bind(this)} className="search" />
        {total_hits === 0 ? <p> 没有找到结果 </p> : <p> 找到 {total_hits} 个结果 </p>}
        {hits.map(this.renderHit.bind(this))}
        <Pagenav total={total_hits} from={from} size={size} onClick={this.handlePage.bind(this)} />
        <style>{`
          .search {
            width: 600px;
          }
        `}</style>
      </Layout>
    )
  }
});
