export class Mission {
    priority: number;
    creationtimestamp: number; // epoch
    type: string;
    goal: string;
    title: string;
    authorised: boolean;
    authorisedby: string;
    xo: string;
    icdate: string; // string? Yup. In-game date.
    time: Date;
    delayed: boolean;
    editcounter: number;
}
