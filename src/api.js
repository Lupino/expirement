import {searchSrv, mysql, promiseToCallback} from './utils';

export function sendJsonResponse(res, err, data={}, errStatus=500) {
  if (err) {
    if (typeof err === 'string') {
      res.status(errStatus).json({err});
    } else if (err instanceof Error) {
      res.status(errStatus).json({err: err.message});
    } else {
      res.status(errStatus).json({err: 'Unknow'});
    }
  } else {
    if (Array.isArray(data)) {
      if (data.length === 1) {
        return res.json(data[0]);
      }
    }
    res.json(data);
  }
}

export function route(app) {
  app.get('/api/document/:docid', (req, res) => {
    mysql.query(`SELECT * FROM wenshu WHERE id = "${req.params.docid}"`, (err, results) => {
      if (results.length === 0) {
        sendJsonResponse(res, "Document not found", {}, 404);
        return;
      }
      sendJsonResponse(res, err, results);
    });
  });
  app.get('/api/search/', (req, res) => {
    const query = req.query;
    const highlight = {fields: ['content']};
    promiseToCallback(searchSrv.search.bind(searchSrv))('wenshu', {query, highlight}, (err, ret={hits: []}) => {
      const hits = ret.hits.map((hit) => {
        return {
          id: hit.id,
          content: hit.fragments.content.join(' '),
          score: hit.score,
        }
      })
      sendJsonResponse(res, err, { total_hits: ret.total_hits, hits });
    })
  });
}
