import { TestBed } from '@angular/core/testing';

import { FobService } from './fob.service';
import { HttpClientModule } from '@angular/common/http';

describe('FobService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: FobService = TestBed.get(FobService);
    expect(service).toBeTruthy();
  });
});
