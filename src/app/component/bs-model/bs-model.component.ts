import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/services/dataService';

@Component({
  selector: 'app-bs-model',
  templateUrl: './bs-model.component.html',
  styleUrls: ['./bs-model.component.scss']
})
export class BsModelComponent implements OnInit {
  modalRef !: BsModalRef;
  @ViewChild("template", { static: false }) template !: any;

  constructor(private modalService: BsModalService,
    private _dataService: DataService
  ) { }

  ngOnInit(): void { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(this.template);
    this._dataService.isViewEditVisibleAndBtnEditVisible.next(false);
  }


}
