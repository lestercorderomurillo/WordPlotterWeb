import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsTabComponent } from './optionsTab.component';

describe('OptionsTabComponent', () => {
  let component: OptionsTabComponent;
  let fixture: ComponentFixture<OptionsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionsTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
