import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { FriendsComponent } from './friends.component';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyFriendsReducer } from '../store/my-friends.reducer';

describe('FriendsComponent', () => {
  let component: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;
  let snackBar: MatSnackBar;
  let fb: FormBuilder;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot(MyFriendsReducer)],
      providers: [
        FormBuilder,
        { provide: MatSnackBar, useClass: MatSnackBarStub }
      ],
      declarations: [FriendsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsComponent);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    store = TestBed.inject(Store);
    fb = new FormBuilder();
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should add to friend array ', () => {
    const newFriendSpy = jest.spyOn(component, 'newFriend');
    expect(component.myFriends.length).toBe(0);
    component.addFriend();
    expect(newFriendSpy).toBeCalledTimes(1);
    expect(component.myFriends.length).toBe(1);
  });

  test('should remove from friend array ', () => {
    component.addFriend();
    component.addFriend();
    component.addFriend();
    expect(component.myFriends.length).toBe(3);
    component.myFriends.controls[0].patchValue({
      name: 'Foo'
    });
    component.myFriends.controls[2].patchValue({
      name: 'Bar'
    });
    component.removeFriend(1);
    expect(component.myFriends.length).toBe(2);
    expect(component.myFriends.value).toEqual([
      { age: '', friends: [], name: 'Foo', weight: '' },
      { age: '', friends: [], name: 'Bar', weight: '' }
    ]);
  });

  test('should trigger openSnackBar if no fiends added', () => {
    const openSnackBarSpy = jest.spyOn(component, 'openSnackBar');
    component.viewResults();
    expect(openSnackBarSpy).toBeCalledWith(
      'You need to add a friend to see results'
    );
  });

  test('should trigger openSnackBar if firends add but form is invalid', () => {
    const openSnackBarSpy = jest.spyOn(component, 'openSnackBar');
    component.addFriend();
    component.viewResults();
    expect(openSnackBarSpy).toBeCalledWith(
      'One or more fields are missing required information'
    );
  });

  test('should  route to results if form is valid', () => {
    const routerSpy = jest
      .spyOn(component['router'], 'navigate')
      .mockReturnValue(Promise.resolve(true));
    component.addFriend();
    component.myFriends.controls[0].patchValue({
      name: 'asdf',
      friends: [{ name: 'foo' }],
      age: '3',
      weight: '9'
    });
    component.viewResults();
    expect(routerSpy).toBeCalledWith(['/results']);
  });

  test('should handle friend chip added', () => {
    const friendsArray = fb.control([]);
    const updateValueAndValiditySpy = jest.spyOn(
      friendsArray,
      'updateValueAndValidity'
    );
    const event = {
      input: null,
      chipInput: { clear: jest.fn() },
      value: 'test input'
    };
    const clearSpy = jest.spyOn(event.chipInput, 'clear');
    component.addChip(event as any, friendsArray);
    expect(friendsArray.value).toEqual([{ name: 'test input' }]);
    expect(clearSpy).toBeCalledTimes(1);
    expect(updateValueAndValiditySpy).toBeCalledTimes(1);
  });

  test('should handle invalid friend chip added', () => {
    const friendsArray = fb.control([]);
    const updateValueAndValiditySpy = jest.spyOn(
      friendsArray,
      'updateValueAndValidity'
    );
    const isNameValidSpy = jest.spyOn(component, 'isNameValid');
    const event = {
      input: null,
      chipInput: { clear: jest.fn() },
      value: 'test2'
    };
    const clearSpy = jest.spyOn(event.chipInput, 'clear');
    component.addChip(event as any, friendsArray);
    expect(friendsArray.value).toEqual([]);
    expect(clearSpy).toBeCalledTimes(1);
    expect(updateValueAndValiditySpy).toBeCalledTimes(1);
    expect(isNameValidSpy).toBeCalledTimes(1);

    event.value = '!@t3';
    component.addChip(event as any, friendsArray);
    expect(friendsArray.value).toEqual([]);
    expect(clearSpy).toBeCalledTimes(2);
    expect(updateValueAndValiditySpy).toBeCalledTimes(2);
    expect(isNameValidSpy).toBeCalledTimes(2);

    event.value = 'This WoRks';
    component.addChip(event as any, friendsArray);
    expect(friendsArray.value).toEqual([{ name: 'This WoRks' }]);
    expect(clearSpy).toBeCalledTimes(3);
    expect(updateValueAndValiditySpy).toBeCalledTimes(3);
    expect(isNameValidSpy).toBeCalledTimes(3);
  });

  test('should handle friend chip added of empty', () => {
    const friendsArray = fb.control([]);
    const updateValueAndValiditySpy = jest.spyOn(
      friendsArray,
      'updateValueAndValidity'
    );
    const event = {
      input: null,
      chipInput: { clear: jest.fn() },
      value: undefined
    };
    const clearSpy = jest.spyOn(event.chipInput, 'clear');
    component.addChip(event as any, friendsArray);
    expect(friendsArray.value).toEqual([]);
    expect(clearSpy).toBeCalledTimes(1);
    expect(updateValueAndValiditySpy).toBeCalledTimes(1);
  });

  test('should handle friend chip added of empty and no control', () => {
    const friendsArray = null;
    const event = {
      input: null,
      chipInput: { clear: jest.fn() },
      value: undefined
    };
    const clearSpy = jest.spyOn(event.chipInput, 'clear');
    component.addChip(event as any, null);
    expect(friendsArray).toBeNull();
    expect(clearSpy).toBeCalledTimes(1);
  });

  test('should handle friend chip added and no control', () => {
    const friendsArray = null;
    const event = {
      input: null,
      chipInput: { clear: jest.fn() },
      value: 'test'
    };
    const clearSpy = jest.spyOn(event.chipInput, 'clear');
    component.addChip(event as any, friendsArray);
    expect(friendsArray).toBeNull;
    expect(clearSpy).toBeCalledTimes(1);
  });

  test('should handle friend chip added of same name', () => {
    const friendsArray = fb.control([]);
    const updateValueAndValiditySpy = jest.spyOn(
      friendsArray,
      'updateValueAndValidity'
    );
    const event = {
      input: null,
      chipInput: { clear: jest.fn() },
      value: 'test input'
    };
    const clearSpy = jest.spyOn(event.chipInput, 'clear');
    component.addChip(event as any, friendsArray);
    expect(friendsArray.value).toEqual([{ name: 'test input' }]);
    expect(clearSpy).toBeCalledTimes(1);
    expect(updateValueAndValiditySpy).toBeCalledTimes(1);
    event.value = 'Test Input';
    component.addChip(event as any, friendsArray);

    expect(friendsArray.value).toEqual([{ name: 'test input' }]);
    expect(clearSpy).toBeCalledTimes(2);
    expect(updateValueAndValiditySpy).toBeCalledTimes(2);
  });

  test('should handle friend chip remove', () => {
    const friend = { name: 'foo' };
    const friendsArray = fb.control([{ name: 'foo' }]);
    const updateValueAndValiditySpy = jest.spyOn(
      friendsArray,
      'updateValueAndValidity'
    );

    expect(friendsArray.value).toEqual([{ name: 'foo' }]);
    component.removeChip(friend, friendsArray);
    expect(friendsArray.value).toEqual([]);
    expect(updateValueAndValiditySpy).toBeCalledTimes(1);
  });

  test('should handle friend chip remove if no match', () => {
    const friend = { name: 'foo' };
    const friendsArray = fb.control([{ name: 'fooBar' }]);
    const updateValueAndValiditySpy = jest.spyOn(
      friendsArray,
      'updateValueAndValidity'
    );

    expect(friendsArray.value).toEqual([{ name: 'fooBar' }]);
    component.removeChip(friend, friendsArray);
    expect(friendsArray.value).toEqual([{ name: 'fooBar' }]);
    expect(updateValueAndValiditySpy).toBeCalledTimes(1);
  });

  test('should handle friend chip remove if no friendArray', () => {
    const friend = { name: 'foo' };
    const friendsArray = null;

    expect(friendsArray).toBeNull();
    component.removeChip(friend, friendsArray);
    expect(friendsArray).toBeNull();
  });

  test('should open snackBar', () => {
    const snackBarSpy = jest.spyOn(snackBar, 'open');
    component.openSnackBar('TestMessag');
    expect(snackBarSpy).toBeCalledWith('TestMessag', '', {
      duration: 3000,
      verticalPosition: 'top'
    });
  });

  test('should validate name', () => {
    const openSnackBarSpy = jest.spyOn(component, 'openSnackBar');
    component.isNameValid('asdf');
    expect(openSnackBarSpy).not.toBeCalled();
    component.isNameValid('this test');
    expect(openSnackBarSpy).not.toBeCalled();
    component.isNameValid('TH at Test');
    expect(openSnackBarSpy).not.toBeCalled();
    component.isNameValid('This 1 test');
    expect(openSnackBarSpy).toBeCalledWith(
      'Name can only contain alphabet letters and spaces'
    );
  });

  test('should populate form from data', () => {
    const mockFriends = [
      {
        name: 'bar',
        friends: [{ name: 'foo' }],
        age: '3',
        weight: '20'
      },
      {
        name: 'foo',
        friends: [],
        age: '43',
        weight: '120'
      }
    ];
    const formResetSpy = jest.spyOn(component.myFriendsForm, 'reset');
    expect(component.myFriends.controls.length).toBe(0);
    expect(component.myFriendsForm.value).toEqual({ myFriends: [] });
    component.populateFormFromData(mockFriends);
    expect(formResetSpy).toBeCalled();
    expect(component.myFriends.controls.length).toBe(2);
    expect(component.myFriendsForm.value).toEqual({ myFriends: mockFriends });
  });
});

class MatSnackBarStub {
  open() {}
}
