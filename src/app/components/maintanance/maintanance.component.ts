import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaintenanceService } from '../../_services/maintenance.service';
import { GlobalConstant } from '../../_constants/global-constant';
import { AlertService } from '../../_services/alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maintanance',
  templateUrl: './maintanance.component.html',
  styleUrl: './maintanance.component.scss',
})
export class MaintananceComponent implements OnInit {
  responseMessage: any;
  maintenanceForm: any = FormGroup;
  events: EventInput[] = [];
  alertMessage!: string;

  constructor(
    private fb: FormBuilder,
    private mantainanceService: MaintenanceService,
    private toastr: ToastrService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllSchedule();
    this.setDefaultDate();

    this.alertService.getAlertMessage().subscribe((message) => {
      this.alertMessage = message;
      console.log(this.alertMessage);
    });
  }

  initializeForm(): void {
    this.maintenanceForm = this.fb.group({
      selectedDate: [''],
      selectedTime: [''],
      note: [''],
    });
  }

  setDefaultDate(): void {
    const today = new Date();
    this.maintenanceForm.patchValue({
      selectedDate: today,
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    datesSet: this.handleDateClick.bind(this),
    events: this.events,
    eventContent: this.renderEvent.bind(this),
  };

  renderEvent(info: any) {
    const eventEl = document.createElement('div');
    eventEl.innerHTML = `<span style="background-color: #ff9999; font-size: 14px;
    color: ${info.event.backgroundColor}; padding: 2vw; border-radius: 8px;
     width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
     ${info.event.title}</span>`;
    return { domNodes: [eventEl] };
  }

  handleDateClick(arg: any) {
    const view = arg.view;
    const date = arg.start;

    if (date) {
      switch (view.type) {
        case 'dayGridMonth':
          // Show month view
          this.calendarOptions.initialView = 'dayGridMonth';
          break;
        case 'timeGridWeek':
          // Show week view
          this.calendarOptions.initialView = 'timeGridWeek';
          break;
        case 'timeGridDay':
          // Show day view
          this.calendarOptions.initialView = 'timeGridDay';
          break;
        default:
          // Default to month view
          this.calendarOptions.initialView = 'dayGridMonth';
          break;
      }

      // Filter events for the selected date
      const selectedDateEvents = this.events.filter((event) => {
        const eventDate =
          event.start instanceof Date ? new Date(event.start) : null;
        return (
          eventDate &&
          eventDate.getFullYear() === date.getFullYear() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getDate() === date.getDate()
        );
      });

      // Update the events to be displayed
      this.calendarOptions = {
        ...this.calendarOptions,
        events: selectedDateEvents,
      };
    }
  }

  onSubmit() {
    if (this.maintenanceForm.valid) {
      const selectedDate = this.maintenanceForm.value.selectedDate;
      const note = this.maintenanceForm.value.note;
      const selectedTime = this.maintenanceForm.value.selectedTime;

      const data = {
        selectedDate: selectedDate.toISOString().slice(0, 10),
        selectedTime: selectedTime.slice(0, 5),
        note: note,
      };

      this.events.push(data);
      this.calendarOptions = { ...this.calendarOptions, events: this.events };

      this.mantainanceService.addMaintanance(data).subscribe(
        (response: any) => {
          this.maintenanceForm.reset();
          this.getAllSchedule();
          this.setDefaultDate();
          this.responseMessage = response?.message;
          this.toastr.success('Maintenance Schedule added successfully.');
          window.location.reload();
        },
        (error) => {
          if (error.error?.message) {
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstant.genericError;
          }
          this.toastr.error(this.responseMessage, GlobalConstant.error);
        }
      );
    } else {
      this.maintenanceForm.markAllAsTouched();
      // console.log('Form submission failed');
    }
  }

  getAllSchedule() {
    this.mantainanceService.getAllSechedule().subscribe(
      (response: any) => {
        this.events = response.map((event: any) => ({
          title: event.note,
          start: new Date(event.selectedDate + 'T' + event.selectedTime),
        }));
        this.calendarOptions.events = this.events;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  closeAlert() {
    this.alertMessage = '';
  }
}
