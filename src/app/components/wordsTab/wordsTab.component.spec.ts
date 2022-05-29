import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordsTabComponent } from './wordsTab.component';

describe('WordsTabComponent', () => {
  let component: WordsTabComponent;
  let fixture: ComponentFixture<WordsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordsTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
