import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingManagementComponent } from './incoming-management.component';

describe('IncomingManagementComponent', () => {
  let component: IncomingManagementComponent;
  let fixture: ComponentFixture<IncomingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
