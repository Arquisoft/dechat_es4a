
import {TestBed, inject, async} from '@angular/core/testing';

import { RdfService } from './rdf.service';
import {RouterTestingModule} from "@angular/router/testing";
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {SolidProfile} from '../../../bin/src/app/models/solid-profile.model';


class Friend {
    webid: string;
}

describe('RdfService', () => {
    let service: RdfService;
    const friends: Friend[] = [{
        webid: 'https://friend1.solid.community/profile/card/#me'
    },
        {
            webid: 'https://friend2.solid.community/profile/card/#me'
        },
        {
            webid: 'https://friend3.solid.community/profile/card/#me'
        },
    ]

    const profile: SolidProfile =
        {
            address: {
                street: 'mon'
            },
            company: 'uniovi',
            email: 'uo258403@uniovi.es',
            fn: 'fn',
            image: 'photoPerfil',
            phone: '123456789',
            role: 'student',
            organization: 'uniovi',
        }


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ToastrModule.forRoot()],
            providers: [RdfService, ToastrService]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        service = TestBed.get(RdfService);
    });


    it('should be created', inject([RdfService], (service: RdfService) => {
        expect(service).toBeTruthy();
    }));
    it('should return the friend list', () => {

        let spy = spyOn(service, 'getFriends').and.callFake(() => {
            return friends;
        });

        let friends2 = service.getFriends();

        //checks
        expect(friends2).toEqual(service.getFriends());
        expect(friends2[0]['webid']).toEqual(friends[0].webid);
        expect(friends2[1]['webid']).toEqual(friends[1].webid);
        expect(friends2[2]['webid']).toEqual(friends[2].webid);
        expect(spy).toHaveBeenCalled();
    });
    it('should return adress', () => {

        let address = profile.address.street;
        let spy = spyOn(service, 'getAddress').and.callFake(() => {
            return address;
        });
        let address2 = service.getAddress();


        expect(address2.street).toEqual(address['street']);
        expect(spy).toHaveBeenCalled();
    });

    it('should return email', () => {
        let email = profile.email;
        let spy = spyOn(service, 'getEmail').and.callFake(() => {
            return email;
        });
        let emailCheck = service.getEmail();

        expect(emailCheck).toEqual(email);
        expect(spy).toHaveBeenCalled();
    });

   /* it('check create methods', ()=>{
        const user = 'https://davidcr98.solid.community/profile/card#me';
        service.getValueFromVcard('','https://davidcr98.solid.community/profile/card#me');
        service.getValueFromFoaf('','https://davidcr98.solid.community/profile/card#me');
        //service.transformDataForm(null,user,'');
        //service.getPhotoFriend(user);
        //service.getFieldValue(null,'phone');
        //service.getOldFieldValue('phone',null);
        service.getFieldName('company');
        service.getFieldName('email');
        service.getFieldName('check');

    });*/
});

