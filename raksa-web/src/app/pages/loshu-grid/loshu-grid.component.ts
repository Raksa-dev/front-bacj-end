import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loshu-grid',
  templateUrl: './loshu-grid.component.html',
  styleUrls: ['./loshu-grid.component.scss'],
})
export class LoshuGridComponent implements OnInit {
  loshuForm: FormGroup;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loshuForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  onSubmit(): void {
    if (this.loshuForm.valid) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to the book component with loshu_grid category
        this.router.navigate(['/book'], {
          queryParams: { cat: 'loshu_grid' },
        });
      }, 2000);
    }
  }

  get email() {
    return this.loshuForm.get('email');
  }

  get phone() {
    return this.loshuForm.get('phone');
  }
}
