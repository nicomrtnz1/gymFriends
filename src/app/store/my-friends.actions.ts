import { createAction, props } from '@ngrx/store';
import { Friend } from '../shared/friend.interface';

export const getFriends = createAction('[my-friends] get friends');

export const loadFriends = createAction(
  '[my-friends] load friends',
  props<{ myFriends: Friend[] }>()
);

export const resetState = createAction('[[my-friend] reset state');
