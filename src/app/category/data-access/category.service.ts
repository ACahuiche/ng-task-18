import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, query, Timestamp, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, tap, throwError } from 'rxjs';

export interface Category{
  id: string;
  idOwner: string;
  name: string;
  creationDate: Timestamp;
  lastUpdate: Timestamp;
}

export type CategoryCreate = Omit<Category, 'id' | 'idOwner' | 'lastUpdate' | 'creationDate'>;

const collectionName = 'category';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private _firestore = inject(Firestore);
  private _categoryCollection = collection(this._firestore, collectionName);
  private _linksCollection = collection(this._firestore, 'tasks');
  private _authState = inject(AuthStateService);
  private _query = query(
    this._categoryCollection,
    where('idOwner', '==', this._authState.currentUser?.uid)
  );

  loading = signal<boolean>(true);

  getCategories = toSignal(
    (collectionData(this._query, { idField: 'id' }) as Observable<Category[]>).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => error);
      })
    ),
    { initialValue: [] }
  );

  getCategoriesList() {
    return collectionData(this._query, { idField: 'id' }) as Observable<Category[]>;
  }

  getCategory(id: string) {
    const docRef = doc(this._categoryCollection, id);
    return getDoc(docRef);
  }

  create(category: CategoryCreate) {
    return addDoc(this._categoryCollection, {...category,creationDate: Timestamp.now(), idOwner: this._authState.currentUser?.uid})
  }

  async update(id: string, category: CategoryCreate) {
    const userId = this._authState.currentUser?.uid;
    const docRef = doc(this._categoryCollection, id);
    const categorySnap = await getDocs(
      query(
        this._categoryCollection,
        where('__name__', '==', id),
        where('idOwner', '==', this._authState.currentUser?.uid)
      )
    );

    if(categorySnap.empty){
      console.log('No existe la categoria');
      return;
    }

    const categoryDoc = categorySnap.docs[0];
    const oldName = categoryDoc.data()['name'];

    await updateDoc(docRef, {...category, lastUpdate: Timestamp.now(),idOwner: this._authState.currentUser?.uid})

    const linksQuery = query(
      this._linksCollection,
      where('category', '==', oldName),
      where('userId', '==', userId)
    );
    const linksSnap = await getDocs(linksQuery);


    const batch = writeBatch(this._firestore);
      linksSnap.forEach((linkDoc) => {
      const linkRef = doc(this._firestore, 'tasks', linkDoc.id);
      batch.update(linkRef, { category: category.name });
    });

    await batch.commit();
  }

  async delete(id: string) {
    const userId = this._authState.currentUser?.uid;
    const categorySnap = await getDocs(query(this._categoryCollection, where('__name__', '==', id)));

    if (categorySnap.empty) {
      console.error('Categoría no encontrada');
      return;
    }

    const categoryDoc = categorySnap.docs[0];
    const categoryName = categoryDoc.data()['name'];
    const categoryRef = doc(this._firestore, 'category', id);

    const linksQuery = query(
      this._linksCollection,
      where('category', '==', categoryName),
      where('userId', '==', userId) 
    );
    const linksSnap = await getDocs(linksQuery);

    const batch = writeBatch(this._firestore);
    linksSnap.forEach((linkDoc) => {
      const linkRef = doc(this._firestore, 'tasks', linkDoc.id);
      batch.update(linkRef, { category: 'Sin Categoría' });
    });
    await batch.commit();
    
    await deleteDoc(categoryRef);
  }
}

