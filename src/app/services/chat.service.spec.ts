import { TestBed, inject } from '@angular/core/testing';

import { ChatService } from './chat.service';
import {RouterTestingModule} from "@angular/router/testing";
import {ToastrModule} from "ngx-toastr";

describe('ChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ToastrModule.forRoot() ] ,
      providers: [ChatService]
    });
  });

  it('should be created', inject([ChatService], (service: ChatService) => {
    expect(service).toBeTruthy();
  }));
});
