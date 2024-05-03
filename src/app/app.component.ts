import { Component, OnInit } from '@angular/core';
import { Student } from './student';
import { StudentService } from './student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public students?: Student[];
  public editStudentIndex: number = -1;

  constructor(private studentService: StudentService){}

  ngOnInit() {
    this.getStudents();
  }

  public getStudents(): void {
    this.studentService.getStudents().subscribe(
      (response: Student[]) => {
        this.students = response;
        console.log(this.students);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddStudent(addForm: NgForm): void {
    this.studentService.addStudent(addForm.value).subscribe(
      (response: Student) => {
        console.log(response);
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
    this.studentService.updateStudent(student).subscribe(
      (response: Student) => {
        console.log(response);
        if (this.students) {
          this.students[index] = response;
          this.disableEditMode();
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteStudent(studentId: number, index: number): void {
    this.studentService.deleteStudent(studentId).subscribe(
      () => {
        console.log("Student deleted successfully.");
        if (this.students) {
          this.students.splice(index, 1);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchStudents(key: string): void {
    const results: Student[] = [];
    if (this.students) {
      for (const student of this.students) {
        if (student.name && student.studentID && student.email && student.department) {
          if (student.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
              student.studentID.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
              student.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
              student.department.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            results.push(student);
          }
        }
      }
    }
    if (results.length === 0 || !key) {
      this.getStudents();
    } else {
      this.students = results;
    }
  }

  public filterByDepartment(department: string): void {
    if (department === '') {
      this.getStudents(); // Ambil semua data jika opsi "All Departments" dipilih
      return;
    }

    // Filter data berdasarkan departemen
    if (this.students) {
      this.students = this.students.filter(student => student.department === department);
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
