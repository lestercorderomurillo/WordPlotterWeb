import { TestBed } from '@angular/core/testing';

import { WordsServiceService } from './words.service';

describe('WordsServiceService', () => {
  let service: WordsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
