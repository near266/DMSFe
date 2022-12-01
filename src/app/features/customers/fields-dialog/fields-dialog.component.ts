import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerFields, TypeExport } from 'src/app/core/const/fields_export';

@Component({
  selector: 'app-fields-dialog',
  templateUrl: './fields-dialog.component.html',
  styleUrls: ['./fields-dialog.component.scss']
})
export class FieldsDialogComponent implements OnInit, AfterViewInit {

  fields: TypeExport[];
  selectedFields: string[] = [];

  constructor(public dialogRef: MatDialogRef<FieldsDialogComponent>) { }

  ngOnInit(): void {
    this.fields = CustomerFields;
    this.fields.forEach( field => {
      this.selectedFields.push(field.value);
    });
  }

  ngAfterViewInit(): void {}

  change(id: string) {
    if (this.selectedFields.indexOf(id) > -1) {
      this.selectedFields.splice(this.selectedFields.indexOf(id),1);
    } else {
      this.selectedFields.push(id);
    }
  }

  submit() {
    this.dialogRef.close({event: this.selectedFields});
  }

  close() {
    this.dialogRef.close();
  }
}
