import { Component, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SharedService } from './shared/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'GPFrontend';
  clickEventsubscription: Subscription;

  constructor(private _router: Router, private _shared: SharedService) {
    this.clickEventsubscription = this._shared.getClickEvent().subscribe(() => {
      //this.supportDarkMode();
      if (window.localStorage.getItem('darkmode') == 'light') {
        this.removeDarkMode();
      } else {
        this.addDarkMode();
      }
    });

    // this._router.events
    // .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    // .subscribe(event => {
    //   if (
    //     event.id === 1 &&
    //     event.url === event.urlAfterRedirects
    //   ) {
    //     //this.supportDarkMode();
    //     if (window.localStorage.getItem('darkmode') == 'light') {
    //       this.removeDarkMode();
    //     } else {
    //       this.addDarkMode();
    //     }
    //   }
    // })
  }

  ngOnInit(): void {
    // window.localStorage.setItem('darkmode', 'light');
  }

  ngAfterViewChecked(): void {
    this.darkElements1 = document.querySelectorAll('.dark-mode-1');
    this.darkElements2 = document.querySelectorAll('.dark-mode-2');
    this.lighTexts = document.querySelectorAll('.light-text');
    this.borders = document.querySelectorAll('.border');
  }

  darkElements1: NodeListOf<Element>;
  darkElements2: NodeListOf<Element>;
  lighTexts: NodeListOf<Element>;
  borders: NodeListOf<Element>;

  // supportDarkMode() {
  //   Array.from(this.darkElements1).map((darkEl1) =>
  //     darkEl1.classList.toggle('dark-1')
  //   );
  //   Array.from(this.darkElements2).map((darkEl2) =>
  //     darkEl2.classList.toggle('dark-2')
  //   );
  //   Array.from(this.lighTexts).map((lighText) =>
  //     lighText.classList.toggle('light')
  //   );
  //   Array.from(this.borders).map((border) =>
  //     border.classList.toggle('border-color')
  //   );
  // }

  addDarkMode() {
    Array.from(this.darkElements1).map((darkEl1) =>
      darkEl1.classList.add('dark-1')
    );
    Array.from(this.darkElements2).map((darkEl2) =>
      darkEl2.classList.add('dark-2')
    );
    Array.from(this.lighTexts).map((lighText) =>
      lighText.classList.add('light')
    );
    Array.from(this.borders).map((border) =>
      border.classList.add('border-color')
    );
  }

  removeDarkMode() {
    Array.from(this.darkElements1).map((darkEl1) =>
      darkEl1.classList.remove('dark-1')
    );
    Array.from(this.darkElements2).map((darkEl2) =>
      darkEl2.classList.remove('dark-2')
    );
    Array.from(this.lighTexts).map((lighText) =>
      lighText.classList.remove('light')
    );
    Array.from(this.borders).map((border) =>
      border.classList.remove('border-color')
    );
  }
}
