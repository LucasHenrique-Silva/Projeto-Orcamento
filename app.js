class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if (this[i] === undefined || this[i] === '' || this[i] === null){
                return false
            }
        }
        return true
    }

}
class BD{

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }


    geProxId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        
        let id = this.geProxId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosOsRegistros(){
        //ARRAY
        let despesas = Array()
        let id = localStorage.getItem('id')

        //recuperar tudo
        for(let i = 1; i <=id; i++){

            //despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //Verificar se nao perdeu/excluiu/pulou dados
            if (despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosOsRegistros()
        //ano
        if (despesa.ano!= ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }
        
        //mes
        if (despesa.mes!= ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }
        //dia
        if (despesa.dia!= ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }
        //tipo
        if (despesa.tipo!= ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }
        //descricao
        if (despesa.descricao!= ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }
        //valor
        if (despesa.valor!= ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }
        return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new BD()

function cadastrarDespesa(){



    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    console.log();

    let despesa = new Despesa(
        ano.value, 
        mes.value, dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value)


        if(despesa.validarDados()){
            bd.gravar(despesa);
            //Dialogo de sucesso
            let titulo = document.getElementById('modalTitulo')
            titulo.className = 'modal-header text-success'
            titulo.innerHTML = 'Salvo com sucesso'
            let message = document.getElementById('modalMessage')
            message.innerHTML = 'Dados foram salvos com sucesso'
            let botao = document.getElementById('modalBotao')
            botao.className = 'btn btn-success'
            botao.innerHTML = 'Salvar'
            $('#RegistraDespesa').modal('show')
            document.getElementById('ano').value = ''
            document.getElementById('mes').value = ''
            document.getElementById('dia').value = ''
            document.getElementById('tipo').value = ''
            document.getElementById('descricao').value = ''
            document.getElementById('valor').value = ''
                
        }else{
            //dialogo de erro
            let titulo = document.getElementById('modalTitulo')
            titulo.className = 'modal-header text-danger'
            titulo.innerHTML = 'Erro ao gravar dados'
            let message = document.getElementById('modalMessage')
            message.innerHTML = 'Nao foi possivel salvar os dados'
            let botao = document.getElementById('modalBotao')
            botao.className = 'btn btn-danger'
            botao.innerHTML = 'Voltar e corrigir'
            $('#RegistraDespesa').modal('show')
        }
        
}

function carregarListaDespesa(despesas = Array()){
    if(despesas.length == 0){
        despesas = bd.recuperarTodosOsRegistros()
    }
    var listaDespesas = document.getElementById('listaDespesa')
    listaDespesas.innerHTML = ''
    /* <tr>
    <td>data</td>
    <td>tipo</td>
    <td>descricao</td>
    <td>valor</td>
    </tr>*/
    //pecorre o array despesas
    despesas.forEach(function(d){
        //criando a linha tr
        let linha = listaDespesas.insertRow()
        //criar as colunas th
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        

        //ajustar o tipo
        switch(d.tipo){
            case '1':d.tipo='Alimentação'
                break
            case '2':d.tipo='Educação'
                break
            case '3':d.tipo='Lazer'
                break
            case '4':d.tipo='Saúde'
                break
            case '5':d.tipo='Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = `${d.descricao}`
        linha.insertCell(3).innerHTML = `${d.valor}`
        
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'
        btn.id = 'id_despesa_'+d.id
        btn.onclick = function(){
            
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        
    })
}


function PesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)


    let despesas = bd.pesquisar(despesa)

    carregarListaDespesa(despesas)
}