import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStatusComponent } from './delete-status.component';

describe('DeleteStatusComponent', () => {
  let component: DeleteStatusComponent;
  let fixture: ComponentFixture<DeleteStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
