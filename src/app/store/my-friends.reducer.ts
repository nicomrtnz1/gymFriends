import { on, createReducer } from '@ngrx/store';
import { Friend } from '../shared/friend.interface';
import { loadFriends, resetState } from './my-friends.actions';

export interface State {
  myFriends: Friend[];
}

export const initialState: State = {
  myFriends: []
};

export const MyFriendsReducer = createReducer(
  initialState,
  on(
    loadFriends,
    (state, action): State => ({
      ...state,
      myFriends: action.myFriends
    })
  ),
  on(resetState, (): State => ({ ...initialState }))
);

export const selectFriends = (state: State) => state.myFriends;
