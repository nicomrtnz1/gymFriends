import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { resetState } from '../store/my-friends.actions';
import { selectFriends } from '../store/my-friends.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  friends$: Observable<any>;

  constructor(private readonly store: Store<{ myFriends: [] }>,
    private readonly snackBar: MatSnackBar) {
    this.friends$ = this.store.select(selectFriends);
  }

  resetData(){
    this.store.dispatch(resetState());
    this.snackBar.open('Data Cleared!', '', {
      duration: 4000,
      verticalPosition: 'top'
    });
  }
}
