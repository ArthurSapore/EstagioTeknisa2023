const programmer = {
    "name": "",
    "javascript": false,
    "java": false,
    "python": false
}

function handleInputLanguage( field ){ 
    for (let propriedade in programmer) {
        if(propriedade == field.id){
            programmer[propriedade] = document.getElementById(field.id).checked;
            return;
        }
    }
}

function register(){
    let name = document.getElementById('name').value;
    if(name !== ""){
        programmer.name = name;
        registerProgrammer();
    }else{
        mostraResultado(`Campo nome é obrigatório.`, 'red'); 
    }
}

async function registerProgrammer(){
    await axios.post('http://localhost:5000/createProgrammer', programmer)
    .then(function (response) {
        mostraResultado(`Cadastro realizado com sucesso.`, 'green');
        return response;
    })
    .catch(function (error) {
        if (error.response) {
        throw error.response
        } else if (error.request) {
        console.log(error.request);
        } else {
        console.log('Erro', error.message);
        }
        mostraResultado(`Falha ao realizar o cadastro.`, 'red');
    });
}

function mostraResultado(texto, cor){
    const separator = document.getElementById('separator');
    const span = document.getElementById('resultado');
    separator.style.display = "flex";
    span.innerHTML = texto;
    span.style.color = cor;

}