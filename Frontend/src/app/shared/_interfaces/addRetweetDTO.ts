import { AddTweetDTO } from "./addTweetDTO";

export interface AddRetweetDTO {
  qouteTweet: AddTweetDTO;
  reTweetId: number;
}
