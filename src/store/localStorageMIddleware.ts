import { Action, Middleware, Store } from "@reduxjs/toolkit";

export const localStorageMiddleware: Middleware = (store: Store) => (next: any) => (action: Action) => {
    const result = next(action);

    if(action.type === 'appUser/fetchUserAppData/fulfilled'){
        const appUserState = store.getState().appUser;

        try{
            localStorage.setItem('appUser', JSON.stringify(appUserState));
        }
        catch (error) {
            console.error('Failed to save appUser state to localStorage:', error);
        }
    }

    if(action.type === 'appUser/logout'){
        try{
            localStorage.removeItem('appUser');
        }
        catch (error) {
            console.error('Failed to remove appUser state from localStorage:', error);
        }
    }

    return result;
}