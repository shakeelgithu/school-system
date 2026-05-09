import { TestBed } from '@angular/core/testing';

import { FeeServiceTsService } from './fee.service.ts.service';

describe('FeeServiceTsService', () => {
  let service: FeeServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
