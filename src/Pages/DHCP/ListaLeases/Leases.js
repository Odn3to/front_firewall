import React, { useEffect, useState } from "react";
import './Leases.css';
import axios from 'axios';


const TabelaCabecalho = () => {
    return (
        <thead>
            <tr>
                <th>Address</th>
                <th>Client_ID</th>
                <th>Hostname</th>
                <th>Lease Time</th>
            </tr>
        </thead>
    );
}

const TabelaCorpo = ({ dados }) => {
    const linhas = dados.map((linha, index) => {
        return (
            <tr key={index}>
                <td>{linha.address}</td>
                <td>{linha.client_id}</td>
                <td>{linha.hostname}</td>
                <td>{linha.valid_lifetime}</td>
            </tr>
        );
    });

    return <tbody>{linhas}</tbody>;
}

const Leases = () => {

    const [dados, setDados] = useState([]);

    const getLeases = () => {

        const token = localStorage.getItem('userToken');

        axios.get('http://172.23.58.10/dhcp/dhcp/data', { headers: {
            "Authorization": token
        }
            }).then(response => {
                if(response.data && Object.keys(response.data).length !== 0){
                    setDados(response.data);
                }
            })
            .catch(error => {
                if(error.response.data.error == "Invalid token"){
                    localStorage.clear();
                }
                setDados([]);
            });
    }

    useEffect(() => {
        getLeases();
        setInterval(getLeases, 5000);
    }, [])

    return (
        <div className="container">
            <table className="minhaTabela">
                <TabelaCabecalho />
                <TabelaCorpo dados={dados} />
            </table>
        </div>
    )
}

export default Leases;