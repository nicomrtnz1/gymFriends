import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';

import { HomeComponent } from './home.component';
import { MyFriendsReducer } from '../store/my-friends.reducer';

@Component({ template: '' })
class DummyComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let location: Location;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'friends', component: DummyComponent }
        ]),
        StoreModule.forRoot(MyFriendsReducer)
      ],
      providers: [{ provide: MatSnackBar, useClass: MatSnackBarStub }],
      declarations: [HomeComponent, DummyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should navigate to friends', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    expect(location.path()).toBe('/friends');
  });

  test('should depatch store rest on resetdata', () => {
    const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
    const snackBarSpy = jest.spyOn(snackBar, 'open');
    component.resetData();
    expect(dispatchSpy).toBeCalledWith({ type: '[[my-friend] reset state' });
    expect(snackBarSpy).toBeCalledWith('Data Cleared!', '', {
      duration: 4000,
      verticalPosition: 'top'
    });
  });
});

class MatSnackBarStub {
  open() {}
}
