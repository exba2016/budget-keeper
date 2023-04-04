import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * Helps Avoid Memory Leak with unsubscription to api in components.
 */
@Injectable({
  providedIn: 'root'
})
export class SubscribeDestroyerService extends Subject<void> implements OnDestroy {
  /**
   * Destroys Subscription in the Caller Component.
   */
  ngOnDestroy(): void {
    this.next();
    this.complete();
    // console.log('Destroying');
    // console.log(this);
  }
}
