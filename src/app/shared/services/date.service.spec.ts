import { DateService } from './date.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

describe('Service: DateService', () => {

    let icDate: any;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [DateService]
        });

        icDate = {
            ocEventStart: '2019-01-07T11:00:00.000Z',
            icEventStart: '2019-05-18T10:00:00.000Z',
            iStartDayOfWeek: 5,
            iStartYear: 240,
            iYearAfter: 'NT',
            iDay: 18,
            iMonth: 5,
            iYear: 240,
            iDayOfWeek: 5,
            iDayName: 'friday',
            iMonthName: 'May'
        };

    });

    it('should return fri when the day is friday', inject([DateService], (service: DateService) => {
        const value = service.shortenDayName(icDate.iDayName);
        expect(value).toEqual('fri');
    }));

});
