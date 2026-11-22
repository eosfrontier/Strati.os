import { DateService } from './date.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl } from '@angular/forms';
import { IcDate } from '../models/icdate';

describe('Service: DateService', () => {

    let icDate: any;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
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

    it('should format an IcDate object as zero-padded DD.MM.<year><yearAfter>', inject([DateService], (service: DateService) => {
        const date = new IcDate();
        date.day = 5;
        date.dayName = 'fri';
        date.month = 5;
        date.monthName = 'May';
        date.year = 240;
        date.yearAfter = 'NT';
        expect(service.formatIcDate(date)).toEqual('05.05.240NT');

        date.day = 18;
        date.month = 11;
        date.year = 247;
        expect(service.formatIcDate(date)).toEqual('18.11.247NT');

        expect(service.formatIcDate(null)).toEqual('');
    }));

    it('should return the current IC date string from the BehaviorSubject', inject([DateService], (service: DateService) => {
        expect(service.getCurrentIcDateString()).toEqual('');

        const date = new IcDate();
        date.day = 18;
        date.month = 5;
        date.year = 240;
        date.yearAfter = 'NT';
        service.icDate.next(date);

        expect(service.getCurrentIcDateString()).toEqual('18.05.240NT');
    }));

    it('should parse and normalize valid IC date strings', inject([DateService], (service: DateService) => {
        expect(service.parseIcDate('18.05.240NT')).toEqual({ day: 18, month: 5, year: 240, yearAfter: 'NT' });
        expect(service.parseIcDate(' 5.5.240nt ')).toEqual({ day: 5, month: 5, year: 240, yearAfter: 'NT' });
        expect(service.parseIcDate('01.12.241')).toEqual({ day: 1, month: 12, year: 241, yearAfter: '' });

        expect(service.normalizeIcDate('5.5.240nt')).toEqual('05.05.240NT');
        expect(service.normalizeIcDate(' 18.05.240NT ')).toEqual('18.05.240NT');

        expect(service.parseIcDate('0.05.240NT')).toBeNull();
        expect(service.parseIcDate('32.05.240NT')).toBeNull();
        expect(service.parseIcDate('18.0.240NT')).toBeNull();
        expect(service.parseIcDate('18.13.240NT')).toBeNull();
        expect(service.parseIcDate('240-05-18')).toBeNull();
        expect(service.parseIcDate('')).toBeNull();
        expect(service.parseIcDate(null)).toBeNull();
    }));

    it('should produce chronological numeric sort keys', inject([DateService], (service: DateService) => {
        expect(service.getIcDateSortKey('9.5.240NT')).toBeLessThan(service.getIcDateSortKey('18.05.240NT'));
        expect(service.getIcDateSortKey('31.05.240NT')).toBeLessThan(service.getIcDateSortKey('01.06.240NT'));
        expect(service.getIcDateSortKey('31.12.240NT')).toBeLessThan(service.getIcDateSortKey('01.01.241NT'));
        expect(service.getIcDateSortKey('')).toBe(Infinity);
        expect(service.getIcDateSortKey(undefined)).toBe(Infinity);
    }));

    it('should validate IC date controls using icDateValidator', inject([DateService], (service: DateService) => {
        const validator = service.icDateValidator();
        expect(validator(new FormControl(''))).toBeNull();
        expect(validator(new FormControl('18.05.240NT'))).toBeNull();
        expect(validator(new FormControl('5.5.240nt'))).toBeNull();
        expect(validator(new FormControl('invalid'))).toEqual({ invalidIcDate: true });
        expect(validator(new FormControl('32.05.240NT'))).toEqual({ invalidIcDate: true });
    }));

});
