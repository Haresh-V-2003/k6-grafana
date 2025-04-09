import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

export let options = {
  vus: 3,
  iterations: 9,
};

const payloads = new SharedArray('Payloads', function () {
  return JSON.parse(open('./payloads.json'));
});

export default function () {
  const index = __ITER % payloads.length;
  const data = payloads[index];

  const url = `https://jsonplaceholder.typicode.com/posts?sysID=${data.sysID}&prodID=${data.prodID}`;

  const payload = JSON.stringify({
    title: `title-${data.sysID}`,
    body: `body-${data.prodID}`,
    userId: data.sysID
  });

  const headers = {
    'Content-Type': 'application/json',
    'x-sys-id': `${data.sysID}`,
    'x-prod-id': `${data.prodID}`
  };

  const res = http.post(url, payload, { headers });

  check(res, {
    'status is 201': (r) => r.status === 201,
    'title matches': (r) => r.body.includes(`"title": "title-${data.sysID}"`)
  });

  console.log(`Used: sysID=${data.sysID}, prodID=${data.prodID}`);
}


//K6_TLS_CERT=client-cert.pem \
//K6_TLS_KEY=client-key.pem \
//k6 run script.js
