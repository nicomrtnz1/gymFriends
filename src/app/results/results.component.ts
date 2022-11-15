import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getFriends } from '../store/my-friends.actions';
import { selectFriends } from '../store/my-friends.reducer';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  friends$: Observable<any>;

  constructor(private readonly store: Store<{ myFriends: [] }>) {
    this.store.dispatch(getFriends());
    this.friends$ = this.store.select(selectFriends);
  }
}
