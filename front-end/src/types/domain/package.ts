export type PackageOption = {
  id: number;
  title: string;
  description: string;
  price: number;
  numberOfMonthes: number;
  numberOfSessions: number;
  planId: number;
  planTitle: string;
  sport?: string | null;
};

export type AddUpdatePackageDto = {
  title: string;
  description: string;
  price: number;
  numberOfMonthes: number;
  numberOfSessions: number;
  planId: number | null;
};