document.addEventListener('DOMContentLoaded', function () {
  const addCommentForm = document.querySelector('form[action*="/add-comment"]');
  const cpfInput = document.getElementById('cpf');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchComments');

  // Formatar CPF automaticamente enquanto o usuário digita
  if (cpfInput) {
    cpfInput.addEventListener('input', function () {
      let cpf = cpfInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      cpf = cpf.substring(0, 11); // Limita a 11 dígitos

      // Aplica a máscara de CPF: XXX.XXX.XXX-XX
      if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{3})/, '$1.$2.');
      }

      cpfInput.value = cpf; // Atualiza o campo com a formatação
    });
  }

  // Previne o reload do formulário de pesquisa e filtra os comentários dinamicamente
if (searchForm) {
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Evita recarregar a página

    const term = searchInput.value.trim(); // Obtém o termo pesquisado
    const postoId = searchForm.getAttribute('action').split('/')[2]; // Extrai o postoId da rota no formulário

    if (term) {
      // Faz a requisição ao backend para buscar comentários filtrados
      fetch(`/estoque/${postoId}/pesquisar-remedio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicamento: term }), // Envia o termo como JSON
      })
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error('Erro ao buscar comentários. Tente novamente.');
          }
        })
        .then(html => {
          document.open();
          document.write(html); // Substitui o conteúdo da página com a resposta renderizada
          document.close();
        })
        .catch(error => {
          console.error('Erro ao buscar comentários:', error);
          alert(error.message);
        });
    } else {
      alert('Por favor, insira o nome de um remédio para pesquisar.');
    }
  });
}


  // Validar CPF ao submeter o formulário de comentário
  if (addCommentForm) {
    addCommentForm.addEventListener('submit', function (e) {
      const cpf = cpfInput.value.replace(/\D/g, ''); // Sanitizar o CPF antes de validar
      const postoId = document.querySelector('input[name="postoId"]').value;

      if (!postoId || !postoId.match(/^[a-fA-F0-9]{24}$/)) {
        e.preventDefault();
        alert('ID do posto inválido. Tente novamente.');
        return;
      }

      if (!isValidCPF(cpf)) {
        e.preventDefault(); // Impede o envio do formulário
        alert('CPF inválido. Por favor, insira um CPF válido.');
        cpfInput.focus();
      }
    });
  }

  // Função para validar CPF
  function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false; // Tamanho incorreto ou todos os dígitos iguais
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;

    return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
  }
});
