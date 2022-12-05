// variáveis globais
var collection = [];
var global = 0;
var matriz = [];
var valores = [[]];

$(document).ready(function(){

  // monta a matriz 
  criaMatriz();

  // valida entrada por entrada
  $('#validador').keyup(function(e){
    if(matriz.length > 0){
      validaPalavra(e);
    }
  });
});

// função principal (monta estados, distribui eles na numa matriz de vetores e cria a view)
function criaMatriz(){

  valores = [[]];
  global = 0;
  matriz = [];

  montaEstados();
  matriz = geraLinhas();
  populaTabela(matriz);
}

// monta os estados do automato
function montaEstados(){

  // lê todas as palavras inseridas
  for (var i = 0; i < collection.length; i++) {
    var estadoAtual = 0;
    var palavra = collection[i];

    // lê todos os caracteres das palavras e distribui os estados
    for(var j = 0; j < palavra.length; j++){

      if(typeof valores[estadoAtual][palavra[j]] === 'undefined'){
        var novoEstado = global + 1;
        valores[estadoAtual][palavra[j]] = novoEstado;
        valores[novoEstado] = [];
        global = estadoAtual =+ novoEstado;
      } else {
        estadoAtual = valores[estadoAtual][palavra[j]];
      }
      // determina o estado final do palavra >> * << 
      if(j == palavra.length - 1){
        valores[estadoAtual]['final'] = true;
      }
    }
  }
}

// gera linhas da matriz
function geraLinhas(){
  var vetores = [];
  for (var i = 0; i < valores.length; i++) {
    var iniAlfabeto = 'a';
    var fimAlfabeto = 'z';
    var temp = [];
    temp['estado'] = i;

    for (var j = iniAlfabeto.charCodeAt(0); j <= fimAlfabeto.charCodeAt(0); j++) {
      var letra = String.fromCharCode(j);

      // se não tiver uma letra na posição esperada retorna um -
      if(typeof valores[i][letra] === 'undefined'){
        temp[letra] = '-'
      } else {
        temp[letra] = valores[i][letra]
      }
    }
    if(typeof valores[i]['final'] !== 'undefined'){
      temp['final'] = true;
    }
    vetores.push(temp);
  };
  return vetores;
}

// gera view 
function populaTabela(vetores){
  var iniAlfabeto = 'a';
  var fimAlfabeto = 'z';
  var tabelaHTML = $('#automato');
  tabelaHTML.html('');
  var tr = $(document.createElement('tr'));
  var th = $(document.createElement('th'));
  th.html('');
  tr.append(th);

  // cria o cabeçalho 
  for (var j = iniAlfabeto.charCodeAt(0); j <= fimAlfabeto.charCodeAt(0); j++) {
    var th = $( document.createElement('th') );
    th.html(String.fromCharCode(j));
    tr.append(th);
  }
  tabelaHTML.append(tr);

  // cria a coluna de estados do grid
  for(var i = 0; i < vetores.length; i++){
    var tr = $(document.createElement('tr'));
    var td = $(document.createElement('td'));

    if(vetores[i]['final']){
      td.html('q' + vetores[i]['estado'] + '*');
    } else {
      td.html('q' + vetores[i]['estado']);
    }
    tr.append(td);
    tr.addClass('state_'+vetores[i]['estado']);

    // distribui os elementos dos vetores no grid
    for (var j = iniAlfabeto.charCodeAt(0); j <= fimAlfabeto.charCodeAt(0); j++) {
      var letter = String.fromCharCode(j);
      var td = $( document.createElement('td') );
      td.addClass('letter_'+ letter);
      if(vetores[i][letter] != '-'){
        td.html('q' + vetores[i][letter]);
      } else {
        td.html('-');
      }
      tr.append(td);
    }
    tabelaHTML.append(tr);
  }
}

//adiciona tokens
function incluiToken () {
    // converte as letras para minúscula
    var value = $("#palavra").val().toLowerCase();
    
    // segue se não for valor vazio
    if(value === ""){ 
      $('#palavra').addClass('error');
      setTimeout(function(){
        $('#palavra').removeClass('error');
      }, 2000);
    } else {

      // valida caracteres aceitos
      var segue = true;     
      for (var i = 0; i < value.length; i++) {
        if(!((value[i] >= 'a' && value[i] <= 'z') || value[i] === ' ')){
          alert('Caractere inválido: ' + value[i]);
          segue = false;
          break;
        }
      }
      // caso tenha somente caracteres aceitos segue
      if (segue) {

        // faz o split da string por espaço caso exista mais de uma palavra
        // se tiver mais de uma palavra, adiciona
        value = value.split(" ");
        var tamanho = collection.length;
        if(value.length > 1){
          for (i = 0; i < value.length; i++) {
            var existe = false;
            tamanho = collection.length;

            // verifica se a palavra já existe ou se é um valor vazio
            if(value[i] !== ""){
              for (j = 0; j < collection.length; j++) {
                if(value[i] === collection[j]){
                  existe = true;
                }
              }

              // adiciona se não houver
              if(!existe){
                $('#palavras').append($('<div class="tabela" id="palavra' + tamanho + '">' + value[i] + ' </div>'));
                collection.push(value[i]);
              }
            }
          }
        } else {

          // checa próxima palava do split
          var existe = false;
          for (j = 0; j < collection.length; j++) {
            if(value[0] === collection[j]){
              existe = true;
            }
          }
          // adiciona caso não exista
          if(!existe){
            $('#palavras').append($('<td class="tabela" id="palavra' + tamanho + '">' + value[0] +
            ' </td>'));
            collection.push(value[0]);
          }
        }
        // limpa input
        $("#palavra").val("");
      }
    }
    $('#automato').empty();
    criaMatriz();
}

// remove todas as palavras da lista e da matriz do automato
function limpaListaTokens (e) {
  $('#palavra').val("");
  $('#validador').val("");
  collection = [];
  var palavra = collection[e];
  var temp = [];
  collection = [];
  collection = temp;
  temp = [];
  $('#palavras').empty();
  $('#automato').empty();
  criaMatriz();
}

// validador
function validaPalavra(){
  var palavras = $('#validador').val().toLowerCase();
  var estado = 0;

  // se não tiver nada para validar, limpa as cores
  if(palavras.length == 0){
    $('#validador').removeClass('certo');
    $('#validador').removeClass('erro');
    $('#automato tr').removeClass('selectedStatus');
    $('#automato td').removeClass('selectedField');
    $('#automato .state_' + estado).removeClass('selectedStatusFalse');
    $('#automato .letter_' + palavras[i]).removeClass('selectedFieldFalse');
  }

  // para cada caractere lido 
  for (var i = 0; i < palavras.length; i++) {

    //  se for um caractere do alfabeto
    if(palavras[i] >= 'a' && palavras[i] <= 'z'){
      $('#automato tr').removeClass('selectedStatus');
      $('#automato td').removeClass('selectedField');
      $('#automato .state_' + estado).addClass('selectedStatus');
      $('#automato .letter_' + palavras[i]).addClass('selectedField');

      // se o caractere for diferente de -
      if(matriz[estado][palavras[i]] != '-'){

        $('#automato .state_' + estado).addClass('selectedStatus');
        $('#automato .letter_' + palavras[i]).addClass('selectedField');

        // identifica o estado da matriz esperado e compara com o que está no grid, caso esteja correto, seta como aceito
        estado = matriz[estado][palavras[i]];
        $('#validador').addClass('certo');
        $('#validador').removeClass('erro');
        $('#automato .state_' + estado).removeClass('selectedStatusFalse');
        $('#automato .letter_' + palavras[i]).removeClass('selectedFieldFalse');
        $('#automato .state_' + estado).removeClass('selectedStatusSpace');
        $('#automato .letter_' + palavras[i]).removeClass('selectedFieldSpace');

      } // caso não esteja correto, seta como falso
       else {
        $('#automato .state_' + estado).addClass('selectedStatusFalse');
        $('#automato .letter_' + palavras[i]).addClass('selectedFieldFalse');
        $('#validador').removeClass('certo');
        $('#validador').addClass('erro');
        break;
      }
      // se for um espaço lido
    } else if(palavras[i] == ' '){
      $('#validador').removeClass('certo');
      $('#validador').addClass('erro');
       $('#automato tr').removeClass('selectedStatus');
       $('#automato td').removeClass('selectedField');
       alert('Caractere inválido: " " apague-o para continuar!');
       break;
      // se for caractere não previsto lido
    } else {
      $('#validador').removeClass('certo');
      $('#validador').addClass('erro');
      $('#automato tr').removeClass('selectedStatus');
      $('#automato td').removeClass('selectedField');
      alert('Caractere inválido: ' + palavras[i] + ' apague-o para continuar!');
      break;
    }

  };

}