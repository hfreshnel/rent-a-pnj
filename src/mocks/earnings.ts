// ──────────────────────────────────────
// Earnings summary
// ──────────────────────────────────────

export interface MockEarningsSummary {
  available: number;
  pending: number;
  totalEarned: number;
  thisMonth: number;
  lastMonth: number;
  bookingsThisMonth: number;
}

export const MOCK_EARNINGS_SUMMARY: MockEarningsSummary = {
  available: 320,
  pending: 130,
  totalEarned: 1250,
  thisMonth: 450,
  lastMonth: 380,
  bookingsThisMonth: 12,
};

// ──────────────────────────────────────
// Transactions
// ──────────────────────────────────────

export interface MockTransaction {
  id: string;
  type: 'earning' | 'payout';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: '1',
    type: 'earning',
    amount: 50,
    description: 'Randonnée avec Marie',
    date: '24 Jan',
    status: 'completed',
  },
  {
    id: '2',
    type: 'earning',
    amount: 75,
    description: 'Escalade avec Thomas',
    date: '22 Jan',
    status: 'completed',
  },
  {
    id: '3',
    type: 'payout',
    amount: -200,
    description: 'Virement vers FR76 **** 4521',
    date: '20 Jan',
    status: 'completed',
  },
  {
    id: '4',
    type: 'earning',
    amount: 100,
    description: 'VTT avec Lucas',
    date: '18 Jan',
    status: 'completed',
  },
  {
    id: '5',
    type: 'earning',
    amount: 50,
    description: 'Course avec Emma',
    date: '15 Jan',
    status: 'pending',
  },
];
