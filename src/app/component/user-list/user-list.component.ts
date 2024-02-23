import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService } from 'ngx-bootstrap';
import { IuserList } from 'src/app/models/user-model';
import { DataService } from 'src/app/services/dataService';
import { userService } from 'src/app/services/user-service';
import { BsModelComponent } from '../bs-model/bs-model.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['sr.no', 'firstname', 'lastname', 'email', 'edit', 'Delete'];
  dataSource: IuserList[] = [];
  isVisible: boolean = false;
  editMode: boolean = false;
  userList !:IuserList;  

  constructor(private userService: userService,
    private dataService: DataService,
    public modalService: BsModalService,
    public router: Router, public route: ActivatedRoute
  ) { }

  ngAfterViewInit() {}

  ngOnInit(): void {
    this.getUserList();
    this.addSingleUser();
    this.updateUser();
    this.isBtnEdit();
  }

  isBtnEdit() : void{
    this.dataService.isViewEditVisibleAndBtnEditVisible.subscribe((res)=>{
      this.editMode = res;
    })
  }

  updateUser() : void{
   
  }

  addSingleUser(): void {
    this.dataService.getUserList().subscribe((list: IuserList) => {
      this.dataSource.push(list);
      this.dataSource = [...this.dataSource];
    })
  }

  getUserList(): void {
    this.userService.getUsers().subscribe((data: IuserList[]) => {
      this.dataSource = data;
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
    this.userService.deleteUser(Number(element.id)).subscribe((deletedUser: Object) => {
    })
  }

  editUserList(element: any): void {
    this.editMode = true;
    this.userList = element;
    this.dataService.isViewEditVisibleAndBtnEditVisible.next(this.editMode);
  }

}


