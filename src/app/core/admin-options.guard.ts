import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../shared/data-access/auth-state.service';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';

export const adminOptionGuard: CanActivateFn = async () => {
    const _authState = inject(AuthStateService);
    const _firestore = inject(Firestore);
    const _router = inject(Router);
    const _usersCollection = collection(_firestore, 'users');
  
    const userId = _authState.currentUser?.uid;
    console.log('User ID: ',userId);
    console.log('Desde el servicio: ',_authState.currentUser?.uid);

    if (!userId) {
        _router.navigateByUrl('/auth/sign-in');
        console.error('No se encontró un usuario autenticado.');
        return false;
    }

    try {
        const queryFilter = query(
            _usersCollection, 
            where('userId', '==', userId), 
            where('isAdmin','==', true)
        );

        const querySnapshot = await getDocs(queryFilter);

        if (querySnapshot.empty) {
            console.log('Info de prueba: ', querySnapshot.docs[0].data);
            _router.navigateByUrl('/tasks');
            return false; 
        }
        
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }

}
