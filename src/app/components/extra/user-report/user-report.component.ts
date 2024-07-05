import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/user.service';
import { User } from '../../../_model/users_model';
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrl: './user-report.component.scss',
})
export class UserReportComponent implements OnInit {
  constructor(private userServices: UserService) {}

  displayedColumns: string[] = [
    'username',
    'photo',
    'first name',
    'email',
    'last name',
    'phone',
    'role',
  ];
  userDetails: User[] = [];

  ngOnInit(): void {
    this.getAllUsers();
    document.getElementById('exportButton')?.addEventListener('click', () => this.exportToExcel());
  }

  public getAllUsers() {
    this.userServices.getAllUsers().subscribe(
      (resp) => {
        console.log(resp);
        this.userDetails = resp.map((user) => ({
          ...user,
          roleName: user.role.map((r) => r.roleName).join(', '),
        }));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.userDetails.map(user => ({
      Username: user.userName,
      'First Name': user.userFirstName,
      'Last Name': user.userLastName,
      Email: user.email,
      Phone: user.phoneNumber,
      Role: user.roleName
    })));
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'employee_report');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, `${fileName}_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
