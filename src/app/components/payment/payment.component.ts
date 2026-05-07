
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Fee, FeeFilters, FeeService, StudentSuggestion } from '../../services/fee.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  fees: Fee[] = [];
  summary = {
    totalRecords: 0,
    totalFeeAmount: 0,
    totalSubmitted: 0,
    totalPending: 0,
    completeCount: 0,
    pendingCount: 0,
  };
  isLoading = false;

  feeForm!: FormGroup;
  showForm = false;
  isEditing = false;
  isSubmitting = false;
  editingId: string | null = null;


  studentSuggestions: StudentSuggestion[] = [];
  isSearchingStudents = false;
  selectedStudent: StudentSuggestion | null = null;
  showSuggestions = false;

  /** Subject that drives the debounced student search */
  private studentSearch$ = new Subject<string>();


  filters: FeeFilters = {};
  searchQuery = '';


  deletingId: string | null = null;
  toast: { type: 'success' | 'error'; message: string } | null = null;

  private destroy$ = new Subject<void>();


  constructor(private feeService: FeeService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.initStudentSearch();
    this.loadFees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  initForm(): void {
    this.feeForm = this.fb.group({
      studentSearch:  ['', Validators.required],
      studentId:      ['', Validators.required], 
      studentName:    [''], 
      rollNumber:     [''],  

      className:    ['', Validators.required],
      totalFee:     ['', [Validators.required, Validators.min(0)]],
      submittedFee: [0,  [Validators.required, Validators.min(0)]],
      feePeriod:    ['', Validators.required],
      notes:        [''],
    });

    this.feeForm.get('submittedFee')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.validateSubmittedFee());

    this.feeForm.get('totalFee')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.validateSubmittedFee());
  }


  initStudentSearch(): void {
    this.studentSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((q) => q.trim().length >= 1),
        switchMap((q) => {
          this.isSearchingStudents = true;
          return this.feeService.searchStudents(q);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.studentSuggestions = res.success && res.data ? res.data : [];
          this.showSuggestions = this.studentSuggestions.length > 0;
          this.isSearchingStudents = false;
        },
        error: () => {
          this.studentSuggestions = [];
          this.isSearchingStudents = false;
        },
      });
  }

  onStudentSearchInput(value: string): void {
    if (this.selectedStudent && value !== this.selectedStudent.name) {
      this.clearSelectedStudent();
    }
    this.studentSearch$.next(value);
  }

  selectStudent(student: StudentSuggestion): void {
    this.selectedStudent = student;
    this.showSuggestions = false;
    this.studentSuggestions = [];

    this.feeForm.patchValue({
      studentSearch: student.name,
      studentId:     student._id,
      studentName:   student.name,
      rollNumber:    student.rollNumber,
      className: this.feeForm.get('className')?.value || student.className || '',
    });
  }

  clearSelectedStudent(): void {
    this.selectedStudent = null;
    this.feeForm.patchValue({ studentId: '', studentName: '', rollNumber: '' });
  }

  onStudentBlur(): void {
    setTimeout(() => { this.showSuggestions = false; }, 180);
  }


  get liveTotal(): number     { return Number(this.feeForm.get('totalFee')?.value || 0); }
  get liveSubmitted(): number { return Number(this.feeForm.get('submittedFee')?.value || 0); }
  get livePending(): number   { return Math.max(0, this.liveTotal - this.liveSubmitted); }
  get liveStatus(): 'Complete' | 'Pending' {
    return this.livePending === 0 && this.liveTotal > 0 ? 'Complete' : 'Pending';
  }


  validateSubmittedFee(): void {
    const total     = Number(this.feeForm.get('totalFee')?.value || 0);
    const submitted = Number(this.feeForm.get('submittedFee')?.value || 0);
    const ctrl      = this.feeForm.get('submittedFee');
    if (submitted > total) {
      ctrl?.setErrors({ exceedsTotal: true });
    } else {
      const errors = { ...ctrl?.errors };
      delete errors['exceedsTotal'];
      ctrl?.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  isInvalid(control: string): boolean {
    const c = this.feeForm.get(control);
    return !!(c?.invalid && c.touched);
  }

  loadFees(): void {
    this.isLoading = true;
    this.feeService
      .getAllFees(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.fees    = res.data.fees;
            this.summary = res.data.summary;
          }
          this.isLoading = false;
        },
        error: () => {
          this.showToast('error', 'Failed to load fee records.');
          this.isLoading = false;
        },
      });
  }


  onSubmit(): void {
    if (this.feeForm.invalid) {
      this.feeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { studentSearch, ...formRaw } = this.feeForm.value;
    const payload: Partial<Fee> = {
      studentId:    formRaw.studentId,
      studentName:  formRaw.studentName || this.selectedStudent?.name,
      rollNumber:   formRaw.rollNumber|| this.selectedStudent?.rollNumber,
      className:    formRaw.className,
      totalFee:     Number(formRaw.totalFee),
      submittedFee: Number(formRaw.submittedFee),
      feePeriod:    formRaw.feePeriod,
      notes:        formRaw.notes || '',
    };

    const request$ = this.isEditing && this.editingId
      ? this.feeService.updateFee(this.editingId, payload)
      : this.feeService.createFee(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast('success', this.isEditing ? 'Fee record updated!' : 'Fee record added!');
          this.closeForm();
          this.loadFees();
        } else {
          this.showToast('error', res.message);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.showToast('error', err?.error?.message || 'Something went wrong.');
        this.isSubmitting = false;
      },
    });
  }

  openAddForm(): void {
    this.isEditing = false;
    this.editingId = null;
    this.selectedStudent = null;
    this.studentSuggestions = [];
    this.feeForm.reset({ submittedFee: 0 });
    this.showForm = true;
  }

  openEditForm(fee: Fee): void {
    this.isEditing  = true;
    this.editingId  = fee._id!;
    const studentId = typeof fee.student === 'object' ? (fee.student as StudentSuggestion)._id : (fee.student || '');

    this.selectedStudent = { _id: studentId as string, name: fee.studentName, rollNumber: fee.rollNumber };

    this.feeForm.patchValue({
      studentSearch: fee.studentName,
      studentId,
      studentName:   fee.studentName,
      rollNumber:    fee.rollNumber,
      className:     fee.className,
      totalFee:      fee.totalFee,
      submittedFee:  fee.submittedFee,
      feePeriod:     fee.feePeriod,
      notes:         fee.notes || '',
    });

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm    = false;
    this.isEditing   = false;
    this.editingId   = null;
    this.selectedStudent    = null;
    this.studentSuggestions = [];
    this.showSuggestions    = false;
    this.feeForm.reset({ submittedFee: 0 });
  }

  confirmDelete(id: string): void { this.deletingId = id; }
  cancelDelete():           void  { this.deletingId = null; }

  onDelete(): void {
    if (!this.deletingId) return;
    this.feeService
      .deleteFee(this.deletingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) { this.showToast('success', 'Fee record deleted.'); this.loadFees(); }
          this.deletingId = null;
        },
        error: () => {
          this.showToast('error', 'Failed to delete record.');
          this.deletingId = null;
        },
      });
  }


  onSearch(value: string): void {
    this.filters.search = value || undefined;
    this.loadFees();
  }

  onFilterChange(key: keyof FeeFilters, value: string): void {
    (this.filters as any)[key] = value || undefined;
    this.loadFees();
  }

  clearFilters(): void {
    this.filters     = {};
    this.searchQuery = '';
    this.loadFees();
  }

  printStudentSlip(fee: Fee): void {
    const pendingDues = Math.max(0, fee.totalFee - fee.submittedFee);
    const status      = pendingDues === 0 && fee.totalFee > 0 ? 'Complete' : 'Pending';
    const printDate   = new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });
    const collectRate = fee.totalFee > 0 ? ((fee.submittedFee / fee.totalFee) * 100).toFixed(1) : '0';
    const fillWidth   = fee.totalFee > 0 ? Math.min(100, (fee.submittedFee / fee.totalFee) * 100).toFixed(1) : '0';

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Fee Slip — ${fee.studentName}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;padding:40px;color:#1a1a2e;background:#f0f2f5}.slip{max-width:620px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.12)}.slip-header{background:linear-gradient(135deg,#1a1a2e,#16213e);color:white;padding:28px 32px;display:flex;justify-content:space-between;align-items:center}.slip-header-left h1{font-size:22px;font-weight:700;letter-spacing:1.5px;margin-bottom:4px}.slip-header-left p{font-size:12px;opacity:.6;letter-spacing:.5px}.status-badge{padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:${status==='Complete'?'#22c55e':'#ef4444'};color:white}.slip-meta{background:#f8f9fa;padding:10px 32px;font-size:12px;color:#888;border-bottom:1px solid #eee;display:flex;justify-content:space-between}.slip-body{padding:28px 32px}.section-title{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:14px;padding-bottom:8px;border-bottom:1px dashed #e0e0e0}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 32px;margin-bottom:28px}.info-item label{font-size:10px;color:#aaa;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.8px}.info-item span{font-size:15px;font-weight:600;color:#1a1a2e}.fee-breakdown{background:#f8f9fa;border-radius:8px;padding:4px 0;margin-bottom:28px;border:1px solid #eee}.fee-row{display:flex;justify-content:space-between;align-items:center;padding:12px 20px;font-size:14px;border-bottom:1px solid #eee}.fee-row:last-child{border-bottom:none}.fee-row .label{color:#555}.fee-row .amount{font-weight:600}.fee-row.total{background:#1a1a2e;color:white;border-radius:0 0 6px 6px}.fee-row.total .label{color:rgba(255,255,255,.7);font-weight:600}.fee-row.total .amount{color:white;font-size:16px}.fee-row.paid .amount{color:#16a34a}.fee-row.due .amount{color:#dc2626}.progress-wrap{margin-bottom:28px}.progress-label{display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:6px}.progress-bar{height:8px;background:#eee;border-radius:4px;overflow:hidden}.progress-fill{height:100%;border-radius:4px;background:${status==='Complete'?'#22c55e':'#4f6ef7'};width:${fillWidth}%}.notes-box{background:#fffbea;border-left:3px solid #f59e0b;padding:12px 16px;font-size:13px;border-radius:0 6px 6px 0;color:#555;line-height:1.5}.slip-footer{text-align:center;padding:16px 32px;font-size:11px;color:#bbb;border-top:1px solid #eee;letter-spacing:.3px}@media print{body{padding:0;background:white}.slip{border-radius:0;box-shadow:none;max-width:100%}}</style>
    </head><body><div class="slip">
    <div class="slip-header"><div class="slip-header-left"><h1>💳 FEE SLIP</h1><p>OFFICIAL PAYMENT RECEIPT</p></div><span class="status-badge">${status}</span></div>
    <div class="slip-meta"><span>Printed: ${printDate}</span><span>Roll No: ${fee.rollNumber}</span></div>
    <div class="slip-body">
      <p class="section-title">Student Information</p>
      <div class="info-grid">
        <div class="info-item"><label>Student Name</label><span>${fee.studentName}</span></div>
        <div class="info-item"><label>Roll Number</label><span>${fee.rollNumber}</span></div>
        <div class="info-item"><label>Class</label><span>${fee.className}</span></div>
        <div class="info-item"><label>Fee Period</label><span>${fee.feePeriod}</span></div>
      </div>
      <p class="section-title">Fee Breakdown</p>
      <div class="fee-breakdown">
        <div class="fee-row"><span class="label">Total Fee Assigned</span><span class="amount">PKR ${fee.totalFee.toLocaleString()}</span></div>
        <div class="fee-row paid"><span class="label">Amount Submitted</span><span class="amount">PKR ${fee.submittedFee.toLocaleString()}</span></div>
        <div class="fee-row due"><span class="label">Pending Dues</span><span class="amount">PKR ${pendingDues.toLocaleString()}</span></div>
        <div class="fee-row total"><span class="label">Collection Rate</span><span class="amount">${collectRate}%</span></div>
      </div>
      <div class="progress-wrap">
        <div class="progress-label"><span>Payment Progress</span><span>${collectRate}% collected</span></div>
        <div class="progress-bar"><div class="progress-fill"></div></div>
      </div>
      ${fee.notes ? `<p class="section-title">Remarks</p><div class="notes-box">${fee.notes}</div>` : ''}
    </div>
    <div class="slip-footer">This is a system-generated fee slip &nbsp;•&nbsp; No signature required &nbsp;•&nbsp; Keep for your records</div>
    </div><script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script></body></html>`;

    const win = window.open('', '_blank', 'width=750,height=650');
    if (win) { win.document.write(html); win.document.close(); }
  }


  showToast(type: 'success' | 'error', message: string): void {
    this.toast = { type, message };
    setTimeout(() => (this.toast = null), 3500);
  }

  trackByFee(_: number, fee: Fee): string { return fee._id!; }
}