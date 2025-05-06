import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
  
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    
    // Retrieve stashed trip ID from localStorage
    let tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert('Something went wrong, could not find where I stashed tripCode!');
      this.router.navigate(['']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripCode:' + tripCode);
    
    // Build the edit form
    this.editForm = this.formBuilder.group({
      _id: [''],
      code: [ '', Validators.required ],
      name: [ '', Validators.required ],
      length: [ '', Validators.required ],
      start: [ '', Validators.required ],
      resort: [ '', Validators.required ],
      perPerson: [ '', Validators.required ],
      image: [ '', Validators.required ],
      description: [ '', Validators.required ]
    });

    // Get all trips, then filter by tripCode to find the specific trip
    this.tripDataService.getTrips()
    .subscribe({
      next: (trips: Trip[]) => {
        const trip = trips.find(t => t.code === tripCode); // Find the trip by tripCode
        if (trip) {
          this.trip = trip;
          this.editForm.patchValue(trip); // Populate form with trip data
          this.message = 'Trip: ' + tripCode + ' retrieved';
        } else {
          this.message = 'No Trip Retrieved!';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    });
  }

  // Submit the form
  public onSubmit(): void {
    this.submitted = true;
    
    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value)
      .subscribe({
        next: (value: any) => {
          console.log(value);
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
    }
  }

  // Getter for form controls
  get f() { return this.editForm.controls; }
}