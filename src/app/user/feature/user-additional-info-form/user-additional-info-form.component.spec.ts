import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdditionalInfoFormComponent } from './user-additional-info-form.component';

describe('UserAdditionalInfoFormComponent', () => {
  let component: UserAdditionalInfoFormComponent;
  let fixture: ComponentFixture<UserAdditionalInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAdditionalInfoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAdditionalInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
