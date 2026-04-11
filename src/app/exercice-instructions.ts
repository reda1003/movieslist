import { Injectable, Component, inject } from '@angular/core';
import { addDoc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './services/auth-service';
import { user } from '@angular/fire/auth';
import { collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Movie } from './models/movie-model/movie-model-module';
import { doc } from 'firebase/firestore';
import { MovieService } from './services/movieService';

// ==========================================
// 1. INSTRUCTIONS POUR LE SERVICE (MovieService)
// ==========================================

@Injectable({
  providedIn: 'root',
})
export class MovieServiceInstructions {
  // 1. Injecter Firestore et AuthService
  private firestore = inject(Firestore)
  private authService=inject(AuthService)
  
  private getMoviesCollection() {
    // 1. Récupérer l'utilisateur actuel via AuthService
    // 2. Vérifier si l'utilisateur n'existe pas, sinon lever une erreur ("Utilisateur non connecté")
    // 3. Retourner la référence de la collection Firestore : `users/{uid}/movies`
    // Indice : utiliser collection() de @angular/fire/firestore
    const user=this.authService.CurrentUser
    if(!user){
      throw new Error("Utilisateur déconnecté")
    }
    return collection(this.firestore,`users/${user.uid}/movies`)

  }

  getMovies() {
    // 1. Appeler getMoviesCollection() pour obtenir la référence de la collection
    // 2. Retourner un nouvel Observable de type Movie[]
    // 3. À l'intérieur de l'Observable, appeler onSnapshot(collection, snapshot => { ... })
    //    - Mapper les docs : transformer chaque doc en objet en ajoutant l'id du doc { id: doc.id, ...doc.data() } as Movie
    //    - Envoyer les données via observer.next(movies)
    // 4. Retourner la fonction de nettoyage (unsubscribe) fournie par onSnapshot
    const moviescol=this.getMoviesCollection()
    return new Observable<Movie[]>(s=>{
       const unsubscribe = onSnapshot(moviescol,snapshot=>{
       const movies=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}) as Movie)
       s.next(movies)
      })
      
    })
  }

  addMovie(titre: string, description: string, imageUrl: string) {
    // 1. Récupérer l'utilisateur actuel
    // 2. Vérifier si l'utilisateur existe
    // 3. Appeler getMoviesCollection()
    // 4. Créer l'objet 'newmovie' de type Movie (title, description, imageUrl, watched: false, userId: uid)
    // 5. Utiliser addDoc(collection, objet) et retourner le résultat
    const user=this.authService.CurrentUser
    if(!user){
      throw new Error("Utilisateur déconnecté")
    }
    const moviescol=this.getMoviesCollection()
    const newmovie :Movie ={title: titre, description: description, imageUrl: imageUrl,watched:false,userId:user.uid}
    return addDoc(moviescol,newmovie)

  }

  deletemovie(movieId: string) {
    // 1. Récupérer l'utilisateur actuel
    // 2. Vérifier si l'utilisateur existe
    // 3. Appeler getMoviesCollection()
    // 4. Créer une référence de document cible : doc(collection, movieId)
    // 5. Appeler deleteDoc(reference) et retourner le résultat
    const user=this.authService.CurrentUser
    if(!user){
      throw new Error("Utilisateur déconnecté")
    }
    const moviescol=this.getMoviesCollection()
    const docRef=doc(moviescol,movieId)
    return addDoc(moviescol,docRef)
  }

  updateMovieStatus(movieId: string, watched: boolean) {
    // 1. Récupérer l'utilisateur actuel
    // 2. Vérifier si l'utilisateur existe
    // 3. Appeler getMoviesCollection()
    // 4. Créer une référence de document cible : doc(collection, movieId)
    // 5. Appeler updateDoc(reference, { watched }) et retourner le résultat
      const user=this.authService.CurrentUser
    if(!user){
      throw new Error("Utilisateur déconnecté")
    }
    const moviescol=this.getMoviesCollection()
    const docRef=doc(moviescol,movieId)
    return updateDoc(docRef,{watched})

  }
}

// ==========================================
// 2. INSTRUCTIONS POUR LE COMPOSANT (Movies Component)
// ==========================================

@Component({
  selector: 'app-movies-instructions',
  standalone: true,
  template: '',
})
export class MoviesComponentInstructions {
  // 1. Injecter le MovieService via la fonction inject()
  private movieService=inject(MovieService)
  // 2. Initialiser l'Observable movies$ (de type Observable<Movie[]>) en appelant this.movieService.getMovies()
  movie$=this.movieService.getMovies()
  // 3. Définir les variables pour le formulaire d'ajout :
   newMovieTitle = ""
  newMovieDescription = ""
  newMovieImageUrl = ""

  addMovie() {
    // 1. Vérifier si newMovieTitle et newMovieDescription ne sont pas vides (utiliser .trim())
    // 2. Appeler addMovie(...) du service en lui passant les variables du composant
    // 3. Utiliser .then(() => { ... }) pour attendre la fin de l'ajout
    // 4. Une fois ajouté, réinitialiser (vider) les champs du formulaire (titre, description, url)
    if(this.newMovieTitle.trim() && this.newMovieDescription.trim()){
      this.movieService.addMovie(this.newMovieTitle,this.newMovieDescription,this.newMovieImageUrl).then(()=>{
        this.newMovieTitle=""
        this.newMovieDescription=""
        this.newMovieImageUrl=""
      })
    }
  }

  deleteMovie(id: string | undefined) {
    // 1. Vérifier si l'id existe (if id)
    // 2. Appeler this.movieService.deletemovie(id)
    if(id){
      this.movieService.deletemovie(id)
    }
  }

  toggleWatched(movie: any /* Movie */) {
    // 1. Vérifier si movie.id existe
    // 2. Appeler this.movieService.updateMovieStatus(movie.id, !movie.watched) en inversant le statut
    if(movie.id){
      this.movieService.updateMovieStatus(movie.id,!movie.watched)
}
}
}
