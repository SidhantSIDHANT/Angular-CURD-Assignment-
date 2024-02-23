import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { IuserList } from 'src/app/models/user-model';
import { DataService } from 'src/app/services/dataService';
import { userService } from 'src/app/services/user-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getUserList();
    this.addSingleUser();
    this.isBtnEdit();
  }

  isBtnEdit(): void {
    this.dataService.isViewEditVisibleAndBtnEditVisible.subscribe((res) => {
      this.editMode = res;
    }, (err)=>{
      alert(err)
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
  }

  addSingleUser(): void {
    this.dataService.getUserList().pipe(takeUntil(this.unSubscribe$)).subscribe((list: IuserList) => {
      this.dataSource.push(list);
      this.dataSource = [...this.dataSource];
    }, (err)=>{
      alert(err)
    })
  }

  getUserList(): void {
    this.userService.getUsers().pipe(takeUntil(this.unSubscribe$)).subscribe((data: IuserList[]) => {
      this.dataSource = data;
    }, (err)=>{
      alert(err)
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
    this.deleteUserList(element);
    this.userService.deleteUser(Number(element.id)).pipe(takeUntil(this.unSubscribe$)).subscribe((deletedUser: Object) => {
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


