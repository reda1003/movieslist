import { Component, inject } from '@angular/core';
import { MovieService } from '../../services/movieService';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Movie } from '../../models/movie-model/movie-model-module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    AsyncPipe, NgFor, NgIf, FormsModule,
    MatToolbarModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatListModule
  ],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {
  // 1. Injecter le MovieService via inject()
  private movieService = inject(MovieService)

  // 2. Initialiser l'Observable movies$ en appelant getMovies() du service
  movies$: Observable<Movie[]> = this.movieService.getMovies()

  // 3. Définir les variables pour le formulaire d'ajout (newMovieTitle, etc.)
  newMovieTitle = ""
  newMovieDescription = ""
  newMovieImageUrl = ""

  addMovie() {
    // 1. Vérifier si titre et description ne sont pas vides (trim())
    if (this.newMovieTitle.trim() && this.newMovieDescription.trim()) {
      // 2. Appeler addMovie(...) du service avec les variables du formulaire
      this.movieService.addMovie(this.newMovieTitle, this.newMovieDescription, this.newMovieImageUrl)
        .then(() => {
          // 3. Une fois ajouté (.then), vider les champs du formulaire
          this.newMovieTitle = "";
          this.newMovieDescription = "";
          this.newMovieImageUrl = "";
        });
    }
  }

  // Champs pour gérer l'affichage de la modification dans l'interface (HTML)
  editingMovieId: string | null = null;
  editTitle = "";
  editDescription = "";
  editImageUrl = "";

  updateMovie(movie: Movie) {
    if (movie.id) {
      this.movieService.updateMovie(movie.id, { 
        title: this.editTitle, 
        description: this.editDescription, 
        imageUrl: this.editImageUrl 
      });
      this.editingMovieId = null; // Fermer le mode édition
    }
  }

  deleteMovie(id?: string) {
    if (id) {
      this.movieService.deletemovie(id)
    }
    // 2. Appeler deletemovie(id) du service
  }

  toggleWatched(movie: Movie) {
    // 1. Vérifier si movie.id existe
    // 2. Appeler updateMovieStatus(id, !movie.watched) du service
    if (movie.id) {
      this.movieService.updateMovie(movie.id, { watched: !movie.watched })
    }
  }
}
