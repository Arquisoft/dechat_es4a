import { TestBed, inject } from '@angular/core/testing';

import { RdfService } from './rdf.service';
import {RouterTestingModule} from "@angular/router/testing";
import {ToastrModule} from "ngx-toastr";

describe('RdfService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule, ToastrModule.forRoot() ] ,
            providers: [RdfService]
        });
        TestBed.get(RdfService);
    });

    it('should be created', inject([RdfService], (service: RdfService) => {
        expect(service).toBeTruthy();
    }));
});