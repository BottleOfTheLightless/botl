import { Subject } from 'rxjs';

const analyticsEvent = new Subject<{
  event: string;
  value: number;
}>();
export const analyticsEvent$ = analyticsEvent.asObservable();

export function sendDesignEvent(event: string, value = 1): void {
  analyticsEvent.next({ event, value });
}
