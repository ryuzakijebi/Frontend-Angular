import { Component, OnInit, HostListener } from '@angular/core';
import { Student } from './student';
import { StudentService } from './student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public students: Student[] = [];
  public editStudentIndex = -1;
  public currentPage = 1;
  public itemsPerPage = 100;
  public departmentFilter = '';
  public currentPageDepartment = 1;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.getStudents();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (this.bottomReached()) {
      if (this.departmentFilter !== '') {
        this.currentPageDepartment++;
        this.getStudentsByDepartment(this.departmentFilter);
      } else {
        this.currentPage++;
        this.getStudents();
      }
    }
  }

  bottomReached(): boolean {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  }

  public getStudents(): void {
    const startIndex = this.currentPage - 1;
    const limit = this.itemsPerPage;
    this.studentService.getPartialStudents(startIndex, limit).subscribe(
      (response: Student[]) => {
        this.students = this.students.concat(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddStudent(addForm: NgForm): void {
    this.studentService.addStudent(addForm.value).subscribe(
      (response: Student) => {
        this.getStudents();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateStudent(student: Student, index: number): void {
    const studentId = student.id;
    this.studentService.updateStudent(studentId, student).subscribe(
      (updatedStudent: Student) => {
        const studentIndex = this.students.findIndex((s) => s.id === studentId);
        if (studentIndex !== -1) {
          this.students[studentIndex] = updatedStudent;
        }
        this.disableEditMode();
      },
      (error: HttpErrorResponse) => {
        console.error('Error occurred while updating student:', error.message);
      }
    );
  }

  public onDeleteStudent(studentId: number, index: number): void {
    this.studentService.deleteStudent(studentId).subscribe(
      () => {
        this.students.splice(index, 1);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchStudents(key: string): void {
    const results: Student[] = [];
    for (const student of this.students) {
      if (
        student.name.toLowerCase().includes(key.toLowerCase()) ||
        student.studentID.toLowerCase().includes(key.toLowerCase()) ||
        student.email.toLowerCase().includes(key.toLowerCase()) ||
        student.department.toLowerCase().includes(key.toLowerCase())
      ) {
        results.push(student);
      }
    }
    this.students = results;
  }

  public filterByDepartment(department: string): void {
    this.currentPageDepartment = 1;
    if (department === '') {
      this.departmentFilter = '';
      this.students = [];
      this.getStudents();
    } else {
      this.departmentFilter = department;
      this.getStudentsByDepartment(department);
    }
  }

  public getStudentsByDepartment(department: string): void {
    if (department === 'all') {
      this.getStudents();
    } else {
      const startIndex = this.currentPageDepartment - 1;
      const limit = this.itemsPerPage;
      this.studentService.getStudentsByDepartment(department, startIndex, limit).subscribe(
        (response: Student[]) => {
          if (this.currentPageDepartment === 1) {
            this.students = response;
          } else {
            this.students = this.students.concat(response);
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public confirmDelete(studentId: number, index: number): void {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this student?'
    );
    if (isConfirmed) {
      this.onDeleteStudent(studentId, index);
    }
  }

  public enableEditMode(index: number): void {
    this.editStudentIndex = index;
  }

  public disableEditMode(): void {
    this.editStudentIndex = -1;
  }

  public isEditMode(index: number): boolean {
    return this.editStudentIndex === index;
  }
}
