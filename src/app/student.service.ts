import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from './student';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiServerUrl}/student/all`);
  }

  public getPartialStudents(startIndex: number, limit: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiServerUrl}/student/partial/${startIndex}/${limit}`);
  }

  public getStudentsByDepartment(department: string, startIndex: number, limit: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiServerUrl}/student/byDepartment/${department}/${startIndex}/${limit}`);
  }

  public addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiServerUrl}/student/add`, student);
  }

  public updateStudent(studentId: number, updatedStudent: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiServerUrl}/student/update/${studentId}`, updatedStudent);
  }

  public deleteStudent(studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/student/delete/${studentId}`);
  }
}
