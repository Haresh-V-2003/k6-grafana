import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

export let options = {
  vus: 3, // Number of virtual users
  iterations: 3, // Total number of iterations
};

// Load JSON payloads from file
const payloads = new SharedArray('Payloads', function () {
  return JSON.parse(open('./payloads.json'));
});

export default function () {
  const index = __VU % payloads.length;  // simple distribution by VU
  const data = payloads[index];

  const url = 'https://jsonplaceholder.typicode.com/posts';
  const payload = JSON.stringify({
    title: data.title,
    body: data.body,
    userId: data.userId,
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post(url, payload, { headers });

  check(res, {
    'is status 201': (r) => r.status === 201,
    'title is correct': (r) => r.body.includes(`"title": "${data.title}"`),
  });

  console.log(res.body);
}
