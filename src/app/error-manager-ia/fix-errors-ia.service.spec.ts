import { TestBed } from '@angular/core/testing';

import { FixErrorsIaService } from './fix-errors-ia.service';

describe('FixErrorsIaService', () => {
  let service: FixErrorsIaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixErrorsIaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
