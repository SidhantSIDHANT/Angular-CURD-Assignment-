import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IuserList } from "../models/user-model";


@Injectable({
    providedIn: 'root'
})
export class userService {
    api: string = `${environment.jsonApi}`;
    updatedUsrList !: IuserList[];

    constructor(private _http: HttpClient) { }

    getUsers(): Observable<IuserList[]> {
        return this._http.get<IuserList[]>(this.api)
    }

    addUser(userListObj: IuserList): Observable<IuserList[]> {
        return this._http.post<IuserList[]>(this.api, userListObj)
    }

    updateUser(): void { }

    deleteUser(id: number): Observable<any> {
        return this._http.delete<any>(`${this.api}/${id}`);
    }

    updateSingleUser(id : any,list : IuserList) : Observable<IuserList>{
        // const header = new HttpHeaders({})
        return this._http.put<IuserList>(this.api + "/" + id, list );
    }

    // usersUpdated(list: any): void {
    //  this.updatedUsrList = list;
    // };
}



