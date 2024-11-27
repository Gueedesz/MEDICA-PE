document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message'); // Certifique-se de que o ID existe no HTML

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                // Realizar a requisição POST
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                // Verificar se a resposta é HTTP 200 (sucesso)
                const data = await response.json();
                if (!response.ok) {
                    // Exibir mensagem de erro
                    if (messageDiv) {
                        messageDiv.style.display = 'block';
                        messageDiv.textContent = data.error || 'Erro desconhecido.';
                    }
                    return;
                }

                // Sucesso: Ocultar a mensagem de erro, se houver
                if (messageDiv) {
                    messageDiv.style.display = 'none';
                }

                alert(data.message || 'Login bem-sucedido!');
                window.location.href = '/'; // Redireciona para a página inicial
            } catch (error) {
                console.error('Erro no login:', error);
                if (messageDiv) {
                    messageDiv.style.display = 'block';
                    messageDiv.textContent = 'Erro de conexão com o servidor.';
                }
            }
        });
    }
});
