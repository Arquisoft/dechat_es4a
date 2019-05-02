import {TestBed, inject, tick, fakeAsync} from '@angular/core/testing';
import { AuthService } from './solid.auth.service';
import {RouterTestingModule} from "@angular/router/testing";
import {ToastrModule} from "ngx-toastr";
import {Location} from '@angular/common';
import {Router} from "@angular/router";
import {RdfService} from "../../../bin/src/app/services/rdf.service";
import {observeOn} from "rxjs/operators";

describe('AuthService', () => {

  let service ;
  let router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ToastrModule.forRoot() ] ,
      providers: [AuthService, RdfService],
    });
  });
  beforeEach(() => {

    spyOn( AuthService.prototype, 'isSessionActive').and.returnValue(true);
    service = TestBed.get(AuthService);
    router = TestBed.get(Router);
    router.initialNavigation();
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


  it('should be created',() =>{
    expect(service).toBeTruthy();
  });
/*
  it('should take you to /card if session is active', fakeAsync(() => {
    spyOn( AuthService.getSolid().auth.prototype, 'isSessionActive').and.returnValue(true);
    service.solidLoginPopup();
    tick(15000);
    service.detectChanges();
    service.whenStable().then(() => {
     //  expect(location.path(true)).toBe('/change-pass/1/elena123');
    });
  }));*/

  it('should be save and then get old profile data',() =>{
    Object.defineProperty(window, 'localStorage', {
      value: mock,
    });
    expect(JSON.stringify(service.getOldUserData())).toBe('null');
    service.saveOldUserData({name: 'elena', pass: 'pass'});
    const expectedRes = { name: 'elena', pass: 'pass' };
    expect(JSON.stringify(service.getOldUserData())).toBe(JSON.stringify(expectedRes));
  });

  it('should be save and then get old web id',() =>{
    Object.defineProperty(window, 'localStorage', {
      value: mock,
    });
    expect(JSON.stringify(service.getOldWebId())).toBe('null');
    service.saveWebId('elena13');
    const expectedRes = 'elena13' ;
    expect(JSON.stringify(service.getOldWebId())).toBe(JSON.stringify(expectedRes));
  });

  it('should be save and then get old friends list',() =>{
    Object.defineProperty(window, 'localStorage', {
      value: mock,
    });
    expect(JSON.stringify(service.getOldFriends())).toBe('null');
    service.saveFriends({c:'elena' , c0: 'aida'});
    const expectedRes = {c:'elena' , c0: 'aida'};
    expect(JSON.stringify(service.getOldFriends())).toBe(JSON.stringify(expectedRes));
  });
  
});
