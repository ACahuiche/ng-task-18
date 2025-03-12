import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { BaseContext } from '../../core/base-context';

export interface UserDB {
  uid: string | undefined;
  name: string;
  lastname: string;
  isMale: boolean;
  isConfig: boolean;
  isAdmin?: boolean;
}

export type CreateNewUser = Omit<UserDB, 'name' | 'lastname' | 'isMale' | 'uid' >; 
export type RegisterDataUser = Omit<UserDB, 'uid' | 'isConfig'>;

const pathUserCollecction = 'users';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseContext{
  private _firestore = inject(Firestore);
  private _usersCollection = collection(this._firestore, pathUserCollecction);
  private _authState = inject(AuthStateService);


  async getUser() {
    const userId = this._authState.currentUser?.uid;
    if (!userId) {
      throw new Error('No se encontró un usuario autenticado.');
    }

    const userSnapshot = await getDocs(query(this._usersCollection, where('userId', '==', userId)));

    if(userSnapshot.empty){
      throw new Error('No se encontro el usuario en Firestore')
    }

    const userData = userSnapshot.docs[0].data() as UserDB;
    return userData;    

  }

  saveNewUser(newUser: CreateNewUser) {
    return addDoc(this._usersCollection, {...newUser, isConfig: false, userId:this._authState.currentUser?.uid});
  }

  async saveDataBasicInfo(newUser: RegisterDataUser) {
    const userId = this._authState.currentUser?.uid;

    if (!userId) {
      throw new Error('No se encontró un usuario autenticado.');
    }

    try {
      const queryFilter = query(this._usersCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(queryFilter);

      if (querySnapshot.empty) {
        await addDoc(this._usersCollection, { ...newUser, isConfig: true, userId: this._authState.currentUser?.uid})
      }
      else {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { ...newUser, isConfig: true, userId: this._authState.currentUser?.uid});
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      throw error;
    }
  }
}
