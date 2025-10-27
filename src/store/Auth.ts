import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

import {AppwriteException,ID,Models} from 'appwrite'
import { account } from '../models/client/config';

export interface UserPrefs{
    reputation: number
}

interface IAuthStore{
    session: Models.Session | null;
    jwt: string | null;
    user: Models.User<UserPrefs> | null
    hydrated: boolean

    setHydrated(): void;
    verifySession(): Promise<void>
    login(
        email: string,
        password: string
    ):Promise<{
        success: boolean;
        error?: AppwriteException | null;
    }>
    createAccount(
        name:string,
        email: string,
        password: string
    ):Promise<{
        success: boolean;
        error?: AppwriteException | null;
    }>

    logout(): Promise<void>
}

export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set)=>({
            session: null,
            jwt: null,
            user: null,
            hydrated:false,

            setHydrated(){
                set({hydrated:true})
            },

            async verifySession() {
                try {
                    const session = await account.getSession("current");
                    
                    // ✅ Also fetch user data when verifying session
                    const user = await account.get<UserPrefs>();
                    
                    // ✅ Initialize reputation if not set
                    if (!user.prefs?.reputation) {
                        await account.updatePrefs<UserPrefs>({
                            reputation: 0
                        });
                        user.prefs = { reputation: 0 };
                    }
                    
                    set({ session, user });
                } catch (error: any) {
                    // Don't log as error if it's just "no session" (which is expected when logged out)
                    if (error?.code !== 401 && error?.response?.code !== 401) {
                        console.error("Session verification failed:", error);
                    }
                    // ✅ Clear invalid session data
                    set({ session: null, user: null, jwt: null });
                }
            },

            async login(email: string, password: string) {
                try {
                    // ✅ Delete any existing sessions first
                    try {
                        await account.deleteSessions();
                    } catch (error) {
                        // Ignore if no session exists
                        console.log("No existing sessions to delete");
                    }

                    const session = await account.createEmailPasswordSession(email, password);
                    const [user, { jwt }] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ]);

                    // ✅ Initialize reputation if not set
                    if (!user.prefs?.reputation) {
                        await account.updatePrefs<UserPrefs>({
                            reputation: 0
                        });
                        // ✅ Update local user object
                        user.prefs = { reputation: 0 };
                    }
                    
                    set({ session, user, jwt });

                    return { success: true, error: null };
                } catch (error) {
                    console.error("Login error:", error);
                    return { 
                        success: false, 
                        error: error as AppwriteException 
                    };
                }
            },

            async createAccount(name: string, email: string, password: string) {
                try {
                    await account.create(ID.unique(), email, password, name);
                    
                    // ✅ Optional: Auto-login after account creation
                    // Uncomment if you want automatic login
                    // const loginResult = await this.login(email, password);
                    // return loginResult;
                    
                    return { success: true, error: null };
                } catch (error) {
                    console.error("Create account error:", error);
                    return { 
                        success: false, 
                        error: error as AppwriteException 
                    };
                }
            },
            
            async logout() {
                try {
                    await account.deleteSessions();
                    set({ session: null, jwt: null, user: null });
                } catch (error) {
                    console.error("Logout error:", error);
                    // ✅ Clear session even if logout fails
                    set({ session: null, jwt: null, user: null });
                }
            },
        })),
        {
            name:"auth",
            onRehydrateStorage(){
                return (state,error)=>{
                    if (!error) {
                        state?.setHydrated()
                    }
                }
            }
        }
    )
)