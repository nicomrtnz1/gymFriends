import { Component, OnDestroy, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FriendName } from '../shared/friend-name.interface';
import { getFriends, loadFriends } from '../store/my-friends.actions';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { selectFriends } from '../store/my-friends.reducer';
import { Friend } from '../shared/friend.interface';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnDestroy, OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  myFriendsForm: FormGroup;
  friendsArray: FriendName[] = [];
  alphaStringRegExp = new RegExp(/^[A-Za-z ]+$/);
  friends$: Observable<any>;
  ngDestroyed$ = new Subject();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store<{ myFriends: [] }>
  ) {
    this.store.dispatch(getFriends());
    this.friends$ = this.store.select(selectFriends);
    this.myFriendsForm = this.fb.group({
      myFriends: this.fb.array([])
    });
  }

  ngOnInit() {
    this.subscribeToState();
  }

  ngOnDestroy() {
    this.ngDestroyed$.next(null);
  }

  get myFriends(): FormArray {
    return this.myFriendsForm.get('myFriends') as FormArray;
  }

  newFriend(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(this.alphaStringRegExp)]
      ],
      friends: [[]],
      age: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[0-9]\d*$/)
        ]
      ],
      weight: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[0-9]\d*$/)
        ]
      ]
    });
  }

  addFriend() {
    this.myFriends.push(this.newFriend());
  }

  removeFriend(index: number) {
    this.myFriends.removeAt(index);
  }

  addChip(event: MatChipInputEvent, friendsArray: AbstractControl | null) {
    const value = (event.value || '').trim();
    if (
      value &&
      this.isNameValid(value) &&
      !friendsArray?.value.find(
        (friend: FriendName) =>
          friend.name.toLowerCase() == value.toLocaleLowerCase()
      )
    ) {
      friendsArray?.value.push({ name: value });
    }
    friendsArray?.updateValueAndValidity();
    event.chipInput.clear();
  }

  isNameValid(name: string): boolean {
    if (this.alphaStringRegExp.test(name)) {
      return true;
    }
    this.openSnackBar('Name can only contain alphabet letters and spaces');
    return false;
  }

  removeChip(friend: FriendName, friendsArray: AbstractControl | null) {
    const index = friendsArray?.value.findIndex(
      (x: FriendName) => x.name === friend.name
    );
    if (index >= 0 && friendsArray) {
      friendsArray.value.splice(index, 1);
    }
    friendsArray?.updateValueAndValidity();
  }

  viewResults() {
    if (this.myFriendsForm.value.myFriends.length > 0) {
      if (this.myFriendsForm.valid) {
        this.store.dispatch(loadFriends(this.myFriendsForm.value));
        this.router.navigate(['/results']);
      } else {
        this.openSnackBar(
          'One or more fields are missing required information'
        );
      }
    } else {
      this.openSnackBar('You need to add a friend to see results');
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  populateFormFromData(myFriends: Friend[]) {
    this.myFriendsForm.reset();
    myFriends.map(() => {
      this.addFriend();
    });
    this.myFriends.patchValue(JSON.parse(JSON.stringify(myFriends)));
  }

  private subscribeToState(): Subscription {
    return this.friends$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((state) => {
        this.populateFormFromData(state.myFriends);
      });
  }
}
