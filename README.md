<h1>Como criar uma API em node</h1>
<p>
    API criada nesse projeto e uma API desenvolvida em nodejs que faz a comunicação com o banco de dados MySQL fazendo as funções CRUD. <br><br>
    O primeiro passo para criar uma API em node e iniciar o projeto NPM utilizando o <a href="https://docs.npmjs.com/creating-a-package-json-file">npm init, </a>adicionando um package.json (aquivo que vai ajudar na hora de adicionar as dependências do projeto) apos iniciar o package.json será necessário instalar as dependências do <a href="https://docs.npmjs.com/creating-a-package-json-filehttps://www.npmjs.com/package/express" >express </a>para manipular as rotas http. Vamos precisar também instalar as dependências do <a href="https://www.npmjs.com/package/consign">consign </a>para fazer o autoload dos scripts de maneira rápida e fácil, <a href="">body-parser </a>para podermos receber e manipular os objetos JSON nas requisições http, e o <a href="https://www.npmjs.com/package/mysql">mysql</a> que nesse exmplo vai ser nosso banco de dados.
</p>
<p>
    <h3> <strong>As dependências que foram usadas na API são:</strong></h3>
    <ul>
        <li><a href="https://docs.npmjs.com/creating-a-package-json-filehttps://www.npmjs.com/package/express" >npm instasll express</a></li>
        <li> <a href="https://www.npmjs.com/package/consign"> npm install consign</a></li>
        <li> <a href="https://www.npmjs.com/package/body-parser"> npm install body-parser</a></li>
        <li> <a href="https://www.npmjs.com/package/mysql">npm install mysql</a></li>
        <li> <a href="https://www.npmjs.com/package/moment">npm install moment </a></li>
    </ul>
</p>

<p>
    Apos adicionar todas as dependências será necessário configurar o express. Será necessário criar um arquivo js <strong>custonExpress</strong> que vai ser feito o require do express, consing e body-parser, fazendo assim as configurações iniciais do express.<br>
    o método consign inclui tudo que estiver dentro do diretório controller que nesse caso só tem o arquivo de configurações de rotas.

```js
    const express = require('express');
    const consing= require('consign');
    const bodyParser = require('body-parser');


    module.exports =() =>{

        const app = express();
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

        consing()
            .include('controller')
            .into(app)

        return app;
    }
```
</p>

<p>
O próximo passo e configurar o banco de dados usando o método <strong>createConnection</strong> para criar a conexão com o DB
O proximo passo e configurar o banco de dados usando a dependência usando o método 

```js
    const mysql = require('mysql');

    const conexao = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user :'root',
    password: 'root123',
    database: 'agendaPetshop'
    })
    module.exports = conexao;
```
</p>

<p>
Agora chegou a hora de configuar o index aonde o servidor será iniciado, será feito o require dos arquivo <strong>./config/custonExpress </strong>, <strong>/infraestrutura/conexao </strong> e <strong>./infraestrutura/tabelas </strong><br>
OBS: /infraestrutura/tabelas e necessário para fazer o init da tabela e ver se ela está criada, caso contrario e criado a tabela no banco de dados usando a conexão que já está feita com o banco de dados.


```js
const custonExpress = require('./config/custonExpress');
const conexao = require('./infraestrutura/conexao');
const Tabelas = require('./infraestrutura/tabelas');

conexao.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        Tabelas.init(conexao)
        const app = custonExpress();
        app.listen(3000, () => console.log('Servidor rorando na porta 3000'));
    }
});
```
</p>

<p>
    <h3>Criação do banco de dados usando linhas e somenta para teste. Não e utilizado normalmente em dev</h3>
    A class Tabelas e responsável por criar uma tabela no banco de dados chamado atendimentos. A partir da conexão e chamado a função query que recebe como primeiro argumento o sql e como segundo argumento e recebido uma função que recebe como parâmetro um erro.

```js
        class Tabelas{
            init(conexao){
                this.conexao = conexao
                this.criarAtendimentos();
                
            }

            criarAtendimentos(){
                const sql = `CREATE TABLE IF NOT EXISTS atendimentos 
                (id int NOT NULL AUTO_INCREMENT, cliente varchar(50) NOT NULL, 
                pet varchar(20), servico varchar(20) NOT NULL, data datetime NOT NULL,
                datacriacao datetime NOT NULL, status varchar(20) NOT NULL,
                obsrervacoes text, PRIMARY KEY(id))`
                

                this.conexao.query(sql, (erro) =>{
                    if(erro){
                        console.log(err);
                    }else{
                        console.log('Tabela Atendimento criada com sucesso')
                    }
                })
            }
        }

        module.exports = new Tabelas
```
</p>


<p>
Feito todos os passos, chegou a hora de criar as rotas http, que no exemplo abaixo e feito o CRUD na tabela no banco de dados. E feito um require da tabela model/atendimentos, aonde e chamado os métodos de comunicação com o banco de dados 

```js

const Atendimentos = require('../model/atendimentos')
module.exports = app =>{
    
    app.get('/atendimentos', (req, res)=> 
    {
        Atendimentos.lista(res);
    });

    app.get('/atendimentos/:id', (req, res) =>{
        const id = parseInt(req.params.id);
        Atendimentos.buscarPorId(id, res);

    })

    app.post('/atendimentos', (req, res) => 
    {   
        const atendimento = req.body;
        Atendimentos.adiciona(atendimento, res)
    })

    app.patch('/atendimentos/:id', (req, res) =>{
       
        const id = parseInt(req.params.id);
        const valores = req.body;

        Atendimentos.altera(id, valores, res);
    });
    app.delete('/atendimentos/:id', (req, res)=>{
        const id = parseInt(req.params.id)

        Atendimentos.delete(id, res);
    })
}

```

</p>
<p>
    Na class Atendimento e feito o requide do moment para manipular as datas no formato bt-br e passar como argumento na hora de gravar no DB como no exemplo adiciona e altera mostrado abaixo.<br>
    Foram utilizandos os metodos CRUD como nos exemplos abaixo. utilizando algumas validações de horas e de cliente.

```js
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
```
</p>