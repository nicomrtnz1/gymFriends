import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectFriends } from '../store/my-friends.reducer';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  friends$: Observable<any>;

  constructor(private readonly store: Store<{ myFriends: [] }>) {
    this.friends$ = this.store.select(selectFriends);
  }
}
