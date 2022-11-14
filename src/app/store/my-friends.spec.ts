import { Friend } from '../shared/friend.interface';
import * as Reducer from './my-friends.reducer';

import * as Actions from './my-friends.actions';
describe('My Friends Reducer', () => {
  let mockFriends: Friend[];

  beforeEach(() => {
    mockFriends = [
      {
        name: 'Foobar',
        age: '12',
        weight: '120',
        friends: [{ name: 'Barfoo' }]
      }
    ];
  });

  it('should load my friends', () => {
    const state = Reducer.MyFriendsReducer(
      Reducer.initialState,
      Actions.loadFriends({ myFriends: mockFriends })
    );
    expect(state.myFriends).toEqual(mockFriends);
  });

  it('should reset to inital state', () => {
    const state = Reducer.MyFriendsReducer(
      { myFriends: mockFriends },
      Actions.resetState()
    );
    expect(state.myFriends).toEqual([]);
  });

  it('should return state.items', () => {
    const state = Reducer.MyFriendsReducer(
      Reducer.initialState,
      Actions.loadFriends({ myFriends: mockFriends })
    );
    expect(Reducer.selectFriends(state)).toEqual(mockFriends);
  });
});
