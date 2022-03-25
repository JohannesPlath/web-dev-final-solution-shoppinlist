import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

  constructor() {
  }

  goToGithubRepo(): void {
    window.open('https://github.com/JohannesPlath?tab=repositories', '_blank');
  }

}
