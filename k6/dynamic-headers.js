import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

export let options = {
  vus: 3,
  iterations: 9,
};

// Load query parameters from payloads.json
const payloads = new SharedArray('Payloads', function () {
  return JSON.parse(open('./payloads.json'));
});

// Load POST body content from headerss.json
const headersInput = new SharedArray('Header', function () {
  return JSON.parse(open('./headerss.json'));
});

export default function () {
  const index = __ITER % payloads.length;
  const data = payloads[index];

  const headerIndex = __ITER % headersInput.length;
  const headerData = headersInput[headerIndex];

  const url = `https://jsonplaceholder.typicode.com/posts?sysID=${data.sysID}&prodID=${data.prodID}`;

  // ✅ Dynamically build POST body using headerss.json data
  const payload = JSON.stringify({
    data1: headerData.Data1,
    data2: headerData.Data2
  });

  const headers = {
    'Content-Type': 'application/json',
    'x-sys-id': `${data.sysID}`,
    'x-prod-id': `${data.prodID}`
  };

  const res = http.post(url, payload, { headers });

  check(res, {
    'status is 201': (r) => r.status === 201,
    'body contains data1': (r) => r.body.includes(headerData.Data1),
    'body contains data2': (r) => r.body.includes(headerData.Data2)
  });

  console.log(`URL: ${url}`);
  console.log(`Payload: ${payload}`);
}
