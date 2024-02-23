import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { IuserList } from "../models/user-model";


@Injectable({
    providedIn: 'root'
})
export class DataService {
    userObject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    isViewEditVisibleAndBtnEditVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() { }

    sendToSubscriber(list: IuserList): any {
        return this.userObject.next(list);
    }

    getUserList(): Observable<IuserList> {
        return this.userObject.asObservable();
    }

}