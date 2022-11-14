import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { getFriends } from '../store/my-friends.actions';
import { selectFriends } from '../store/my-friends.reducer';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnDestroy, OnInit {
  friends$: Observable<any>;

  ngDestroyed$ = new Subject();
  constructor(private readonly store: Store<{ myFriends: [] }>) {
    this.store.dispatch(getFriends());
    this.friends$ = this.store.select(selectFriends);
  }
  ngOnInit() {
    this.subscribeToMassBookingState();
  }

  ngOnDestroy() {
    this.ngDestroyed$.next(null);
  }

  private subscribeToMassBookingState(): Subscription {
    return this.friends$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((state) => {
        state;
      });
  }
}
