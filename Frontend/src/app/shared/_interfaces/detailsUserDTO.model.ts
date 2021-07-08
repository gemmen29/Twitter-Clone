export interface DetailsUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  userPic: string;
  isFollowedByCurrentUser: boolean;
  followingCount: number;
  followersCount: number;
}
