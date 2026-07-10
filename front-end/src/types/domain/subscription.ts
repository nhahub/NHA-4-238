export type Subscription = {
  id: number;
  memberName: string;
  email: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
  paid: number;
};

export type SubscriptionDto = {
  id: number;
  memberName?: string;
  email?: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
  paid: number;
};