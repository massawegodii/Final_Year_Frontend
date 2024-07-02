import { Time } from "@angular/common";

export interface UserEvents {
  id: number | null;
  username: string;
  ipAddress: number;
  attemptCount: number;
  success: string;
  timestamp: Time;
}
