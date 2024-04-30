/**
 * Local Storage Management
 * DEPRECATED
 */

export class LocalStorageManagement {
  localKeyArray: string[];
  constructor(localKeyArray: string[]) {
    this.localKeyArray = localKeyArray;
  }

  setLocalStorageItem(key: string, value: any) {
    window.localStorage.setItem(key, value);
  }
  getLocalStorageItem(key: string): any {
    return localStorage.getItem(key);
  }

  clearLocalStorage(key = null) {
    if (key) return localStorage.removeItem(key);
    return this.localKeyArray.forEach((item) => localStorage.removeItem(item));
  }
}
