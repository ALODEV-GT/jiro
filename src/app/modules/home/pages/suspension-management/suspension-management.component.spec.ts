import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensionManagementComponent } from './suspension-management.component';

describe('SuspensionManagementComponent', () => {
  let component: SuspensionManagementComponent;
  let fixture: ComponentFixture<SuspensionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspensionManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuspensionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
