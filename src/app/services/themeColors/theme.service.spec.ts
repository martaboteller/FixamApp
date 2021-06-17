import { TestBed } from '@angular/core/testing';

import { ThemeColorsService } from './themeColors.service';

describe('ThemeColorsService', () => {
  let service: ThemeColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
