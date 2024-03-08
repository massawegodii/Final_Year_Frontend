import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsNewComponent } from './departments-new.component';

describe('DepartmentsNewComponent', () => {
  let component: DepartmentsNewComponent;
  let fixture: ComponentFixture<DepartmentsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentsNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
