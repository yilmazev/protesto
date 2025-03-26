export interface IMessage {
  id: string;
  username: string;
  message: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}