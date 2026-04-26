import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth-service';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie-model/movie-model-module';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  // 1. Injecter Firestore et AuthService
  private firestore = inject(Firestore)
  private authService = inject(AuthService)

  private getMoviesCollection() {
    // 1. Récupérer l'utilisateur actuel via AuthService
    // 2. Vérifier si l'utilisateur existe, sinon lever une erreur
    // 3. Retourner la référence de la collectionFirestore: `users/{uid}/movies`
    const user = this.authService.CurrentUser
    if (!user) {
      throw new Error("Utilisateur non connecté")
    }
    return collection(this.firestore, `users/${user.uid}/movies`)
  }

  getMovies() {
    // 1. Appeler getMoviesCollection()
    // 2. Retourner un nouvel Observable
    // 3. À l'intérieur, appeler onSnapshot(collection, snapshot => { ... })
    //    - Mapper les docs: transformer chaque doc en objet { id: doc.id, ...doc.data() }
    //    - Envoyer les données via observer.next()
    // 4. Retourner la fonction de nettoyage (unsubscribe)
    const moviescol = this.getMoviesCollection()
    return new Observable<Movie[]>(s => {
      const unsubscribe = onSnapshot(moviescol, snapshot => {
        const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie))
        s.next(movies)
      })
      return unsubscribe
    })
  }

  addMovie(titre: string, description: string, imageUrl: string) {
    // 1. Récupérer l'utilisateur actuel
    // 2. Appeler getMoviesCollection()
    // 3. Créer l'objet 'newmovie' de type Movie (title, description, imageUrl, watched: false, userId: uid)
    // 4. Utiliser addDoc(collection, objet)
    const user = this.authService.CurrentUser
    if (!user) {
      throw new Error("Utilisateur non connecté")
    }
    const movies = this.getMoviesCollection()
    const newmovie: Movie = { title: titre, description: description, imageUrl: imageUrl, watched: false, userId: user.uid }
    return addDoc(movies, newmovie)
  }

  deletemovie(movieId: string) {
    // 1. Récupérer l'utilisateur actuel
    // 2. Vérifier si l'utilisateur existe
    // 3. Créer une référence de document: doc(firestore, `users/{uid}/movies/{movieId}`)
    // 4. Appeler deleteDoc(reference)
    const user = this.authService.CurrentUser
    if (!user) {
      throw new Error("Utilisateur non connecté")
    }
    const movies = this.getMoviesCollection()
    const docRef = doc(movies, movieId)
    return deleteDoc(docRef);
  }

  updateMovie(movieId: string, data: Partial<Movie>) {
    const user = this.authService.CurrentUser;
    if (!user) {
      throw new Error("Utilisateur non connecté");
    }
    const movies = this.getMoviesCollection();
    const docRef = doc(movies, movieId);
    return updateDoc(docRef, data);
  }
}
