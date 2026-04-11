import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { movieguardGuard } from './movieguard-guard';

describe('movieguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => movieguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
