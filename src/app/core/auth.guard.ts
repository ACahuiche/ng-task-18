import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../shared/data-access/auth-state.service';
import { map } from 'rxjs';

export const privateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);

  return authState.authState$.pipe(
    map(state => {
      console.log(state);
      if(!state) {
        router.navigateByUrl('/auth/sign-in');
        return false;
      }

      return true;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);

  return authState.authState$.pipe(
    map(state => {
      console.log(state);
      if(state) {
        router.navigateByUrl('/tasks');
        return false;
      }

      return true;
    })
  );
};