import { promiseToCallback, searchSrv } from './utils';

async function search() {
  const searchResult = await searchSrv.search('wenshu', {query: {query: '未签订劳动合同的双倍工资'}});
  console.log(searchResult);
}

promiseToCallback(search)((err) => {
   console.log(err);
   console.log('Finish.');
});
