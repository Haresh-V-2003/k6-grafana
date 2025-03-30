import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 20 }, // Ramp-up to 20 users over 10 seconds
    { duration: '10s', target: 200 }, // Spike to 200 users over 10 seconds
    { duration: '10s', target: 20 }, // Ramp-down to 20 users over 10 seconds
    { duration: '30s', target: 0 },  // Ramp-down to 0 users over 30 seconds
  ],
  thresholds: {
    http_req_failed: ['rate<0.00'],
    http_req_duration: ['p(100)<2000'],
  },
};

export default function () {
  let res = http.get('https://httpbin.org/get');
  check(res, {
    'status was 200': (r) => r.status == 200,
  });
  sleep(1);
}
