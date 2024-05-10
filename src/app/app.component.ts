import { Component, OnInit, HostListener } from '@angular/core';
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
  public currentPage: number = 1;
  public itemsPerPage: number = 100; // Jumlah data yang ditampilkan per halaman

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.getStudents();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (this.bottomReached()) {
      this.currentPage++;
      this.getStudents();
    }
  }

  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  }

  public getStudents(): void {
    const startIndex = (this.currentPage - 1);
    const limit = this.itemsPerPage;
    this.studentService.getPartialStudents(startIndex, limit).subscribe(
      (response: Student[]) => {
        if (!this.students) {
          this.students = response;
        } else {
          this.students = this.students.concat(response);
        }
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
    const studentId = student.id;
    this.studentService.updateStudent(studentId, student).subscribe(
      (updatedStudent: Student) => {
        console.log("Student updated successfully:", updatedStudent);
        if (this.students) {
          const studentIndex = this.students.findIndex(s => s.id === studentId);
          if (studentIndex !== -1) {
            this.students[studentIndex] = updatedStudent;
          }
          this.disableEditMode();
        }
      },
      (error: HttpErrorResponse) => {
        console.error("Error occurred while updating student:", error.message);
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
      this.getStudents();
      return;
    }
    this.studentService.getStudents().subscribe(
      (response: Student[]) => {
        this.students = response.filter(student => student.department === department);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public confirmDelete(studentId: number, index: number): void {
    const isConfirmed = window.confirm("Are you sure you want to delete this student?");
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
