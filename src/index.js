import mysql from 'mysql';
import eachLimit from 'async/eachLimit';

import { promiseToCallback, callbackToPromise, searchSrv } from './utils';


const docIndex = promiseToCallback(searchSrv.docIndex.bind(searchSrv))

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'wenshu',
  charset  : 'utf8',
});

connection.connect();

const mapping = {
  'default_mapping': {
    'enabled': true,
    'dynamic': true,
    'default_analyzer': 'cjk',
  },
  'type_field': '_type',
  'default_type': '_default',
  'default_analyzer': 'sego',
  'default_datetime_parser': 'dateTimeOptional',
  'default_field': '_all',
  'store_dynamic': true,
  'index_dynamic': true,
  'analysis': {
    'analyzers': {
      'sego': {
        'char_filters': [
          'html',
        ],
        'token_filters': [
          'cjk_bigram',
          'cjk_width',
          'possessive_en',
          'stop_en',
          'to_lower',
        ],
        'tokenizer': 'sego',
        'type': 'custom',
      },
    },
  },
};


function clean_html(content) {
  return content.replace(/<[^>]*>/g, '');
}


function processIndex(callback) {
  function loopIndex(offset) {
    connection.query(`SELECT * FROM wenshu WHERE id > "${offset}" ORDER BY id ASC LIMIT 100`, (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length === 0) {
        return callback();
      }
      console.log('process index offset', offset, 'size:', results.length);
      eachLimit(results, 20, (data, done) => {
        let { id, content, court_name, date, name, number, process, type } = data;
        docIndex('wenshu', data.id, {
          id,
          content: clean_html(content),
          court_name,
          date: Math.floor(new Date(date) / 1000),
          name,
          number,
          process,
          type
        }, done);
      }, (err) => {
        if (err) {
          console.log(err);
        }
        const offset = results[results.length - 1].id;
        loopIndex(offset);

      });
    });
  }
  loopIndex('');
}


async function main() {
  try {
    const ret = await searchSrv.createIndex('wenshu', mapping);
    console.log('createIndex', ret);
  } catch (e) {
    console.log(e);
  }
  await callbackToPromise(processIndex)();
}

promiseToCallback(main)((err) => {
  console.log(err);
  console.log('Finish.');
});
