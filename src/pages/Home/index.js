import { useState } from 'react'; 
import './home.css';
import { auth } from '../../firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Swal  from 'sweetalert2';
import { Link } from 'react-router-dom';

export default function Home(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();
    if(email !== '' && password !== ''){
      
      await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Login realizado com sucesso!',
          showConfirmButton: false,
          timer: 2500
        })
        navigate('/admin', { replace: true })
      })
      .catch(() => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Email ou senha incorretos ou não possui cadastro!',
          showConfirmButton: false,
          timer: 2000
        })
      })

    }else{
      Swal.fire({
        position: 'top',
        icon: 'warning',
        title: 'Preencha todos os campos!',
        showConfirmButton: true,
        timer: 2500
      })
    }
  }

    return(
      <div className='home-container'>
          <h1>Lista de tarefas</h1>
          <span>Gerencie sua agenda de forma fácil.</span>

          <form className='form' onSubmit={handleLogin}>
            <input type='text' placeholder='Digite seu e-mail...' value={email} onChange={(e)=> setEmail(e.target.value)}></input>
            <input type='password' placeholder='********' value={password} onChange={(e)=> setPassword(e.target.value)}></input>

            <button type='submit'>Acessar</button>
          </form>

        <Link className='button-Link' to='/register'>
          Não possui uma conta? Cadastre-se
        </Link>

      </div>   
    )
  }