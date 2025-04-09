import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

export let options = {
  vus: 3,
  iterations: 3,
};

// Load query param data from file
const payloads = new SharedArray('Payloads', function () {
  return JSON.parse(open('./payloads.json'));
});

export default function () {
  const index = (__VU - 1) % payloads.length;  // __VU is 1-based

  const data = payloads[index];

  // Dynamically build URL with query parameters
  const url = `https://jsonplaceholder.typicode.com/posts?sysID=${data.sysID}&prodID=${data.prodID}`;

  // This can be extended as needed — sample payload
  const payload = JSON.stringify({
    title: `title-${data.sysID}`,
    body: `body-${data.prodID}`,
    userId: data.sysID,  // using sysID as userId here for illustration
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

  console.log(`URL: ${url}`);
  console.log(res.body);
}


//K6_TLS_CERT=client-cert.pem \
//K6_TLS_KEY=client-key.pem \
//k6 run script.js
