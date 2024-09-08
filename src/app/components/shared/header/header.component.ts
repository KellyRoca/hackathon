import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  isAuthenticated: boolean = false;
  openMenu: boolean = false;
  isMobile = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  path: string;

  showCategories = false;
  currentCategory: any = null;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.storageService.get('user').subscribe((res) => {
      if(res ==  null){
        this.isAuthenticated = false;
      }else {
        this.isAuthenticated = true;
      }
    })

    this.checkScreenSize();

    this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.isAuthenticated = res;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  logout() {
    // Eliminar el estado de autenticación y cerrar sesión

    // Eliminar el usuario almacenado en el Storage
    this.authService.signOut().then(() => {
      this.router.navigate(['/']);

    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }


  menuOpen = false;

  onMenuToggle() {
    this.openMenu = !this.openMenu;
    const navlinks = document.querySelector(".navLinks");
    if (this.openMenu) {

      document.body.classList.add('openSidebar');
      navlinks.classList.toggle("left-[0%]")
    } else {
      document.body.classList.remove('openSidebar');
      navlinks.classList.remove("left-[0%]")
    }

  }

  goTo(url: string) {
    this.router.navigate([url]);
  }
}
