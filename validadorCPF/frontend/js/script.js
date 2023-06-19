
$(document).ready(function(){
    $('#cpf').inputmask('999.999.999-99')
});


function validaCPF(){
    const cpfFormatado = document.getElementById('cpf').value;
    const cpf = limpaFormatacao(cpfFormatado);
    
    if(cpf.length !== 11){
        mostraResultado('CPF deve conter 11 dígitos.', 'red');
        return;
    }

    if (verificaDigitosRepetidos(cpf)){
        mostraResultado('CPF não pode conter repetição do 1º dígito.', 'red');
        return;
    }

    const digito1= calcularDigitoVerificador(cpf,1);

    if(!digito1){
        mostraResultado(`CPF inválido. ${cpfFormatado}`, 'red');
        return;
    }

    const digito2= calcularDigitoVerificador(cpf,2);
    
    if(!digito2){
        mostraResultado(`CPF inválido. ${cpfFormatado}`, 'red');
        return;
    }
    mostraResultado(`CPF válido: ${cpfFormatado}`, 'green');
    postCpf(cpf);

}

function calcularDigitoVerificador(cpf, posicao){
    const sequencia = cpf.slice(0,8 + posicao).split('');
    let soma = 0;
    let multiplicador = 9 + posicao;

    for(const numero of sequencia){
        soma+=multiplicador * Number(numero);
        multiplicador--;
    }

    const restoDivisao = (soma*10)%11;
    const digito = cpf.slice(8 + posicao, 9 + posicao); 

    return restoDivisao == digito;
}

function limpaFormatacao(cpf){
    cpf = cpf.replace(/\D/g, '');
    return cpf;
}

function mostraResultado(texto, cor){
    const separator = document.getElementById('separator');
    const span = document.getElementById('resultado');
    separator.style.display = "flex";
    span.innerHTML = texto;
    span.style.color = cor;
    if(cor="green"){
        const span = document.getElementById('prosseguir');
        span.innerHTML = `<a href="register.html">Prosseguir com o cadastro</a>`;
    }

}

function verificaDigitosRepetidos(cpf){
    return cpf.split('').every((d)=> d === cpf[0]);
}

async function postCpf(cpf){
    await axios.post('http://localhost:5000/createProgrammerCpf', cpf)
    .then(function (response) {
        mostraResultado(`CPF cadastrado com sucesso.`, 'green');
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
        mostraResultado(`CPF não foi cadastrado.`, 'red');
    });
}