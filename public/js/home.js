document.addEventListener('DOMContentLoaded', function () {

    // Função para verificar se o dispositivo é desktop
    function isDesktop() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Detecta dispositivos móveis comuns
      const isMobile = /android|iPhone|iPad|iPod|BlackBerry|Windows Phone|webOS/i.test(userAgent);

      return !isMobile; // Retorna true se for desktop
  }

  // Exibe a mensagem de "não disponível" e interrompe a execução se for desktop
  if (isDesktop()) {
      document.body.innerHTML = `
          <div style="text-align: center; padding: 20%; font-family: Arial, sans-serif;">
              <h1>Versão não disponível</h1>
              <p>Atualmente, nossa aplicação está disponível apenas para dispositivos móveis.</p>
              <p>Por favor, acesse o site em um dispositivo móvel.</p>
          </div>
      `;
      return; // Interrompe a execução do restante do script
  }
  // Inicializar o mapa
  var map = L.map('map').setView([-8.200774, -34.932007], 13); // Latitude e longitude inicial do mapa

  // Adicionar camada do OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Fazer uma solicitação para obter todos os postos do backend
  fetch('/api/postos')
    .then(response => response.json())
    .then(postos => {
      if (postos.length > 0) {
        // Filtrar postos válidos com coordenadas numéricas
        const validPostos = postos.filter(posto => {
          const lat = parseFloat(posto.lat);
          const lon = parseFloat(posto.lon);
          return !isNaN(lat) && !isNaN(lon); // Apenas coordenadas numéricas
        });

        validPostos.forEach(posto => {
          const lat = parseFloat(posto.lat);
          const lon = parseFloat(posto.lon);

          // Adicionar marcadores no mapa para cada posto com coordenadas válidas
          L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${posto.name}</b><br>${posto.address}`);
        });

        // Atualizar a lista de postos no HTML
        updatePostosList(validPostos);
      } else {
        alert('Nenhum posto encontrado no banco de dados.');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar os postos:', error);
      alert('Ocorreu um erro ao buscar os postos. Tente novamente.');
    }
  );

  // Adicionar um evento ao botão de pesquisa
  document.getElementById('searchButton').addEventListener('click', function () {
    var location = document.getElementById('locationInput').value;

    if (location) {
      // Fazer uma solicitação para a API do Nominatim (OpenStreetMap)
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            // Pegar a primeira localização retornada
            var latitude = parseFloat(data[0].lat);
            var longitude = parseFloat(data[0].lon);

            // Centralizar o mapa na localização encontrada
            map.setView([latitude, longitude], 13);

            // Adicionar um marcador no mapa para a localização pesquisada
            L.marker([latitude, longitude]).addTo(map)
              .bindPopup(`<b>${location}</b>`)
              .openPopup();

            // Filtrar e exibir os postos dentro de 5 km da localização pesquisada
            fetch('/api/postos')
              .then(response => response.json())
              .then(postos => {
                // Filtrar postos válidos e dentro do raio de 5 km
                const nearbyPostos = postos.filter(posto => {
                  const lat = parseFloat(posto.lat);
                  const lon = parseFloat(posto.lon);
                  const distance = getDistanceFromLatLonInKm(latitude, longitude, lat, lon);
                  return !isNaN(lat) && !isNaN(lon) && distance <= 5; // Apenas coordenadas válidas e dentro de 5 km
                });

                // Atualizar a lista de postos no HTML
                updatePostosList(nearbyPostos);

                if (nearbyPostos.length === 0) {
                  alert('Nenhum posto encontrado dentro de 5 km do local pesquisado.');
                }
              });
          } else {
            alert('Local não encontrado. Tente novamente.');
          }
        })
        .catch(error => {
          console.error('Erro ao buscar a localização:', error);
          alert('Ocorreu um erro ao buscar a localização. Tente novamente.');
        });
    } else {
      alert('Por favor, insira um local para pesquisar.');
    }
  });

  // Função para atualizar a lista de postos no HTML
  function updatePostosList(postos) {
    const postosList = document.getElementById('postosList');
    postosList.innerHTML = ''; // Limpar a lista atual

    postos.forEach(posto => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-start';

      listItem.innerHTML = `
        <div class="ms-2 me-auto">
          <div class="fw-bold">${posto.name}</div>
          ${posto.address}
        </div>
        <a href="/estoque/${encodeURIComponent(posto._id)}">
          <button class="btn btn-primary" type="button">Verificar estoque</button>
        </a>
      `;

      postosList.appendChild(listItem);
    });
  }

  // Funções de cálculo de distância
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const helpButton = document.getElementById('help-button');
  const helpPopup = document.getElementById('help-popup');

  let hasScrolled = false; // Flag para verificar se o usuário já rolou

  // Detecta o scroll e mostra o popup apenas na primeira rolagem
  window.addEventListener('scroll', () => {
    if (!hasScrolled) {
      hasScrolled = true; // Evita que o popup apareça novamente após a primeira rolagem
      showHelpPopup();
    }
  });

  // Função para mostrar o popup
  function showHelpPopup() {
    helpPopup.style.display = 'block';

    // Oculta o popup automaticamente após 3 segundos
    setTimeout(() => {
      helpPopup.style.display = 'none';
    }, 5000);
  }

  // Alterna o estado do popup (manual)
  function toggleHelpPopup() {
    if (helpPopup.style.display === 'none' || !helpPopup.style.display) {
      showHelpPopup();
    } else {
      helpPopup.style.display = 'none';
    }
  }

    helpButton.addEventListener('click', () => {
      window.location.href = '/ajuda';
    })

    helpPopup.addEventListener('click', () => {
      window.location.href = '/ajuda';
    })

});
