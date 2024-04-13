/**
 * Local Storage Management
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

  clearLocalStorage(all = false, key = null) {
    if (all) localStorage.clear();
    else {
      if (key) localStorage.removeItem(key);
      else {
        this.localKeyArray.forEach((item) => localStorage.removeItem(item));
      }
    }
  }
}
