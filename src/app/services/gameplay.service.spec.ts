import { TestBed, inject } from '@angular/core/testing';

import { GameplayService } from './gameplay.service';

describe('GameplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameplayService]
    });
  });

  it('should be created', inject([GameplayService], (service: GameplayService) => {
    expect(service).toBeTruthy();
  }));
});
