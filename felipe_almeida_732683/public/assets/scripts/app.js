
/* SEÇÃO PERFIL */

const bio = document.querySelector('#secao_perfil');

function getBioApiGithub() {
  fetch('https://api.github.com/users/nkdwon')
    .then(async res => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      let data = await res.json();

      bio.innerHTML = `
        <img src="${data.avatar_url}" alt="Profile Image" />
        <div id="bio">
          <h3>${data.name || 'Nome não disponível'}</h3>
          <p>${data.bio || 'Biografia não disponível'}</p>
          <h5>Location: ${data.location || 'Localização não disponível'}</h5>
          <h5>
            Site: <a href="${data.blog || '#'}">${data.blog || 'Site não disponível'}</a>
          </h5>
          <div id="SocialMedia">
            <a href="https://github.com/${data.login}">
              <img src="assets/img/brand-github.svg" alt="Github Image Link" />
            </a>
            <a href="https://www.linkedin.com/in/felipebarrosratton/">
              <img src="assets/img/brand-linkedin.svg" alt="LinkedIn Image Link" />
            </a>
            <a href="https://www.instagram.com/felps_barros/">
              <img src="assets/img/brand-instagram.svg" alt="Instagram Image Link" />
            </a>
          </div>
        </div>
      `;
    })
    .catch(error => {
      // Tratar erros da requisição fetch
      console.error('Erro:', error);
      bio.innerHTML = '<p>Erro ao carregar dados do perfil</p>';
    });
}

getBioApiGithub();


/* SEÇÃO REPOSITÓRIOS */

const repositories = document.querySelector('#secao_repositorios');
const num_repositories = document.querySelector('#num_repos');

function getReposApiGithub() {
  fetch('https://api.github.com/users/nkdwon/repos').then(async res => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    
    let data = await res.json();
    let count = 0; // Contador de repositórios exibidos

    data.map(item => {
      if (item.name === 'nkdwon') {
        // Ignora o repositório 'nkdwon'
        return;
      }
      let secao_repos = document.createElement('div');

      secao_repos.innerHTML = `
      <div class="card">
        <a href="repo.html?id=${item.id}"> 
          <div class="card-body">
            <div class="card-title">
              <h3>${item.name || 'Nome não disponível'}</h3>
              <span class="date-create">${Intl.DateTimeFormat('pt-BR').format(new Date(item.created_at) || 'Data não disponível')}</span>
            </div>
            <p class="card-text">${item.description || 'Descrição não disponível'}</p>
          </div>
        </a>
      </div>`;
      repositories.appendChild(secao_repos);
      count++;
    });
    num_repositories.textContent = `(${count})`;
  }).catch(error => {
    // Tratar erros da requisição fetch
    console.error('Erro:', error);
    // Opcional: informar o usuário sobre o erro
    num_repositories.textContent = '(Erro ao carregar repositórios)';
  });
}

getReposApiGithub();


/* SEÇÃO CARROSSEL */

const sliderContainer = document.getElementById('slider');
const sliderNavContainer = document.getElementById('slider-nav');

// Função para buscar os dados do JSON
async function getCarrosselApiJSON() {
  try {
    const response = await fetch('http://localhost:3000/conteudoSugerido');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar o arquivo JSON:', error);
    return null;
  }
}

// Função para atualizar o carrossel
function updateCarousel(conteudoSugerido) {
  if (!conteudoSugerido || !Array.isArray(conteudoSugerido)) {
    console.error('Formato de dados inválido:', conteudoSugerido);
    return;
  }

  conteudoSugerido.forEach((item, index) => {
    // Adiciona a imagem ao carrossel
    let img = document.createElement('img');
    img.id = `slide-${index + 1}`;
    img.src = item.url_imagem || 'path/to/default-image.jpg'; // Caminho padrão se a imagem estiver ausente
    img.alt = item.titulo || 'Imagem';
    sliderContainer.appendChild(img);

    // Adiciona o link de navegação ao carrossel
    let navLink = document.createElement('a');
    navLink.href = `#slide-${index + 1}`;
    sliderNavContainer.appendChild(navLink);
  });
}

// Chamar a função para buscar os dados e atualizar o carrossel
getCarrosselApiJSON().then(data => {
  if (data) {
    updateCarousel(data);
  }
});

/* SEÇÃO COLEGA */

const equipeContainer = document.querySelector('.containerEquipe');

// Função para buscar os dados do JSON
async function fetchJsonData() {
  try {
    const response = await fetch('http://localhost:3000/colegas');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar o arquivo JSON:', error);
    return null;
  }
}

// Função para atualizar a seção de equipe
function updateEquipeSection(colegas) {
  colegas.forEach(colega => {
    let colegaDiv = document.createElement('div');
    colegaDiv.classList.add('colega');

    colegaDiv.innerHTML = `
      <a href="${colega.url_profile || '#'}" target="_blank">
        <img src="${colega.url_foto}" alt="Foto ${colega.nome}" class="colegaImagem"/>
        <h3 class="nomePessoa">${colega.nome || 'Nome não disponível'}</h3>
      </a>
    `;

    equipeContainer.appendChild(colegaDiv);
  });
}

// Chamar a função para buscar os dados e atualizar a seção de equipe
fetchJsonData().then(data => {
  if (data) {
    updateEquipeSection(data);
  }
});

