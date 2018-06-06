const dns = require('dns');
const util = require('util');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const dnsLoopupAsync = util.promisify(dns.lookup);

(async () => {
  const startDate = +new Date();
  let lookups = 0;
  let failedLookups = 0;

  while(true) {
    try {
      const lookup = await Promise.race([
        dnsLoopupAsync('google.com'),
        sleep(200)
      ]);

      if (!lookup.address) {
          throw new Error('Address missing', lookup);
      }

      lookups += 1;
    } catch (err) {
      failedLookups += 1;
      console.error('Lookup failed', err);
    }
    await sleep(10);

    if (lookups % 100 == 0) {
      const time = Math.round((+new Date() - startDate) / 1000);

      console.log(lookups, failedLookups, time + 's', Math.round(lookups / time) + 'lookups / s')
    }
  }
})()
