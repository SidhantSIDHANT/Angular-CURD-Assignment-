import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";


@Injectable({
    providedIn: 'root'
})
export class SnackBarSerice {

    constructor(private _snackBar: MatSnackBar) { }

    openSnackBar(message: string, data: any, duration: number, positionHorizontla: any, positionVertical: string): void {
        this._snackBar.open(message, data, {
            duration: duration,
            horizontalPosition: positionHorizontla,
            verticalPosition: positionHorizontla
        })
    }

}