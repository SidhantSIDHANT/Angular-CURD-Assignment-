import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable, Subject } from 'rxjs';
import { IuserList } from 'src/app/models/user-model';
import { DataService } from 'src/app/services/dataService';
import { userService } from 'src/app/services/user-service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges, OnDestroy {
  inputAppearance: any = 'fill'
  userForm !: FormGroup;
  isEditVisible !: boolean;

  @Input() userList !: IuserList;
  @Input('modalRef') modalRef !: BsModalRef;
  
  unSubscribe$ = new Subject<void>();
  
  constructor(
    private userService: userService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

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
    })
  }

  createUserListForm(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.required)
    })
  }

  onChanges(element: KeyboardEvent): void {
    const inputElement = (element.target as HTMLInputElement).id;
  }

  onSubmitUserList(): void {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).pipe().subscribe((data: any) => {
        this.dataService.sendToSubscriber(data);
        this.modalRef.hide();
      }, (err) => {
        alert(err);
      })
    }
  }

  updateUsers(): void {
    this.dataService.isViewEditVisibleAndBtnEditVisible.next(false)
    const updateUsers= {...this.userForm.value, id :this.userList.id};
  //  this.userService.usersUpdated(updateUsers);
    this.userService.updateSingleUser(this.userList.id,updateUsers).subscribe((res)=> {console.log(res)},err=>{ alert(err)})
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}


