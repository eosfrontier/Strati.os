import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { HttpClientModule } from '@angular/common/http';

describe('SocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });
});
