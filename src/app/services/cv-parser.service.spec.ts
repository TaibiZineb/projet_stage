import { TestBed } from '@angular/core/testing';

import { CvParserService } from './cv-parser.service';

describe('CvParserService', () => {
  let service: CvParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
