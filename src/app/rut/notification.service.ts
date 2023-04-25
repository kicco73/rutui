import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

export type Notification = {
  severity: string,
  summary: string,
  detail: string,
}

export type JobUpdate = {
  job: string,
  progress: number
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(private socket: Socket) {
  }

  addNotificationListener(callback: (msg: Notification) => void) {
    this.socket.on('notification', callback);
  }

  addJobUpdateListener(callback: (msg: any) => void) {
    this.socket.on('job update', callback);
  }

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data.msg));
  }
}
