// fetch response
const fetch = require("node-fetch");

// get the staking-payouts from localhost
const getUri = (addr, depth) => {

    // return the uri with addr and depth in situe
    return `http://127.0.0.1:8080/accounts/${addr}/staking-payouts?depth=${depth}`
};

// retrieve the payouts
const getPayouts = async (addr, depth) => {
    // retrieve the data for the given addr at depth
    const response = await fetch(getUri(addr, depth));

    // process the response
    const json = await response.json();
    
    // total the pending payouts from erasPayouts
    const pendingPayouts = json.erasPayouts.reduce((carr, eraPayout) => {

        // sum the payouts
        return (carr + eraPayout.payouts.reduce((carr, payout) => {

            // return sum of unclaimed payouts
            return (payout.claimed ? carr : carr + parseInt(payout.nominatorStakingPayout));
         }, 0));
    }, 0);

    return pendingPayouts;
};

// process args and log the payouts
const run = async () => {
    try {
        // retrieve the args from env
        const addr = process.argv[2];
        const depth = process.argv[3];
        // get the payouts for the given addr
        const allPending = await getPayouts(addr, depth);
        // log the response
        console.log(`pending payouts: ${allPending} Planck.`);
    } catch (err) {
        // log the failure
        console.log('query failed: ', err);
    }
};

// run and read the env vars
run()
