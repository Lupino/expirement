import {searchSrv, mysql} from './utils';

export function sendJsonResponse(res, err, data={}, errStatus=500) {
  if (err) {
    console.log(err);
    err = err.toString();
    res.status(errStatus).json({err});
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
}
