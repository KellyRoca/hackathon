import { TestBed } from '@angular/core/testing';

import { FireDatabaseService } from './fire-database.service';

describe('FireDatabaseService', () => {
  let service: FireDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
