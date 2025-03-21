import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, updateDoc, deleteDoc, query, where, Timestamp } from '@angular/fire/firestore';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

export interface Task{
  id: string;
  title: string;
  urlSite: string;
  description: string;
  favicon: string;
  category?: string;
}

export type TaskCreate = Omit<Task, 'id' | 'favicon'>;

const PATH = 'tasks';

@Injectable()
export class TaskService {
  private _firestore = inject(Firestore);
  private _sitesCollection = collection(this._firestore, PATH);
  private _authState = inject(AuthStateService);
  private _query = query(
    this._sitesCollection,
    where('userId', '==', this._authState.currentUser?.uid)
  );

  loading = signal<boolean>(true);

  getSites = toSignal(
    (collectionData(this._query, {idField: 'id'}) as Observable<Task[]>).pipe(
      map(sites =>
        sites.map(site => ({
          ...site,
          favicon: `https://www.google.com/s2/favicons?sz=64&domain=${site.urlSite}`
        }))
      ),
      tap(() =>{
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => error);
      })
    ), 
    {initialValue: []}
  )

  getSitesToUpdateCategory(categoryName: string) {
    const _queryUpdate = query(
      this._sitesCollection,
      where('userId', '==', this._authState.currentUser?.uid),
      where('category','==', categoryName)
    );

    return collectionData(_queryUpdate, {idField: 'id'}) as Observable<Task[]>
  }


  getSite(id: string) {
    const docRef = doc(this._sitesCollection, id);
    return getDoc(docRef);
  }

  create(task: TaskCreate) {
    return addDoc(this._sitesCollection, {...task, creationDate: Timestamp.now(), userId:this._authState.currentUser?.uid});
  }

  update(id: string, task: TaskCreate) {
    const docRef = doc(this._sitesCollection, id);
    return updateDoc(docRef, {...task, lastUpdate: Timestamp.now(), userId:this._authState.currentUser?.uid});
  }

  delete(id: string) {
    const docRef = doc(this._sitesCollection, id);
    return deleteDoc(docRef);
  }
}

export function provideFirestore(){
  return inject(Firestore)
}

export function provideTaskService(){
  return inject(TaskService)
}
