// componentes/navbar.js

async function loadNavbar() {
  const placeholder = document.getElementById("navbar-placeholder");

  if (!placeholder) return;

  try {
    // Caminho correto para páginas dentro de /paginas
    const response = await fetch("../componentes/navbar.html");
    const html = await response.text();
    placeholder.innerHTML = html;

    inicializarNavbarLogica();

  } catch (error) {
    console.error("Erro ao carregar a Navbar:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadNavbar);


// ----------------------------------------------------------
function inicializarNavbarLogica() {
  const btnLogin = document.getElementById("btn-login");
  const userDropdown = document.getElementById("user-dropdown");
  const userPhoto = document.getElementById("user-photo");
  const userName = document.getElementById("user-name");
  const logoutBtn = document.getElementById("logout-btn");

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  function atualizarNavbar() {
    if (usuario) {
      btnLogin.classList.add("d-none");
      userDropdown.classList.remove("d-none");

      userName.textContent = usuario.nome;
      userPhoto.src = usuario.foto || "https://via.placeholder.com/35";

    } else {
      btnLogin.classList.remove("d-none");
      userDropdown.classList.add("d-none");
    }
  }

  atualizarNavbar();

  // ABRIR A PÁGINA DE LOGIN (AGORA CORRETO!)
  btnLogin?.addEventListener("click", () => {
    window.location.href = "/paginas/entrar.html";
  });

  // SAIR
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.reload();
  });
}
