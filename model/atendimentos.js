const moment = require('moment')
const conexao = require('../infraestrutura/conexao');

class Atendimento{
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data  = moment(atendimento.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

        const dataEnValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEhValido = atendimento.cliente.length >= 5;

        const validacoes  = [
            {
                nome: 'data',
                valido: dataEnValida,
                mesagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhValido,
                mesagem: 'Cliente deve ter pelo menos 5 caranteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if(existemErros){
            res.status(400).json(erros);
        }else{
            
        }
        const atendimentoDatado= {...atendimento, dataCriacao, data};
      

        const sql = 'INSERT INTO atendimentos SET ?';

        conexao.query(sql, atendimentoDatado, (erro, resultado) => {
            if(erro){
                res.status(404).json(erro);
            }else{
                res.status(201).json(atendimento);
            }
        });
    }

    lista(res){
        
        const sql = 'SELECT * FROM atendimentos';

        conexao.query(sql,(erro, resultados) =>{
            if(erro){
                res.status(404).json(erro);
            }else{
                res.status(200).json(resultados)
            }
        });
    }

    buscarPorId(id, res){
        const sql = `SELECT * FROM atendimentos WHERE id=${id}`;

        conexao.query(sql , (erro, resultado)=>{
            const atendimento = resultado[0];
            if(erro){
                res.status(404).json(erro);
            }else{
                res.status(202).json(atendimento);
            }
        })
    }

    altera(id, valores, res){
        if(valores.data){
         valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS'); 
        }
        const sql = `UPDATE atendimentos SET ? WHERE id=?`;

        conexao.query(sql, [valores, id], (erro, resultados)=>{

            if(erro){
                res.status(404).json(erro);
            }else{
                res.status(200).json(resultados)
            }
        })
    }

    delete(id, res){

        const sql = 'DELETE FROM atendimentos WHERE id =?';

        conexao.query(sql, id, (erro, resultado) =>{
            
            if(erro){
                res.status(404).json(erro);
            }else{
                res.status(200).json({id});
            
            }
        })
    }
}

module.exports = new Atendimento()