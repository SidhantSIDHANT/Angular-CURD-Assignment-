import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable, Subject } from 'rxjs';
import { IuserList } from 'src/app/models/user-model';
import { DataService } from 'src/app/services/dataService';
import { userService } from 'src/app/services/user-service';
import { EventEmitter } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SnackBarSerice } from 'src/app/services/snackBarService';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm !: FormGroup;
  isEditVisible !: boolean;
  unSubscribe$: Subject<void> = new Subject<void>();

  @Input() userList !: IuserList;
  @Input('modalRef') modalRef !: BsModalRef;
  @Output() userEvent = new EventEmitter<IuserList>();

  constructor(
    private userService: userService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarSerice: SnackBarSerice,
  ) { }

  ngOnInit(): void {
    this.createUserListForm();
    this.updateBtnIsVisible();
    this.patchUsersListValue();
  }

  patchUsersListValue(): void {
    this.userForm.patchValue({
      firstName: this.userList?.firstName,
      lastName: this.userList?.lastName,
      email: this.userList?.email,
    })
  }

  updateBtnIsVisible() {
    this.dataService.isViewEditVisibleAndBtnEditVisible.subscribe((isVisble: boolean) => {
      this.isEditVisible = isVisble;
    }, (err) => {
      this.snackBarSerice.openSnackBar("Message", err, 9000, 'top', 'center')
    })
  }

  createUserListForm(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.required)
    })
  }

  onSubmitUserList(): void {
    if (this.userForm.valid) {
      this.snackBarSerice.openSnackBar("Message", 'table Updated', 9000, 'left', 'center')
      this.userService.addUser(this.userForm.value).pipe(takeUntil(this.unSubscribe$)).subscribe((data: any) => {
        this.dataService.sendToSubscriber(data);
        this.modalRef.hide();
      }, (err) => {
        this.snackBarSerice.openSnackBar("Message", err, 9000, 'top', 'center')
      })
    }
  }

  updateUsers(): void {
    this.dataService.isViewEditVisibleAndBtnEditVisible.next(false)
    const updateUsers = { ...this.userForm.value, id: this.userList.id };
    this.userEvent.emit(updateUsers)
    this.userService.updateSingleUser(this.userList.id, updateUsers).pipe(takeUntil(this.unSubscribe$)).subscribe((res) => { console.log(res) }, err => {
      this.snackBarSerice.openSnackBar("Message", err, 9000, 'top', 'center')
    })
  }

  cancel(): void {
    this.dataService.isViewEditVisibleAndBtnEditVisible.next(false)
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}


