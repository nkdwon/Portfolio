
//SEÇÃO PERFIL

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


//SEÇÃO REPOSITÓRIOS

const repositories = document.querySelector('#secao_repositorios')
const num_repositories = document.querySelector('#num_repos')

function getReposApiGithub() {
  fetch('https://api.github.com/users/nkdwon/repos').then(async res => {
    if (!res.ok) {
      throw new Error(res.status)
    }
    
    let data = await res.json()
    let count = 0; // Contador de repositórios exibidos

    data.map(item => {
      if (item.name === 'nkdwon') {
        // Ignora o repositório 'nkdwon'
        return;
      }
      let secao_repos = document.createElement('div')

      secao_repos.innerHTML = `
      <div class="card">
        <a href="${item.html_url || '#'}"> 
          <div class="card-body">
            <div class="card-title">
              <h3>${item.name || 'Nome não disponível'}</h3>
              <span class="date-create">${Intl.DateTimeFormat('pt-BR').format(new Date(item.created_at))}</span>
            </div>
            <p class="card-text">${item.description || 'Descrição não disponível'}</p>
          </div>
        </a>
      </div>`
      repositories.appendChild(secao_repos);
      count++;
    });
    num_repositories.textContent = `(${count})`
  }).catch(error => {
    // Tratar erros da requisição fetch
    console.error('Erro:', error);
    // Opcional: informar o usuário sobre o erro
    num_repositories.textContent = '(Erro ao carregar repositórios)';
  });
}

getReposApiGithub();

//SEÇÃO CARROSSEL


//SEÇÃO COLEGAS

const equipeContainer = document.querySelector('.containerEquipe');

// Função para buscar os dados do JSON
async function fetchJsonData() {
  try {
    const response = await fetch('https://nkdwon.github.io/Portfolio/felipe_almeida_732683/db/db.json');
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
  equipeContainer.innerHTML = ''; // Limpa o conteúdo existente
  colegas.forEach(colega => {
    let colegaDiv = document.createElement('div');
    colegaDiv.classList.add('colega');

    colegaDiv.innerHTML = `
      <a href="${colega.url_profile || '#'}" target="_blank">
        <img src="${colega.url_foto || 'assets/img/default.jpg'}" alt="Foto ${colega.nome}" />
        <h3 class="nomePessoa">${colega.nome || 'Nome não disponível'}</h3>
      </a>
    `;

    equipeContainer.appendChild(colegaDiv);
  });
}

// Chamar a função para buscar os dados e atualizar a seção de equipe
fetchJsonData().then(data => {
  if (data) {
    updateEquipeSection(data.colegas);
  }
});