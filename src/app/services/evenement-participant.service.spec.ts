import { TestBed } from '@angular/core/testing';

import { EvenementParticipantService } from './evenement-participant.service';

describe('EvenementParticipantService', () => {
  let service: EvenementParticipantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvenementParticipantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
