import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-muhurta',
  templateUrl: './muhurta.component.html',
  styleUrls: ['./muhurta.component.scss'],
})
export class MuhurtaComponent implements OnInit {
  muhurtaForm: FormGroup;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.muhurtaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  onSubmit(): void {
    if (this.muhurtaForm.valid) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to the book component with muhurta category
        this.router.navigate(['/book'], {
          queryParams: { cat: 'muhurta_auspicious' },
        });
      }, 2000);
    }
  }

  get email() {
    return this.muhurtaForm.get('email');
  }

  get phone() {
    return this.muhurtaForm.get('phone');
  }
}
