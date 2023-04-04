import { TestBed } from '@angular/core/testing';

import { SubscribeDestroyerService } from './subscribe-destroyer.service';

describe('SubscribeDestroyerService', () => {
  let service: SubscribeDestroyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribeDestroyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
