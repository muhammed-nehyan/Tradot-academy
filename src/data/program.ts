// Single source of truth for the program. Facts come from the client's poster.
// Items marked TODO(client) are drafts that need his confirmation.

export const program = {
  name: 'Stock Market Trading Program',
  level: 'Basic to Advance Level',
  fee: 16500,
  feeDisplay: '₹16,500',
  durationDays: 25,
  durationDisplay: '25 days',
  modes: ['Online', 'Offline at Kalamassery'],
  // TODO(client): next batch date.
  nextBatch: null as string | null,
};

export type Module = {
  title: string;
  summary: string;
  /** TODO(client): confirm day ranges and topics. */
  days: string;
  topics: string[];
};

export const modules: Module[] = [
  {
    title: 'Trading Basics',
    summary: 'Understand the market from the ground up.',
    days: 'Days 1–4',
    topics: [
      'How the stock market and exchanges work',
      'Shares, indices, brokers and demat accounts',
      'Order types and how a trade is placed',
      'Common trading styles and timeframes',
    ],
  },
  {
    title: 'Analysis & Chart Reading',
    summary: 'How charts work and what drives the market.',
    days: 'Days 5–9',
    topics: [
      'Reading candlestick charts',
      'Trends, support and resistance',
      'Volume and what it tells you',
      'News, events and market sentiment',
    ],
  },
  {
    title: 'Technical Analysis',
    summary: 'Read charts and find high-probability setups.',
    days: 'Days 10–16',
    topics: [
      'Chart and candlestick patterns',
      'Moving averages and key indicators',
      'Entries, exits and confirmation',
      'Building and back-testing a setup',
    ],
  },
  {
    title: 'Risk Management',
    summary: 'Protect capital, trade with confidence.',
    days: 'Days 17–21',
    topics: [
      'Position sizing and risk per trade',
      'Stop-losses and targets',
      'Risk-reward and drawdowns',
      'Writing your own trading plan',
    ],
  },
  {
    title: 'Trading Psychology',
    summary: 'Build the mindset to be a consistent trader.',
    days: 'Days 22–25',
    topics: [
      'Fear, greed and overtrading',
      'Discipline and following your rules',
      'Keeping a trading journal',
      'Reviewing trades and improving',
    ],
  },
];

export const highlights = [
  'Live sessions from day 1',
  'Expert mentorship',
  'Online and offline batches',
  'Basic to advance level',
];

export const audience = [
  {
    title: 'Complete beginners',
    text: 'Never traded before? The program starts from how the market works, so no prior knowledge is needed.',
  },
  {
    title: 'Self-taught traders',
    text: 'Learned from videos and tips but not getting consistent? Replace guesswork with a tested process.',
  },
  {
    title: 'Working professionals',
    text: 'Want to understand the market alongside your job? Choose the online or offline batch that suits you.',
  },
  {
    title: 'Students',
    text: 'Build a strong foundation in markets, analysis and risk early, before putting money at stake.',
  },
];

export const faqs = [
  {
    q: 'What is the course fee?',
    a: `The full program costs ${program.feeDisplay}.`,
  },
  {
    q: 'How long is the program?',
    a: 'The program runs for 25 days and covers five modules, from trading basics to trading psychology.',
  },
  {
    q: 'Do I need any prior experience?',
    a: 'No. The program goes from basic to advance level, so complete beginners are welcome.',
  },
  {
    q: 'Are classes online or offline?',
    a: 'Both. You can join an offline batch at our Kalamassery centre in Kochi or attend the live online batch from anywhere.',
  },
  {
    q: 'When do live sessions start?',
    a: 'Live sessions start from day 1, with expert mentorship throughout the program.',
  },
  {
    q: 'Do you give stock tips or guarantee returns?',
    a: 'No. Tradot Academy provides stock market education only. We do not offer investment advice, tips or guaranteed returns.',
  },
  {
    q: 'How do I register?',
    a: 'Message us on WhatsApp at +91 96458 86344 or use the form on the contact page, and we will share the next batch details.',
  },
];
