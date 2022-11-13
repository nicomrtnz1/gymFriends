import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'friends', component: DummyComponent }
        ])
      ],
      declarations: [HomeComponent, DummyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
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
});
