import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualbisComponent } from './visualbis.component';

describe('VisualbisComponent', () => {
  let component: VisualbisComponent;
  let fixture: ComponentFixture<VisualbisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualbisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualbisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
