import { FriendName } from './friend-name.interface';

export interface Friend {
  name: string;
  age: string;
  weight: string;
  friends: FriendName[];
}
