import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LayoutService implements OnDestroy {

  matcher!: MediaQueryList;

  constructor(private breakpointObserver: BreakpointObserver,
              public mediaMatcher: MediaMatcher) {

    this.matcher = this.mediaMatcher.matchMedia('(min-width: 500px)');
    this.matcher.addEventListener('change', this.myListener);

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log(
            'Matches small viewport or handset in portrait mode',
          );
        }
      });
  }

  myListener(event: { matches: any; }) {
    console.log(event.matches ? 'match' : 'no match');
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
    );

  ngOnDestroy(): void {
    this.matcher.removeEventListener('change', this.myListener);
  }

}
