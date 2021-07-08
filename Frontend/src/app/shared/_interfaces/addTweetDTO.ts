import { ImageDTO } from "./imageDTO";
import { VideoDTO } from "./videoDTO";

export interface AddTweetDTO {
    body: string;
    images: ImageDTO[];
    video: VideoDTO;
    creationDate: Date
  }