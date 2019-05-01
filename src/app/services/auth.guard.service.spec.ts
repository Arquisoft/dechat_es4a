import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard.service';
import {RouterTestingModule} from "@angular/router/testing";
import {ToastrModule} from "ngx-toastr";

describe('AuthServiceGuard', () => {

  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ToastrModule.forRoot() ] ,
      providers: [AuthGuard  ]
    });
    service = TestBed.get(AuthGuard);
  });

  var mock = (function storageMock() {
    var storage = { 'solid-auth-client' : true};

    return {
      setItem: function(key, value) {
        storage[key] = value || '';
      },
      getItem: function(key) {
        return key in storage ? storage[key] : null;
      },
      removeItem: function(key) {
        delete storage[key];
      },
      get length() {
        return Object.keys(storage).length;
      },
      key: function(i) {
        var keys = Object.keys(storage);
        return keys[i] || null;
      }
    };
  })();

  it('should create', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should call canActivate and return true', inject([AuthGuard],
      (guard: AuthGuard) => {
        // mock the localStorage
        Object.defineProperty(window, 'localStorage', {
          value: mock,
        });
        expect(service.canActivate()).toBe(true);
      }));

  

});

