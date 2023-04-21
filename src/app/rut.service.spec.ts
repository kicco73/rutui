import { TestBed } from '@angular/core/testing';

import { RutService } from './rut.service';

describe('RutService', () => {
  let service: RutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
