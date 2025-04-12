// carousel.component.ts
import { Component, Input, OnDestroy } from '@angular/core';
import { PostModel } from '../shared/post-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="carousel-container">
      <div class="carousel-slide" *ngFor="let post of visiblePosts; let i = index" 
           [class.active]="i === currentIndex">
        <h3>{{post.postName}}</h3>
        <p>{{post.description}}</p>
        <a href="['/view-post', post.id]">Read more</a>
      </div>
      <div class="carousel-controls">
        <button (click)="prevSlide()">❮</button>
        <button (click)="nextSlide()">❯</button>
      </div>
    </div>
  `,
  styles: [`
    .carousel-container {
      position: relative;
      height: 200px;
      overflow: hidden;
      margin-bottom: 20px;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .carousel-slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 15px;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }
    
    .carousel-slide.active {
      opacity: 1;
    }
    
    .carousel-controls {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    
    .carousel-controls button {
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      padding: 5px 10px;
      margin: 0 5px;
      cursor: pointer;
      border-radius: 3px;
    }
  `]
})
export class CarouselComponent implements OnDestroy {
  @Input() posts: PostModel[] = [];
  currentIndex = 0;
  private intervalId: any;
  visiblePosts: PostModel[] = [];

  ngOnInit() {
    this.startAutoSlide();
    this.updateVisiblePosts();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.posts.length;
    this.updateVisiblePosts();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.posts.length) % this.posts.length;
    this.updateVisiblePosts();
  }

  private updateVisiblePosts() {
    // Show current and next post for smoother transitions
    this.visiblePosts = [
      this.posts[this.currentIndex],
      this.posts[(this.currentIndex + 1) % this.posts.length]
    ];
  }
}