export interface ITurkeyMap {
  tweetCities: string[];
  selectedCity: string;
  onClick: (cityName: string) => void;
}