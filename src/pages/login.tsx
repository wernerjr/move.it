import { signIn, signOut, useSession } from 'next-auth/client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import style from '../styles/pages/Login.module.css'

export default function Page() {  
  const [ session, loading ] = useSession()
  const router = useRouter();

  useEffect(() => {
    if(!loading && session){
      router.push('/');
    }
 }, [session, loading]);

  return (
    <div className={style.loginContainer}>         
      <section>       
          <img src="/icons/logo.svg" alt="move it"/>
          <strong>Bem-vindo</strong>
          <button className={style.loginButton} onClick={() => signIn('github')}>
            <img src="/icons/github.svg" alt="Github"/>
            Faça login com seu Github para começar
          </button>        
      </section>
    </div>
  )
}