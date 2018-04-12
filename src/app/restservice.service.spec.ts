import { TestBed, inject } from '@angular/core/testing';

import { RestserviceService } from './restservice.service';

import { Http, Response, Headers } from '@angular/http'
import { World, Pallier, Product } from './world';

describe('RestserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestserviceService]
    });
  });

  it('should be created', inject([RestserviceService], (service: RestserviceService) => {
    expect(service).toBeTruthy();
  }));
});
