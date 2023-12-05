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

const arrCategory = [
  '/banners/service-1.svg',
  '/banners/service-6.svg',
  '/banners/service-2.svg',
  '/banners/service-4.svg',
  '/banners/service-3.svg',
  '/banners/service-5.svg',
  '/banners/service-7.svg',
  '/banners/service-9.svg',
  '/banners/service-10.svg'
]

const everythingData = [
  {
    title: 'Stick to your budget',
    subTitle: 'Find the right service for every price point. No hourly rates, just project-based pricing.'
  },
  {
    title: 'Get quality work done quickly',
    subTitle: 'Hand your project over to a talented freelancer in minites, get long-lasting results.'
  },
  {
    title: "Pay when you're happy",
    subTitle: 'Upfront quotes mean no surprises. Payment only get released when you approve.'
  },
  {
    title: 'Count on 24/7 support',
    subTitle: 'Our round-the-clock support team is available to help anytime, anywhere.'
  }
]
const popularServicesData = [
  {
    name: 'AI Artists',
    label: 'Add talent for AI',
    image: '/banners/service1.png'
  },
  {
    name: 'Logo Design',
    label: 'Build your brand',
    image: '/banners/service2.jpeg'
  },
  {
    name: 'Wordpress',
    label: 'Customize your site',
    image: '/banners/service3.jpeg'
  },
  {
    name: 'Voice Over',
    label: 'Share your message',
    image: '/banners/service4.jpeg'
  },
  {
    name: 'Social Media',
    label: 'Reach more customers',
    image: '/banners/service5.jpeg'
  },
  {
    name: 'SEO',
    label: 'Unclock growth online',
    image: '/banners/service6.jpeg'
  },
  {
    name: 'Illustration',
    label: 'Color your dreams',
    image: '/banners/service7.jpeg'
  },
  {
    name: 'Translation',
    label: 'Go global',
    image: '/banners/service8.jpeg'
  }
]

const arrWork = [
  {
    title: '1. Create a Gig',
    content: 'Sign up for free, set up your Gig, and offer your work to our global audience.'
  },
  {
    title: '2. Deliver great work',
    content: 'Get notified when you get an order and use our system to discuss details with customers.'
  },
  {
    title: '3. Get paid',
    content: 'Get paid on time, every time. Payment is available for withdrawal as soon as it clears.'
  }
]

export {
  arrDeliveryTime,
  arrRevisions,
  arrDeliveryTimeFilter,
  arrSortFilter,
  arrCategory,
  everythingData,
  popularServicesData,
  arrWork
}
