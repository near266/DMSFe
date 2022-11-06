import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/core/services/customer.service';
import { RouteService } from 'src/app/core/services/route.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as XLSX from 'xlsx';
type AOA = any[][];



@Component({
  selector: 'app-add-cus-from-excel',
  templateUrl: './add-cus-from-excel.component.html',
  styleUrls: ['./add-cus-from-excel.component.scss']
})
export class AddCusFromExcelComponent implements OnInit {

  constructor(
    private customerSer: CustomerService,
    private routeSer: RouteService,
    @Inject(MAT_DIALOG_DATA) public dataDialog:any,
    private snackbar: SnackbarService,
    public materialDialog: MatDialogRef<AddCusFromExcelComponent>) { }
  data: AOA = [[], []];
  dataAfterConvert:any = []
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  isChoose:boolean = false;


  ngOnInit(): void {
    console.log(this.dataDialog.typeRoute);
  }

  onFileChange(evt: any) {
    /* wire up file reader */

    const target: DataTransfer = <DataTransfer>(evt.target);

    // condition
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let dataExcel:any;
      dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      dataExcel.splice(1).forEach((value:any, index:any) => {
        if(value != null && value != undefined && value != ''){
          this.dataAfterConvert.push({ customerCode: value[0]})
        }
      })

      console.log(this.dataAfterConvert);

      this.isChoose = true;
    };
    reader.readAsBinaryString(target.files[0]);
    console.log(reader);
  }

  submit(){
    let body;
    if(this.dataDialog.typeRoute == 'update'){
      body = {
        "list": this.dataAfterConvert,
        "routeId": this.dataDialog.idRoute
      }
      this.routeSer.Import(body).subscribe({
        next: data => {
          this.snackbar.openSnackbar("Thêm khách hàng thành công !", 3000, "", "right", "bottom", true);
        }
      })
    }else{                                // add case
      let listCusTemp:any[] = []
      body = {
        "list": this.dataAfterConvert,
        "routeId": ""
      }
      // let res = {
      //   body: {
      //     "list": 1,
      //     "routeId": ""
      //   },
      //   listCusPreview: listCusTemp
      // }
      this.materialDialog.close(body);
    }

  }

}
