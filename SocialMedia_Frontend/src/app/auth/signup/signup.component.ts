import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SignupRequestPayload } from './singup-request.payload';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';  
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
onSubmit() {
throw new Error('Method not implemented.');
}
  signupRequestPayload!: SignupRequestPayload;
  signUpForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupRequestPayload = { username: '', email: '', password: '' };
  }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  signup() {
    if (this.signUpForm.invalid) {
      this.toastr.error('Please fill all fields correctly.');
      return;
    }

    this.signupRequestPayload = this.signUpForm.value;

    this.authService.signup(this.signupRequestPayload).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
        this.toastr.success('Registration Successful! Please login.');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Registration Failed! Please try again.');
      },
    });
  }
}
