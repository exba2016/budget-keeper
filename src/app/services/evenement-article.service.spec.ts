import { TestBed } from '@angular/core/testing';

import { EvenementArticleService } from './evenement-article.service';

describe('EvenementArticleService', () => {
  let service: EvenementArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvenementArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
