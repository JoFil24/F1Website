import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DriversService, Driver } from '../../api';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-form.html',
  styleUrl: './driver-form.css',
})
export class DriverForm implements OnInit{
  driver: Driver = {};
  isEdit = false;

  constructor(
    private driverService: DriversService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.driverService.apiDriversIdGet(id).subscribe(d => {
        this.driver = d;
      });
    }
  }

  save() {
    if (this.isEdit) {
      this.driverService.apiDriversIdPut(this.driver.id!, this.driver)
        .subscribe(() => this.router.navigate(['/drivers']));
    } else {
      // Ensure new drivers are visible by default
      if (this.driver.isVisible === undefined) {
        this.driver.isVisible = true;
      }
      this.driverService.apiDriversPost(this.driver)
        .subscribe(() => this.router.navigate(['/drivers']));
    }
  }
}
