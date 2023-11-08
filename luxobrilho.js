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
    senha : { type : String}
});

const Usuario = mongoose.model("Usuário", UsuarioSchema);

app.post("/cadastrousuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha

    const usuario = new Usuario({
        email : email,
        senha : senha
    })

    if(email == null || senha == null){
        return res.status(400).json({error : "Preencher todos os campos!!"});
    }

    const emailExiste = await Usuario.findOne({email:email});

    if(emailExiste){
        return res.status(400).json({error : "Esse email já existe!"});
    }
 

    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }

});



const ProdutojoiaSchema = new mongoose.Schema({
    id_produtojoia : {type : Number, required : true},
    descricao : {type : String},
    cor : {type : String},
    data_lapidacao: {type : Date},
    quant_estoque : {type : Number}
});


const Produtojoia = mongoose.model("ProdutoJoia", ProdutojoiaSchema);
app.post("/cadastroprodutojoia", async(req, res)=>{
    const id_produtojoia = req.body.id_produtojoia;
    const descricao = req.body.descricao;
    const cor = req.body.cor;
    const data_lapidacao = req.body.data_lapidacao;
    const quant_estoque = req.body.quant_estoque;

    const produtojoia = new Produtojoia({
        id_produtojoia : id_produtojoia,
        descricao : descricao,
        cor : cor,
        data_lapidacao : data_lapidacao,
        quant_estoque : quant_estoque
    })

    if(quant_estoque > 43){
        return res.status(400).json({error : "O limite de estoque foi superado. Não é possivel cadastrar o produto!"});
    }
    if(anos_garantia <= 0){
        return res.status(400).json({error : "Solicitamos um valor positivo."});
    }

    
    if(produtojoia == null || descricao == null || cor == null || data_lapidacao == null || quant_estoque == null){
        return res.status(400).json({error : "Preencher todos os campo!"});
    }
 
    
    const id_produtojoiaEx = await Produtojoia.findOne({id_produtojoia : id_produtojoia});
 
    if(id_produtojoiaEx){
        return res.status(400).json({error : "Esse id já foi registrado no sistema."});
    }



    try{
        const newProdutojoia = await produtojoia.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newProdutojoia._id});
    } catch(error){
        res.status(400).json({error});
    }

});

app.get("/cadastrousuario", async(req, res)=> {
    res.sendFile(__dirname+"/cadastrousuario.html");
});

app.get("/cadastroprodutojoia", async(req, res)=> {
    res.sendFile(__dirname+"/cadastroprodutojoia.html");
});

//rota raiz - inicio do inw por causa da pág html
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
});