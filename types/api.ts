type Breed = string;
type SubBreed = string;
type DogImgUrl = string;

export type GetDogsResponse = {
  message: DogImgUrl[];
  status: string;
};

export type GetAllBreedsResponse = {
  message: Record<Breed, SubBreed[]>;
  status: string;
};

export type GetSampleResponse = DogImgUrl;
