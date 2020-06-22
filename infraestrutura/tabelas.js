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