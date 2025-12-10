import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolManagementComponent } from './rol-management.component';

describe('RolManagementComponent', () => {
  let component: RolManagementComponent;
  let fixture: ComponentFixture<RolManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
