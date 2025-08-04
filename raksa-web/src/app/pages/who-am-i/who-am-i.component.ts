import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.component.html',
  styleUrls: ['./who-am-i.component.scss'],
})
export class WhoAmIComponent implements OnInit {
  whoAmIForm: FormGroup;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.whoAmIForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  onSubmit(): void {
    if (this.whoAmIForm.valid) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to the book component with who_am_i category
        this.router.navigate(['/book'], {
          queryParams: { cat: 'who_am_i' },
        });
      }, 2000);
    }
  }

  get email() {
    return this.whoAmIForm.get('email');
  }

  get phone() {
    return this.whoAmIForm.get('phone');
  }
}
