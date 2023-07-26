import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CVtemplateComponent } from './cvtemplate.component';

describe('CVtemplateComponent', () => {
  let component: CVtemplateComponent;
  let fixture: ComponentFixture<CVtemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CVtemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CVtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
