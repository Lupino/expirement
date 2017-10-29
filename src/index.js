import mysql from 'mysql';
import { SearchService } from 'yuntan-service';

const searchSrv = new SearchService({
  host: 'https://gw.huabot.com',
  secret: 'abfbc25c8ea2969a4f4dac8f0b161d274847554508b87ed182551627e9749fc0',
  key: 'a54ec9e66bca54fc31a1',
  secure: true
});

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'wenshu',
  charset  : 'utf8',
});

connection.connect();

// connection.query('SELECT id FROM wenshu where id < "ffffd1c4-a352-4fe3-8b48-c654a3cb7cbb" order by id desc limit 1,2', (error, results, fields) => {
//   if (error) throw error;
//   console.log('The solution is: ', results);
//   for (let data of results) {
//     console.log(data.id)
//   }
// });
//
// connection.end();

export function promiseToCallback(promiseFunction) {
  return (...argv) => {
    const callback = argv.pop();
    promiseFunction(...argv)
      .then((...ret) => callback(null, ...ret))
      .catch((err) => callback(err));
  };
}

export function callbackToPromise(callbackFunction) {
  return (...argv) => {
    return new Promise((resolve, reject) => {
      callbackFunction(...argv, (err, ...ret) => {
        if (err) return reject(err);
        resolve(...ret);
      });
    });
  };
}

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
      promiseToCallback(async () => {
        for (let data of results) {
          let { id, content, court_name, date, name, number, process, type } = data;
          await searchSrv.docIndex('wenshu', data.id, {
            id,
            content,
            court_name,
            date: Math.floor(new Date(date) / 1000),
            name,
            number,
            process,
            type
          });
        }
      })((err) => {
        if (err) {
          console.log(err);
        }
        const offset = results[results.length - 1].id;
        loopIndex(offset);
      })
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
