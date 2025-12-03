// ================================
// CONFIGURAÇÃO
// ================================
const API_URL = "http://localhost:3000";

// ================================
// SALVAR / CARREGAR LOGIN
// ================================

function salvarLogin(token, usuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
}

function obterUsuario() {
    const dados = localStorage.getItem("usuario");

    // Se não existir nada no localStorage
    if (!dados) return null;

    try {
        return JSON.parse(dados);
    } catch (e) {
        console.error("Erro ao tentar ler o usuário salvo:", e);
        // Se estiver corrompido, apagar
        localStorage.removeItem("usuario");
        return null;
    }
}

function obterToken() {
    return localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/paginas/entrar.html";
}

// ================================
// LOGIN
// ================================
async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro || "Erro ao fazer login.");
        return;
    }

    salvarLogin(dados.token, dados.usuario);
    window.location.href = "/paginas/index.html";
}

// ================================
// CRIAR CONTA
// ================================
async function criarConta(event) {
    event.preventDefault();

    const nome = document.getElementById("cad-nome").value;
    const email = document.getElementById("cad-email").value;
    const senha = document.getElementById("cad-senha").value;
    const repetir = document.getElementById("cad-confirmar").value;

    if (senha !== repetir) {
        alert("As senhas não coincidem!");
        return;
    }

    const resposta = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro || "Erro ao criar conta.");
        return;
    }

    alert("Conta criada com sucesso! Faça login agora.");
    window.location.href = "/paginas/entrar.html";
}

// ================================
// ATUALIZAR NAVBAR
// ================================
function atualizarNavbar() {
    const usuario = obterUsuario();
    const areaLogin = document.getElementById("area-login");

    if (!areaLogin) return;

    if (!usuario) {
        // Usuário deslogado
        areaLogin.innerHTML = `
            <a href="/paginas/entrar.html" class="btn btn-primary">
                Entrar
            </a>
        `;
    } else {
        // Usuário logado
        areaLogin.innerHTML = `
            <div class="dropdown">
              <button class="btn btn-light dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                <img src="https://via.placeholder.com/35" class="rounded-circle me-2">
                <span>${usuario.nome}</span>
              </button>

              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#">Perfil</a></li>
                <li><a class="dropdown-item" href="#">Configurações</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Sair</a></li>
              </ul>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", atualizarNavbar);