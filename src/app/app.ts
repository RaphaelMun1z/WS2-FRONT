import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from "./core/components/footer/footer";
import { RouterModule } from "@angular/router";
import { Header } from "./core/components/header/header";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Footer, RouterModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

}
