export enum SortFilter {
  BEST_SELLING = 'BEST_SELLING',
  LATEST = 'LATEST',
  PRICE_DESCENDING = 'PRICE_DESCENDING',
  PRICE_ASCENDING = 'PRICE_ASCENDING'
}

const arrDeliveryTime = [
  {
    label: '5 DAYS DELIVERY',
    value: 5
  },
  {
    label: '10 DAYS DELIVERY',
    value: 10
  },
  {
    label: '15 DAYS DELIVERY',
    value: 15
  },
  {
    label: '20 DAYS DELIVERY',
    value: 20
  },
  {
    label: '25 DAYS DELIVERY',
    value: 25
  },
  {
    label: '30 DAYS DELIVERY',
    value: 30
  }
]

const arrRevisions = [
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  },
  {
    label: '5',
    value: 5
  },
  {
    label: '10',
    value: 10
  },
  {
    label: 'Unlimited',
    value: 999
  }
]

const arrDeliveryTimeFilter = [
  {
    label: 'Express 24h',
    value: 1
  },
  {
    label: 'Up to 3 days',
    value: 3
  },
  {
    label: 'Up to 7 days',
    value: 7
  },
  {
    label: 'Anytime',
    value: null
  }
]

const arrSortFilter = [
  {
    label: 'Best Selling',
    value: SortFilter.BEST_SELLING
  },
  {
    label: 'Latest',
    value: SortFilter.LATEST
  },
  {
    label: 'Price: High to low',
    value: SortFilter.PRICE_DESCENDING
  },
  {
    label: 'Price: Low to high',
    value: SortFilter.PRICE_ASCENDING
  }
]

export { arrDeliveryTime, arrRevisions, arrDeliveryTimeFilter, arrSortFilter }
