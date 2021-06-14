import { TestBed } from '@angular/core/testing';

import { CapturesService } from './captures.service';

describe('CapturesService', () => {
  let service: CapturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
