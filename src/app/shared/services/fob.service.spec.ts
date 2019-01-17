import { TestBed } from '@angular/core/testing';

import { FobService } from './fob.service';

describe('FobService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FobService = TestBed.get(FobService);
    expect(service).toBeTruthy();
  });
});
