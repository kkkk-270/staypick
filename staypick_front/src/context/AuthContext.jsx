import React, {createContext, useContext, useState, useEffect} from 'react'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [auth, setAuth] = useState({
        user: null,
        token: null,
    })

    useEffect(()=>{
        const savedToken = localStorage.getItem('token');
        if(savedToken){
            try{
                //atob(복호화 코드) Base64를 통해 암호화된 코드를 복호화 하는 함수
                const payload = JSON.parse(atob(savedToken.split(".")[1]));
                const user = {
                    username: payload.username,
                    role: payload.role
                };
                setAuth({
                    user,
                    token: savedToken
                });
            }catch(error){
                console.error("토큰 포맷이 잘못되었습니다.", error);
                localStorage.removeItem('token');
                setAuth({user:null, token: null});
            }
           
        }
    }, []);
    
    return(
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);