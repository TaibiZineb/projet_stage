import { TestBed } from '@angular/core/testing';

import { GoogleauthentificationGuard } from './googleauthentification.guard';

describe('GoogleauthentificationGuard', () => {
  let guard: GoogleauthentificationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GoogleauthentificationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
