import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { IuserList } from 'src/app/models/user-model';
import { DataService } from 'src/app/services/dataService';
import { userService } from 'src/app/services/user-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackBarSerice } from 'src/app/services/snackBarService';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['sr.no', 'firstname', 'lastname', 'email', 'edit', 'Delete'];
  dataSource: IuserList[] = [];
  isVisible: boolean = false;
  editMode: boolean = false;
  userList !: IuserList;
  unSubscribe$: Subject<void> = new Subject<void>();

  constructor(private userService: userService,
    private dataService: DataService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBarSerice: SnackBarSerice,
  ) { }

  ngOnInit(): void {
    this.getUserList();
    this.addSingleUser();
    this.isBtnEdit();
  }

  isBtnEdit(): void {
    this.dataService.isViewEditVisibleAndBtnEditVisible.subscribe((res) => {
      this.editMode = res;
    }, (err) => {
      this.snackBarSerice.openSnackBar("Message", err, 9000, 'top', 'center')
    })
  }

  updateUser(list: IuserList): void {
    this.dataSource.forEach((item: IuserList) => {
      if (list.id == item.id) {
        item.firstName = list.firstName;
        item.lastName = list.lastName;
        item.email = list.email
      }
    })
    this.snackBarSerice.openSnackBar("Message", "Updated", 9000, 'top', 'center')
    
  }

  addSingleUser(): void {
    this.dataService.getUserList().pipe(takeUntil(this.unSubscribe$)).subscribe((list: IuserList) => {
      this.dataSource.push(list);
      this.dataSource = [...this.dataSource];
    }, (err) => {
      this.snackBarSerice.openSnackBar("Message", err, 9000, 'top', 'center')
    })
  }

  getUserList(): void {
    this.userService.getUsers().pipe(takeUntil(this.unSubscribe$)).subscribe((data: IuserList[]) => {
      this.dataSource = data;
    }, (err) => {
      this.snackBarSerice.openSnackBar("Message", err, 9000, 'top', 'center')
    })
  }

  deleteUserList(list: IuserList): void {
    const findIndex = this.dataSource.findIndex((item) => {
      return item.id == list.id;
    })
    this.dataSource.splice(findIndex, 1);
    this.dataSource = [...this.dataSource]
  }

  onDeleteUserList(element: IuserList): void {
    this.snackBarSerice.openSnackBar("Message", "Deleted", 9000, 'center', 'top')
    this.deleteUserList(element);
    this.userService.deleteUser(Number(element.id)).pipe(takeUntil(this.unSubscribe$)).subscribe((deletedUser: Object) => {
    }, (err) => {
      this.snackBarSerice.openSnackBar("Message", err, 9000, 'center', 'top')
    })
  }

  editUserList(element: any): void {
    this.editMode = true;
    this.userList = element;
    this.dataService.isViewEditVisibleAndBtnEditVisible.next(this.editMode);
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}


