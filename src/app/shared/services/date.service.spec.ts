import { TestBed } from '@angular/core/testing';

import { DateService } from './date.service';
import { HttpClientModule } from '@angular/common/http';

describe('DateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: DateService = TestBed.get(DateService);
    expect(service).toBeTruthy();
  });
});
