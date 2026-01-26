import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { ApiResponse } from 'src/app/common/Models/api-response';
import ApiService from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-sign-in',
    standalone:true,
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    imports: [RouterLink]
})
export class SignInComponent implements OnInit {
  private apiService = inject(ApiService);
  constructor(private elementRef: ElementRef, public authservice: AuthService,
     private router: Router, private toastr: ToastrService

  ) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('valexHeader') == 'light') {
      document.querySelector('html')?.setAttribute('data-theme-mode', 'light');
    } else if (localStorage.getItem('valexHeader') == 'dark') {
      document.querySelector('html')?.setAttribute('data-theme-mode', 'dark');
    }
  }

  ngOnDestroy(): void {
    if (localStorage.getItem('valexHeader') == 'light') {
      document.querySelector('html')?.setAttribute('data-theme-mode', 'light');
    } else if (localStorage.getItem('valexHeader') == 'dark') {
      document.querySelector('html')?.setAttribute('data-theme-mode', 'dark');
    }
  }

  login() {
    // this.disabled = "btn-loading"
    // this.clearErrorMessage();
    // if (this.validateForm(this.email, this.password)) {
    const body = {
      username: "string",
      password: "string",
      rememberMe: true
    }
    console.log('login');
this.apiService
      .post<ApiResponse<any>>('Auth/login', body)
      .pipe(
        map((response: ApiResponse<any>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create user';
            throw new Error(msg);
          }
          return response.data;
        })
      ).subscribe((data) => {
        this.apiService.setToken(data.token);
        this.router.navigate(['/dashboard']);
      });
  }
}
