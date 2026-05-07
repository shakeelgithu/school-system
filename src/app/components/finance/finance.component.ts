import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  FinanceService, Teacher, SalaryPayment, Expense, FeeCollection
} from '../../services/finance.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SidebarComponent],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  providers: [FinanceService, StudentService]
})
export class FinanceComponent implements OnInit {

  activeTab = 'overview';
  loading = false;

  teachers: Teacher[] = [];
  salaries: SalaryPayment[] = [];
  expenses: Expense[] = [];
  fees: FeeCollection[] = [];
  students: any[] = [];
  summary: any = null;

  selectedMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  selectedYear = new Date().getFullYear();
  availableYears = [2023, 2024, 2025, 2026];
  months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' },   { value: '04', label: 'April' },
    { value: '05', label: 'May' },     { value: '06', label: 'June' },
    { value: '07', label: 'July' },    { value: '08', label: 'August' },
    { value: '09', label: 'September' },{ value: '10', label: 'October' },
    { value: '11', label: 'November' },{ value: '12', label: 'December' }
  ];

  // Modals
  showTeacherModal = false;
  showSalaryModal = false;
  showExpenseModal = false;
  showFeeModal = false;
  isEditMode = false;
  editingId = '';

  // Forms
  teacherForm: Teacher = this.emptyTeacher();
  salaryForm: any = this.emptySalary();
  expenseForm: Expense = this.emptyExpense();
  feeForm: any = this.emptyFee();

  constructor(
    private financeService: FinanceService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadAll();
    console.log(this.fees, "fees")
  }

  loadAll() {
    this.loading = true;
    this.financeService.getTeachers().subscribe(d => { this.teachers = d; this.loading = false; });
    this.financeService.getSalaries().subscribe(d => this.salaries = d);
    this.financeService.getExpenses().subscribe(d => this.expenses = d);
    this.financeService.getFees().subscribe(d => this.fees = d);
    this.studentService.getStudents().subscribe(d => this.students = d);
  }

  loadSummary() {
    this.financeService.getSummary(this.selectedMonth, this.selectedYear)
      .subscribe(d => this.summary = d);
  }

  get totalFeeIncome() { return this.fees.reduce((s, f) => s + f.amount, 0); }
  get totalSalaries() { return this.salaries.reduce((s, p) => s + p.netPaid, 0); }
  get totalExpenses() { return this.expenses.reduce((s, e) => s + e.amount, 0); }
  get netBalance() { return this.totalFeeIncome - this.totalSalaries - this.totalExpenses; }

  openAddTeacher() { this.teacherForm = this.emptyTeacher(); this.isEditMode = false; this.showTeacherModal = true; }
  openEditTeacher(t: Teacher) {
    this.teacherForm = { ...t, joiningDate: t.joiningDate?.split('T')[0] };
    this.isEditMode = true; this.editingId = t._id!; this.showTeacherModal = true;
  }
  saveTeacher() {
    if (this.isEditMode) {
      this.financeService.updateTeacher(this.editingId, this.teacherForm).subscribe(() => {
        this.financeService.getTeachers().subscribe(d => this.teachers = d);
        this.showTeacherModal = false;
      });
    } else {
      this.financeService.createTeacher(this.teacherForm).subscribe(() => {
        this.financeService.getTeachers().subscribe(d => this.teachers = d);
        this.showTeacherModal = false;
      });
    }
  }
  deleteTeacher(id: string) {
    if (confirm('Delete this teacher?')) {
      this.financeService.deleteTeacher(id).subscribe(() =>
        this.financeService.getTeachers().subscribe(d => this.teachers = d));
    }
  }

  openAddSalary(teacher?: Teacher) {
    this.salaryForm = this.emptySalary();
    if (teacher) {
      this.salaryForm.teacher = teacher._id;
      this.salaryForm.amount = teacher.monthlySalary;
      this.salaryForm.netPaid = teacher.monthlySalary;
    }
    this.showSalaryModal = true;
  }
  onSalaryTeacherChange() {
    const t = this.teachers.find(t => t._id === this.salaryForm.teacher);
    if (t) { this.salaryForm.amount = t.monthlySalary; this.calcNetPaid(); }
  }
  calcNetPaid() {
    this.salaryForm.netPaid = this.salaryForm.amount - (this.salaryForm.advance || 0) - (this.salaryForm.deduction || 0);
  }
  saveSalary() {
    this.financeService.createSalary(this.salaryForm).subscribe(() => {
      this.financeService.getSalaries().subscribe(d => this.salaries = d);
      this.showSalaryModal = false;
    });
  }
  deleteSalary(id: string) {
    if (confirm('Delete this payment?')) {
      this.financeService.deleteSalary(id).subscribe(() =>
        this.financeService.getSalaries().subscribe(d => this.salaries = d));
    }
  }

  openAddExpense() { this.expenseForm = this.emptyExpense(); this.isEditMode = false; this.showExpenseModal = true; }
  openEditExpense(e: Expense) {
    this.expenseForm = { ...e, date: e.date?.split('T')[0] };
    this.isEditMode = true; this.editingId = e._id!; this.showExpenseModal = true;
  }
  saveExpense() {
    if (this.isEditMode) {
      this.financeService.updateExpense(this.editingId, this.expenseForm).subscribe(() => {
        this.financeService.getExpenses().subscribe(d => this.expenses = d);
        this.showExpenseModal = false;
      });
    } else {
      this.financeService.createExpense(this.expenseForm).subscribe(() => {
        this.financeService.getExpenses().subscribe(d => this.expenses = d);
        this.showExpenseModal = false;
      });
    }
  }
  deleteExpense(id: string) {
    if (confirm('Delete this expense?')) {
      this.financeService.deleteExpense(id).subscribe(() =>
        this.financeService.getExpenses().subscribe(d => this.expenses = d));
    }
  }

  openAddFee() { this.feeForm = this.emptyFee(); this.showFeeModal = true; }
  saveFee() {
    this.financeService.createFee(this.feeForm).subscribe(() => {
      this.financeService.getFees().subscribe(d => this.fees = d);
      this.showFeeModal = false;
    });
  }
  deleteFee(id: string) {
    if (confirm('Delete this fee record?')) {
      this.financeService.deleteFee(id).subscribe(() =>
        this.financeService.getFees().subscribe(d => this.fees = d));
    }
  }

  printReport() {
    window.print();
  }

  getMonthLabel(val: string) {
    return this.months.find(m => m.value === val)?.label || val;
  }
  formatCurrency(amount: number) {
    return 'PKR ' + (amount || 0).toLocaleString();
  }
  formatDate(d: string) {
    return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  }

  emptyTeacher(): Teacher {
    return { name: '', subject: '', phone: '', email: '', monthlySalary: 0, joiningDate: '', status: 'Active' };
  }
  emptySalary() {
    return {
      teacher: '', month: this.selectedMonth, year: this.selectedYear,
      amount: 0, advance: 0, deduction: 0, netPaid: 0,
      paidOn: new Date().toISOString().split('T')[0], note: '', status: 'Paid'
    };
  }
  emptyExpense(): Expense {
    return { title: '', category: 'Utilities', amount: 0, date: new Date().toISOString().split('T')[0], description: '', paidTo: '' };
  }
  emptyFee() {
    return {
      student: '', month: this.selectedMonth, year: this.selectedYear,
      amount: 0, paidOn: new Date().toISOString().split('T')[0],
      receivedBy: '', note: '', status: 'Paid'
    };
  }
}