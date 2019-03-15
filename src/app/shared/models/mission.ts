export class Mission {
    _id: string;
    priority: number;
    creationtimestamp: number; // epoch
    type: string;
    goal: string;
    colorcode: string;
    title: string;
    authorised: boolean;
    authorisedby: string;
    xo?: string;
    icdate: string; // string? Yup. In-game date.
    departureTime?: Date;
    delayed: boolean;
    editcounter: number;
}
