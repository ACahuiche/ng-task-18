import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixErrorsIaComponent } from './fix-errors-ia.component';

describe('FixErrorsIaComponent', () => {
  let component: FixErrorsIaComponent;
  let fixture: ComponentFixture<FixErrorsIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixErrorsIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixErrorsIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
