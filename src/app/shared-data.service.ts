import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private sessionId: string | null = null;
  private studentId: string | null = null;

  setSessionId(id: string): void {
    this.sessionId = id;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  setStudentId(id: string): void {
    this.studentId = id;
  }

  getStudentId(): string | null {
    return this.studentId;
  }
}