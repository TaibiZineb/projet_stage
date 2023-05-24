import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreeationCompteComponent } from './creeation-compte.component';

describe('CreeationCompteComponent', () => {
  let component: CreeationCompteComponent;
  let fixture: ComponentFixture<CreeationCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreeationCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreeationCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
