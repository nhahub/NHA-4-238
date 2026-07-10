export type Sport = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

export type AddSportDto = {
  name: string;
  description: string;
  image: File;
};

export type UpdateSportDto = {
  name: string;
  description: string;
  image?: File;
};