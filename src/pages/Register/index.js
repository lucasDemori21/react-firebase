import { useState } from "react";
import { Link } from "react-router-dom"; 
import { auth } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"
 

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleRegister(e){
    e.preventDefault();
    if(email !== '' && password !== ''){
      
      await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          showConfirmButton: true,
          timer: 2500,
        })
        navigate('/admin', { replace: true })
      })
      .catch(() => {
        Swal.fire({
          position: 'top',
          icon: 'Error',
          title: 'Erro ao fazer cadastro, verifique seu email e sua senha.',
          showConfirmButton: true,
          timer: 3000,
        })
      })

    }else{
      Swal.fire({
        position: 'top',
        icon: 'warning',
        title: 'Preencha todos os campos!',
        showConfirmButton: true,
        timer: 2500,
      })
    }
  }

    return(
      <div className='home-container'>
          <h1>Cadastre-se</h1>
          <span>Vamos criar sua conta!</span>

          <form className='form' onSubmit={handleRegister}>
            <input type='text' placeholder='Digite seu e-mail...' value={email} onChange={(e)=> setEmail(e.target.value)}></input>
            <input type='password' placeholder='Crie sua senha...' value={password} onChange={(e)=> setPassword(e.target.value)}></input>

            <button type='submit'>Cadastrar</button>
          </form>

        <Link className='button-Link' to='/'>
          Já possui uma conta? Faça login!
        </Link>

      </div>   
    )
  }