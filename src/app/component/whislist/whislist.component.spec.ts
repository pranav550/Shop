import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhislistComponent } from './whislist.component';

describe('WhislistComponent', () => {
  let component: WhislistComponent;
  let fixture: ComponentFixture<WhislistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhislistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhislistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
