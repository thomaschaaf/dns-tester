const dns = require('dns');
const util = require('util');
const Timeout = require('await-timeout');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const dnsLoopupAsync = util.promisify(dns.lookup);

const dnsName = process.env.DNS_NAME || 'kubernetes.default.svc.cluster.local';
const dnsTimeout = parseInt(process.env.DNS_NAME_TIMEOUT, 10) || 100;

(async () => {
  const timeout = new Timeout();

  const startDate = +new Date();
  let lookups = 0;
  let failedLookups = 0;

  while(true) {
    try {
      const lookup = await Promise.race([
        dnsLoopupAsync(dnsName),
        timeout.set(dnsTimeout, 'DNS Timeout!')
      ]);

      if (!lookup.address) {
          throw new Error(lookup);
      }

      lookups += 1;
    } catch (err) {
      failedLookups += 1;
      console.error('Lookup failed', err);
    } finally {
      timeout.clear();
    }

    await sleep(10);

    if (lookups % 100 == 0) {
      const time = Math.round((+new Date() - startDate) / 1000);

      console.log(lookups, failedLookups, time + 's', Math.round(lookups / time) + 'lookups / s')
    }
  }
})()
