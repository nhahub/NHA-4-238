export type Trainer = {
  id: number;
  name: string;
  title: string;
  description: string;
  yearsOfExperience: number;
  sport: string;
  sportId: number;
  imageUrl: string;
};

export type AddTrainerDto = {
  name: string;
  title: string;
  description: string;
  yearsOfExperience: number;
  sportId: number;
  image: File;
};

export type UpdateTrainerDto = {
  name: string;
  title: string;
  description: string;
  yearsOfExperience: number;
  sportId: number;
  image?: File;
};