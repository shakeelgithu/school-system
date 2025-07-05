import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPromotionComponent } from './class-promotion.component';

describe('ClassPromotionComponent', () => {
  let component: ClassPromotionComponent;
  let fixture: ComponentFixture<ClassPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
