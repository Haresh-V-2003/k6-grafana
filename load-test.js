import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 50 }, // Ramp-up to 50 users over 10 seconds
    { duration: '30s', target: 50 },  // Stay at 50 users for 30 seconds
    { duration: '10s', target: 0 },  // Ramp-down to 0 users over 10 seconds
  ],
  thresholds: {
    http_req_failed: ['rate<0.00'],
    http_req_duration: ['p(100)<2000'],
  },
  ext: {
    loadimpact: {
      projectID: __ENV.K6_PROJECT_ID, // Replace with your Grafana Cloud project ID
      token: __ENV.K6_API_TOKEN, // Replace with your Grafana Cloud API token
    },
  },
};

export default function () {
  let res = http.get('https://httpbin.org/get');
  check(res, {
    'status was 200': (r) => r.status == 200,
  });
  sleep(1);
}
