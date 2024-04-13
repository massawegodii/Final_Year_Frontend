
export interface Request {
    id: number ;
    name: string;
    email: string
    department: string;
    numberOfAsset: number;
    days: number;
    startDate: Date;
    endDate: Date;
    statusAsset: string
    user: {
        userName: string
        email: string
    }
}