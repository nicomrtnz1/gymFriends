import { Component } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
export interface Friend {
  name: string;
}
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  myFriendsForm: FormGroup;
  friendsArray: Friend[] = [];
  alphaStringRegExp = new RegExp(/^[A-Za-z ]+$/);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.myFriendsForm = this.fb.group({
      myFriends: this.fb.array([])
    });
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
      friends: [[], [Validators.required, Validators.min(1)]],
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
        (friend: Friend) =>
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

  removeChip(friend: Friend, friendsArray: AbstractControl | null) {
    const index = friendsArray?.value.findIndex(
      (x: Friend) => x.name === friend.name
    );
    if (index >= 0 && friendsArray) {
      friendsArray.value.splice(index, 1);
    }
    friendsArray?.updateValueAndValidity();
  }

  viewResults() {
    if (this.myFriendsForm.value.myFriends.length > 0) {
      if (this.myFriendsForm.valid) {
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
}
