import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePokemonComponent } from './choose-pokemon.component';

describe('ChoosePokemonComponent', () => {
  let component: ChoosePokemonComponent;
  let fixture: ComponentFixture<ChoosePokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoosePokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
