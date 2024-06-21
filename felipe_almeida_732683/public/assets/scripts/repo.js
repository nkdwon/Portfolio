
/* PÁGINA REPO.HTML */

// Função para obter parâmetros de consulta da URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get('id')
  };
}

// Função para buscar dados do repositório do GitHub por ID
async function fetchRepoDataById(repoId) {
  try {
    // Busca todos os repositórios do usuário para encontrar o ID correspondente
    const response = await fetch('https://api.github.com/users/nkdwon/repos');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const repos = await response.json();
    const repoData = repos.find(repo => repo.id == repoId);
    
    if (repoData) {
      // Busca os tópicos do repositório se encontrar o repositório pelo ID
      const topicsResponse = await fetch(`https://api.github.com/repos/nkdwon/${repoData.name}/topics`, {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json' // Cabeçalho necessário para acessar os tópicos
        }
      });
      if (!topicsResponse.ok) {
        throw new Error(`HTTP error! status: ${topicsResponse.status}`);
      }
      const topicsData = await topicsResponse.json();
      repoData.topics = topicsData.names;
    }

    return repoData;
  } catch (error) {
    console.error('Erro ao buscar dados do repositório:', error);
    return null;
  }
}

// Função para atualizar a página com os dados do repositório
function updateRepoPage(repoData) {
  if (!repoData) {
    document.getElementById('repo-name').textContent = 'Repositório não encontrado';
    return;
  }
  
  document.getElementById('repo-name').textContent = repoData.name || 'Nome não disponível';
  document.getElementById('repo-description').textContent = repoData.description || 'Descrição não disponível';
  document.getElementById('repo-created-at').textContent = repoData.created_at ? new Date(repoData.created_at).toLocaleDateString('pt-BR') : 'Data não disponível';
  document.getElementById('repo-language').textContent = repoData.language || 'Linguagem não disponível';
  document.getElementById('repo-url').href = repoData.html_url || '#';
  document.getElementById('repo-url').textContent = repoData.html_url || 'Link não disponível';
  document.getElementById('repo-license').textContent = repoData.license.name || 'Licença não disponível';

  const topicsContainer = document.getElementById('repo-topics');
  topicsContainer.innerHTML = ''; // Limpa os tópicos existentes
  if (repoData.topics && repoData.topics.length > 0) {
    repoData.topics.forEach(topic => {
      const topicItem = document.createElement('li');
      topicItem.className = 'topicos';
      topicItem.textContent = topic;
      topicsContainer.appendChild(topicItem);
    });
  } else {
    topicsContainer.innerHTML = '<li class="topicos">Nenhum tópico disponível</li>';
  }
}

// Obter o ID do repositório da URL e atualizar a página
const queryParams = getQueryParams();
if (queryParams.id) {
  fetchRepoDataById(queryParams.id).then(repoData => {
    updateRepoPage(repoData);
  });
} else {
  document.getElementById('repo-name').textContent = 'Repositório não especificado';
}
