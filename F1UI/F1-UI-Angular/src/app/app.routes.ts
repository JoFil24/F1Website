import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DriverList  } from './drivers/driver-list/driver-list';
import { DriverForm } from './drivers/driver-form/driver-form';
import { TeamList } from './teams/team-list/team-list';
import { TeamForm } from './teams/team-form/team-form';
import { TracksList } from './tracks/tracks-list/tracks-list';
import { TracksForm } from './tracks/tracks-form/tracks-form';
import { RacesList } from './races/races-list/races-list';
import { RacesForm } from './races/races-form/races-form';
import { PointsList } from './points/points-list/points-list';
import { DriverTeamsForm } from './driverTeams/driver-teams-form/driver-teams-form';

export const routes: Routes = [
    { path: 'drivers', component: DriverList },
    { path: 'drivers/new', component: DriverForm },
    { path: 'drivers/edit/:id', component: DriverForm },

    { path: 'teams', component: TeamList },
    { path: 'teams/new', component: TeamForm },
    { path: 'teams/edit/:id', component: TeamForm },

    { path: 'tracks', component: TracksList },
    { path: 'tracks/new', component: TracksForm },
    { path: 'tracks/edit/:id', component: TracksForm },

    { path: 'races', component: RacesList },
    { path: 'races/new', component: RacesForm },
    { path: 'races/edit/:id', component: RacesForm },

    { path: 'points', component: PointsList },
    // { path: 'points/new', component: PointsForm },
    // { path: 'points/edit/:id', component: PointsForm },

    // { path: 'driverTeams', component: RacesList },
    { path: 'driverTeams/new', component: DriverTeamsForm },
    { path: 'driverTeams/edit/:id', component: DriverTeamsForm },

    { path: '', redirectTo: 'drivers', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  
  export class AppRoutingModule {}
