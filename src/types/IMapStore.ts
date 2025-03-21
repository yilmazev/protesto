interface ISelectedCity {
  city: string;
  tweetUrls: string[];
}

export interface IMapStore {
  selectedCity: ISelectedCity | null;
  setSelectedCity: (city: ISelectedCity | null) => void;
}