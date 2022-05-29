import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupTabComponent } from './groupsTab.component';

describe('GroupTabComponent', () => {
  let component: GroupTabComponent;
  let fixture: ComponentFixture<GroupTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
