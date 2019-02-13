import { SupplyBreakpointPipe } from './supply-breakpoint.pipe';

describe('SupplyBreakPointPipe', () => {

    const pipe = new SupplyBreakpointPipe();

    beforeEach(() => {
        pipe.supplyBreakpoints = {
            full: 100,
            high: 70,
            medium: 35,
        };
    });

    it('should display "5% (!)" if the percentage is 5', () => {
        const val = pipe.transform(5);
        expect(val).toEqual('5% (!)');
    });

    it('should display "50%" if the percentage is 50', () => {
        const val = pipe.transform(50);
        expect(val).toEqual('50%');
    });

});
