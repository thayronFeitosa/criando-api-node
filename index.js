const custonExpress = require('./config/custonExpress');
const conexao = require('./infraestrutura/conexao');
const Tabelas = require('./infraestrutura/tabelas')

conexao.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        Tabelas.init(conexao)
        const app = custonExpress();
        app.listen(3000, () => console.log('Servidor rorando na porta 3000'));
    }
});


