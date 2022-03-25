import React, { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Card from '../../components/Card'
import './busca.css'
import {
  AiOutlineExclamationCircle,
  AiOutlineCheckCircle
} from 'react-icons/ai'
import Button from '../../components/UI/Button'
import api from '../../services/api'
import Modal from '../../components/Modal'
const Busca = () => {
  const [novaBusca, setNovaBusca] = useState(true)
  const [cep, setCep] = useState('')
  const [resposta, setResposta] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [buscando, setBuscando] = useState(false)

  const buscarCEP = () => {
    setErrorMessage('')
    setBuscando(true)

    api
      .get(`cep/${cep}`, {
        id: 1
      })
      .then(response => setResposta(response.data))
      .catch(err => {
        console.error('ops! ocorreu um erro ' + err)
      })
  }
  useEffect(() => {
    setBuscando(false)
    console.log(resposta.length)
    if (resposta.length === 0) {
      setNovaBusca(true)
    } else {
      resposta.status === 'error'
        ? toast.error(resposta.message)
        : setNovaBusca(false)
    }
  }, [resposta])

  useEffect(() => {
    cep.replace('_', '').length < 9 && setErrorMessage('')
  }, [cep])

  const formNovaBusca = () => {
    const header = (
      <>
        <h1>Busque um CEP</h1>
        <span>Utilize o campo abaixo para pesquisar um CEP.</span>
      </>
    )
    const body = (
      <>
        <InputMask
          autoFocus
          mask="99999-999"
          placeholder="Informe o CEP"
          value={cep}
          onChange={e => setCep(e.target.value)}
        />
        {buscando === true && <div className="loader"></div>}
        <p>
          <AiOutlineExclamationCircle />
          <span>Não utilize nº de casa/apto/lote/prédio ou abreviação.</span>
        </p>
      </>
    )
    const footer = (
      <Button
        txtButton="Buscar"
        disabled={buscando}
        onClick={() => buscarCEP()}
      />
    )
    return (
      <>
        <Card header={header} body={body} footer={footer} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
        />{' '}
      </>
    )
  }
  const buscaEfetuada = () => {
    const header = (
      <>
        <AiOutlineCheckCircle />
        <h1>Resultado da busca:</h1>
      </>
    )
    const body = (
      <>
        {' '}
        <p>
          Logradouro/Nome: <span>{resposta.logradouro}</span>
        </p>
        <p>
          Bairro: <span>{resposta.bairro}</span>
        </p>
        <p>
          Localidade/UF: <span>{resposta.localidade + '/' + resposta.uf}</span>
        </p>
        <p>
          CEP: <span>{cep}</span>
        </p>
      </>
    )
    const footer = (
      <Button txtButton="Nova busca" onClick={() => setNovaBusca(true)} />
    )
    return (
      <Modal>
        <Card classCard="success" header={header} body={body} footer={footer} />
      </Modal>
    )
  }
  return novaBusca === true ? formNovaBusca() : buscaEfetuada()
}
export default Busca
