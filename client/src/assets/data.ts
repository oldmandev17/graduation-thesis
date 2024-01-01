import { GigStatus } from 'modules/gig'
import { OrderStatus } from 'modules/order'

export enum SortFilter {
  BEST_SELLING = 'BEST_SELLING',
  LATEST = 'LATEST',
  PRICE_DESCENDING = 'PRICE_DESCENDING',
  PRICE_ASCENDING = 'PRICE_ASCENDING'
}

const arrDeliveryTime = [
  {
    label: '1 DAYS DELIVERY',
    value: 1
  },
  {
    label: '2 DAYS DELIVERY',
    value: 2
  },
  {
    label: '3 DAYS DELIVERY',
    value: 3
  },
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
    value: -1
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
    name: 'Font & Typography',
    label: 'Add talent for design',
    image: '/banners/service1.png',
    slug: 'font-and-typography'
  },
  {
    name: 'Logo Design',
    label: 'Build your brand',
    image: '/banners/service2.jpeg',
    slug: 'logo-design'
  },
  {
    name: 'Website Development',
    label: 'Customize your site',
    image: '/banners/service3.jpeg',
    slug: 'website-development'
  },
  {
    name: 'Voice Over',
    label: 'Share your message',
    image: '/banners/service4.jpeg',
    slug: 'voice-over'
  },
  {
    name: 'Social Media',
    label: 'Reach more customers',
    image: '/banners/service5.jpeg',
    slug: 'social-media-videos'
  },
  {
    name: 'SEO',
    label: 'Unclock growth online',
    image: '/banners/service6.jpeg',
    slug: 'search-engine-optimization-(seo)'
  },
  {
    name: 'Business Plans',
    label: 'Color your dreams',
    image: '/banners/service7.jpeg',
    slug: 'business-plans'
  },
  {
    name: 'Writing Advice',
    label: 'Go global',
    image: '/banners/service8.jpeg',
    slug: 'writing-advice'
  }
]

const arrQA = [
  {
    question: 'What can I sell?',
    answer:
      "Be creative! You can offer any service you wish as long as it's legal and complies with our terms. There are over 200 categories you can browse to get ideas."
  },
  {
    question: 'How much time will I need to invest?',
    answer:
      "It's very flexible. You need to put in some time and effort in the beginning to learn the marketplace and then you can decide for yourself what amount of work you want to do."
  },
  {
    question: 'How much money can I make?',
    answer:
      "It's totally up to you. You can work as much as you want. Many sellers work on Fiverr full time and some keep their 9-5 job while using Fiverr to make extra money."
  },
  {
    question: 'How do I price my service?',
    answer:
      'With Gig Packages, you set your pricing anywhere from $5 - $995 and offer three versions of your service at three different prices.'
  },
  {
    question: 'How much does it cost',
    answer:
      "It's free to join Fiverr. There is no subscription required or fees to list your services. You keep 80% of each transaction."
  },
  {
    question: 'How do I get paid?',
    answer:
      "Once you complete a buyer's order, the money is transferred to your account. No need to chase clients for payments and wait 60 or 90 days for a check."
  }
]

const arrStory = [
  {
    content: '"People love our logo, and we love Fiverr."',
    author: 'Jennifer Gore, CEO of Weleet'
  },
  {
    content: '"Fiverr is an amazing resource for anyone in the startup space."',
    author: 'Adam Mashaal, CEO of Mashfeed'
  },
  {
    content: '"There is no way I could have produced anything without Fiverr."',
    author: 'Christopher Sunami, Music Producer'
  },
  {
    content: '"Fiverr enables me to quickly, efficiently and cost-effectively get things done."',
    author: 'Cristina Dolan, Entrepreneur'
  }
]

const arrGigStatus = [
  {
    label: 'ACTIVE',
    value: GigStatus.ACTIVE
  },
  {
    label: 'INACTIVE',
    value: GigStatus.INACTIVE
  },
  {
    label: 'BANNED',
    value: GigStatus.BANNED
  },
  {
    label: 'WAITING',
    value: GigStatus.WAITING
  },
  {
    label: 'NONE',
    value: GigStatus.NONE
  }
]

const arrOrderStatus = [
  {
    label: 'PENDING',
    value: OrderStatus.PENDING
  },
  {
    label: 'PAID',
    value: OrderStatus.PAID
  },
  {
    label: 'CANCEL',
    value: OrderStatus.CANCEL
  },
  {
    label: 'ACCEPT',
    value: OrderStatus.ACCEPT
  },
  {
    label: 'BUYER COMFIRM',
    value: OrderStatus.BUYER_CONFIRM
  },
  {
    label: 'SELLER COMFIRM',
    value: OrderStatus.SELLER_CONFIRM
  },
  {
    label: 'COMPLETE',
    value: OrderStatus.COMPLETE
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
  arrQA,
  arrStory,
  arrGigStatus,
  arrOrderStatus
}
