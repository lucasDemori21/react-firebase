import { useState, useEffect } from 'react'
import './admin.css'
import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'
import { addDoc, collection, onSnapshot, query, orderBy, where, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'

export default function Admin() {

    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState({});
    const [tarefas, setTarefas] = useState([]);
    const [edit, setEdit] = useState({})

    useEffect(() => {
        async function loadTarefas() {
            const userDetail = localStorage.getItem('@detailUser')
            setUser(JSON.parse(userDetail))

            if (userDetail) {
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, 'tarefas')
                const q = query(tarefaRef, orderBy('created', 'desc'), where('userUid', "==", data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })
                    setTarefas(lista)
                })
            }
        }

        loadTarefas();
    }, [])

    async function handleLogout() {

        Swal.fire({
            title: 'Tem certeza que deseja sair?',
            icon: 'warning',
            showCancelButton: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sair'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Você saiu da sua conta!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                })
                signOut(auth);
            }
        })
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (tarefaInput === '') {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Digite um texto para registrar tarefa!',
                showConfirmButton: true,
                timer: 2500,
              })
            return;
        }

        if (edit?.id) {
            handleUpdateTarefa();
            return;
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        })
            .then(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Tarefa registrada!',
                    showConfirmButton: false,
                    timer: 1500,
                  })
                setTarefaInput('')
            })
            .catch(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Erro inesperado!',
                    text: 'Atualize a página e tente novamente',
                    showConfirmButton: false,
                    timer: 1500,
                  })
            })
    }

    function deleteTarefa(id) {
        const docRef = doc(db, 'tarefas', id)

        Swal.fire({
            title: 'Deseja concluir sua tarefa?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Não',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Tarefa concluida com sucesso!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                })
                deleteDoc(docRef);
            }
        })
    }

    function editTarefa(item) {
        setTarefaInput(item.tarefa);
        setEdit(item);
    }

    async function handleUpdateTarefa() {
        const docRef = doc(db, 'tarefas', edit?.id)

        await updateDoc(docRef, {
            tarefa: tarefaInput
        })
            .then(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Tarefa atualizada com sucesso!',
                    showConfirmButton: false,
                    timer: 1500,
                  })
                setTarefaInput('')
                setEdit({})
            })
            .catch(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Erro inesperado!',
                    text: 'Atualize a página e tente novamente',
                    showConfirmButton: false,
                    timer: 1500,
                  })
                setTarefaInput('')
                setEdit({})
            })
    }

    return (
        <div className='admin-container'>
            <h1>Minhas Tarefas</h1>

            <form className='form' onSubmit={handleRegister}>
                <textarea placeholder='Digite sua tarefa...'
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                {Object.keys(edit).length > 0 ? (
                    <button className='btn-register' type='submit'>Atualizar tarefa</button>
                ) : (
                    <button className='btn-register' type='submit'>Registrar tarefa</button>
                )}
            </form>

            {tarefas.map((item) => (
                <article key={item.id} className='list'>
                    <p>{item.tarefa}</p>
                    <div>
                        <button onClick={() => editTarefa(item)}>Editar</button>
                        <button className='btn-delete' onClick={() => deleteTarefa(item.id)}>Concluir</button>
                    </div>
                </article>
            ))}

            <button className="btn-logout" onClick={handleLogout}>Sair</button>

        </div>
    )
}