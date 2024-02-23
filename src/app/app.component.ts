import { Component, OnInit } from '@angular/core';
import { DataService } from './services/dataService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  editMode : boolean=false;

  constructor(private _dataService : DataService){}

  ngOnInit(): void {  
     
  }
}
