const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;


mongoose.connect('mongodb://127.0.0.1:27017/luxobrilho',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});

const UsuarioSchema = new mongoose.Schema({
    email : {type : String, required : true},
    senha : { type : String, required : true}
});

const Usuario = mongoose.model("Usuário", UsuarioSchema);

app.post("/cadastrousuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha

    if(email == null || senha == null){
        return res.status(400).json({error : "Preenchar todos os campos!!!"});
    } 

    const emailExiste = await Usuario.findOne({email:email});

    if(emailExiste){
        return res.status(400).json({error : "O email informado já existe."});
    }


    const usuario = new Usuario({
        email : email,
        senha : senha
    })

    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }

});

const produtojoiaSchema = new mongoose.Schema({
    id_produtojoia : {type : Number, required : true},
    descricao : {type : String, required : true},
    cor : {type : String, required : true},
    data_lapidacao: {type : Date, required : true},
    quant_estoque : {type : Number, required : true}
});


const produtojoia = mongoose.model("ProdutoJoia", produtojoiaSchema);
app.post("/produtojoia", async(req, res)=>{
    const id_produtojoia = req.body.id_produtojoia;
    const descricao = req.body.descricao;
    const cor = req.body.cor;
    const data_lapidacao = req.body.data_lapidacao;
    const quant_estoque = req.body.quant_estoque;



    if(id_produtojoia == null || descricao == null || cor == null || data_lapidacao == null || quant_estoque == null){
        return res.status(400).json({error : "Preencher todos os campos"});
    } 

    const id_produtojoiaEx = await produtojoia.findOne({id_produtojoia: id_produtojoia});
 
    if(id_produtojoiaEx){
        return res.status(400).json({error : "Esse id já está registrado no sistema."});
    }

    const produtojoia = new Usuario({
        id_produtojoia : id_produtojoia,
        descricao : descricao,
        cor : cor,
        data_lapidacao : data_lapidacao,
        quant_estoque : quant_estoque
    })


    try{
        const newprodutojoia = await produtojoia.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : new Usuario._id});
    } catch(error){
        res.status(400).json({error});
    }

});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
});

app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
});