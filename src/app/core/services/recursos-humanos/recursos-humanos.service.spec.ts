import { TestBed } from '@angular/core/testing';

import { RecursosHumanosService } from './recursos-humanos.service';

describe('RecursosHumanosService', () => {
  let service: RecursosHumanosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecursosHumanosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
