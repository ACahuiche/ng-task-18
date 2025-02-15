import { TestBed } from '@angular/core/testing';

import { ErrorlogsService } from './errorlogs.service';

describe('ErrorlogsService', () => {
  let service: ErrorlogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorlogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
