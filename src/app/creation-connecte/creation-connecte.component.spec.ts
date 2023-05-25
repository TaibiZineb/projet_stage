import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationConnecteComponent } from './creation-connecte.component';

describe('CreationConnecteComponent', () => {
  let component: CreationConnecteComponent;
  let fixture: ComponentFixture<CreationConnecteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationConnecteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationConnecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
