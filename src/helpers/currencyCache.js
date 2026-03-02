let companyCurrencyIdCache = null;
let currenciesCache = null;
const inflight = {};

async function once(key, fetcher) {
  if (!inflight[key]) {
    inflight[key] = (async () => {
      try {
        return await fetcher();
      } finally {
        delete inflight[key];
      }
    })();
  }
  return inflight[key];
}

export async function getCompanyCurrencyId(apiRequest) {
  if (companyCurrencyIdCache) return companyCurrencyIdCache;
  const data = await once('company', () => apiRequest('GET', '/companyProfile'));
  companyCurrencyIdCache = data?.currency || null;
  return companyCurrencyIdCache;
}

export async function getCurrencies(apiRequest) {
  if (currenciesCache) return currenciesCache;
  const list = await once('currencies', () => apiRequest('GET', '/currencies/active', {}, {}));
  currenciesCache = Array.isArray(list) ? list : [];
  return currenciesCache;
}

export async function getCurrencyCodeById(apiRequest, id) {
  if (!id) return '';
  const list = await getCurrencies(apiRequest);
  return (list.find((c) => c._id === id)?.code) || '';
}

export async function getBuyingRateById(apiRequest, id) {
  if (!id) return '';
  const list = await getCurrencies(apiRequest);
  const cur = list.find((c) => c._id === id);
  return cur ? Number(cur.buying_rate).toFixed(2) : '';
}

export function __resetCurrencyCacheForTests() {
  companyCurrencyIdCache = null;
  currenciesCache = null;
}


