import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/usuarios')
            .then(res => setUsuarios(res.data))
            .catch(err => console.log(err));
    }, []);

    console.log(usuarios);
    return (
        <div>
            <h1>Usuarios</h1>
            <ul>
                {usuarios.map(u => (
                    <li key={u.idUsuarios}>{u.Nombre}</li>
                ))}
            </ul>
        </div>
    );
}
