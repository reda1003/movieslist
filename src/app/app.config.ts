import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes),
    // 1. Initialiser une App "Demo" sécurisée (pas besoin de vraies clés pour les émulateurs)
    provideFirebaseApp(() => 
      initializeApp({ 
        projectId: 'demo-movie-12345', 
        apiKey: 'fausse-cle-pour-les-emulateurs' 
      })
    ),
    
    // 2. Configurer Firebase Auth pour pointer vers l'émulateur local
    provideAuth(() => {
      const auth = getAuth();
      // On se connecte à l'émulateur seulement en mode développement
      if (isDevMode()) connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      return auth;
    }),
    
    // 3. Configurer Firestore pour pointer vers l'émulateur local
    provideFirestore(() => {
      const firestore = getFirestore();
      if (isDevMode()) connectFirestoreEmulator(firestore, 'localhost', 8080);
      return firestore;
    })
  ]
};
