document.addEventListener('DOMContentLoaded', () => {
    // Define openModal and attach it to the global scope
    window.openModal = function(title, description) {
      document.getElementById('movie-title').textContent = title;
      document.getElementById('movie-description').textContent = description;
      document.getElementById('modal').style.display = 'block';
    };
  
    // Define closeModal and attach it to the global scope
    window.closeModal = function() {
      document.getElementById('modal').style.display = 'none';
    };
  
    // Define selecionarSessao and attach it to the global scope
    window.selecionarSessao = function(time, room) {
      const movieTitle = document.getElementById('movie-title').textContent;
  
      const data = new Date();
      const dataFormatada = data.toISOString().split('T')[0]; // YYYY-MM-DD
      // Save data to sessionStorage
      sessionStorage.setItem('filmeAtual', movieTitle);
      sessionStorage.setItem('sessaoAtual', time);
      sessionStorage.setItem('salaAtual', room);
      sessionStorage.setItem('dataAtual', dataFormatada);
      sessionStorage.setItem('precoAtual', 20.00);
  
      // Redirect to assentos.html with query parameters
      const assentosUrl = `assentos.html?movie=${encodeURIComponent(movieTitle)}&time=${encodeURIComponent(time)}&room=${encodeURIComponent(room)}`;
      window.location.href = assentosUrl;
    };
  
    // Close modal when clicking outside
    window.onclick = function(event) {
      const modal = document.getElementById('modal');
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  
    // Seat selection logic for assentos.html
    const container = document.getElementById('assentos');
    if (container) {
      const assentosBotao = document.getElementById('assentosBotao');
      const linhas = 6;
      const colunas = 10;
      const totalassentos = linhas * colunas;
      const STORAGE_KEY = 'sessoes';
  
      const filmeAtual = sessionStorage.getItem('filmeAtual');
      const sessaoAtual = sessionStorage.getItem('sessaoAtual');
      const salaAtual = sessionStorage.getItem('salaAtual');
      const dataAtual = sessionStorage.getItem('dataAtual');
      const precoAtual = sessionStorage.getItem('precoAtual');
  
      let sessoes = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
  
      let sessao = sessoes.find(s =>
        s.filme === filmeAtual &&
        s.sessão === sessaoAtual &&
        s.sala === salaAtual &&
        s.data === dataAtual
      );
  
      if (!sessao) {
        sessao = {
          filme: filmeAtual,
          sessão: sessaoAtual,
          sala: salaAtual,
          data: dataAtual,
          preço: precoAtual,
          assentosOcupados: []
        };
        sessoes.push(sessao);
      }
  
      const getSeatLabel = (i) => {
        const letraLinha = String.fromCharCode(65 + Math.floor(i / colunas)); // 65 = 'A'
        const numeroColuna = (i % colunas) + 1;
        return `${letraLinha}${numeroColuna}`;
      };
  
      for (let i = 0; i < totalassentos; i++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.dataset.index = i;
  
        const label = document.createElement('span');
        label.classList.add('seat-label');
        label.textContent = getSeatLabel(i);
        seat.appendChild(label);
  
        if (sessao.assentosOcupados.includes(i)) {
          seat.classList.add('occupied');
        }
  
        seat.addEventListener('click', () => {
          if (seat.classList.contains('occupied')) return;
          seat.classList.toggle('selected-seat');
        });
  
        container.appendChild(seat);
      }
  
      assentosBotao.addEventListener('click', () => {
        const selectedassentos = document.querySelectorAll('.seat.selected-seat');
  
        selectedassentos.forEach(seat => {
          const index = parseInt(seat.dataset.index);
          if (!sessao.assentosOcupados.includes(index)) {
            sessao.assentosOcupados.push(index);
            seat.classList.remove('selected-seat');
            seat.classList.add('occupied');
          }
        });
  
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessoes));
  
        window.location.href = 'combos.html';
      });
    }

    const botoes = document.querySelectorAll('.comboBotao');

    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            const comboNome = botao.getAttribute('data-name');
            const comboPreco = parseFloat(botao.getAttribute('data-price'));
            const comboPrecoFormatado = comboPreco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
    
            const combo = {
                nome: comboNome,
                preco: comboPrecoFormatado
            };
    
            sessionStorage.setItem('combo', JSON.stringify(combo));
            window.location.href = 'pagamento.html';
        });
    });
    
    const combo = JSON.parse(sessionStorage.getItem('combo'));
    const filme = sessionStorage.getItem('filmeAtual');
    const sessao = sessionStorage.getItem('sessaoAtual');
    const sala = sessionStorage.getItem('salaAtual');
    const data = sessionStorage.getItem('dataAtual');
    const precoIngresso = parseFloat(sessionStorage.getItem('precoAtual'));
    const sessoes = JSON.parse(sessionStorage.getItem('sessoes'));

    // Encontrar a sessão correta
    const sessaoAtual = sessoes.find(s =>
        s.filme === filme &&
        s.sessão === sessao &&
        s.sala === sala &&
        s.data === data
      );

    // Calcular quantidade de assentos ocupados
    const assentosOcupados = sessaoAtual?.assentosOcupados || [];
    const quantidadeAssentos = assentosOcupados.length;

    // Calcular total do ingresso (preço do ingresso * quantidade de assentos)
    const precoTotalIngresso = precoIngresso * quantidadeAssentos;

    // Preço do combo
    const precoCombo = parseFloat(combo.preco.replace("R$", "").replace(",", "."));

    // Calcular preço total
    const total = (precoTotalIngresso + precoCombo).toFixed(2).replace('.', ',');

    // Exibir os dados na tela
    const resumoDiv = document.getElementById('resumoCompra');
    resumoDiv.innerHTML = `
      <p><strong>Filme:</strong> ${filme}</p>
      <p><strong>Sessão:</strong> ${sessao}</p>
      <p><strong>Sala:</strong> ${sala}</p>
      <p><strong>Data:</strong> ${data}</p>
      <p><strong>Assentos:</strong> ${assentosOcupados.map(a => `${a + 1}`).join(', ')}</p>
      <p><strong>Combo:</strong> ${combo.nome} - ${combo.preco}</p>
      <p><strong>Preço do Ingresso:</strong> R$ ${precoIngresso} x ${quantidadeAssentos} assentos = R$ ${precoTotalIngresso.toFixed(2).replace('.', ',')}</p>
      <p><strong>Total:</strong> R$ ${total}</p>
    `;

    // Finalizar compra
    document.getElementById('finalizarCompra').addEventListener('click', () => {
      const compraFinal = {
        filme,
        sessao,
        sala,
        data,
        assentos: assentosOcupados,
        combo: combo.nome,
        total: total
      };

      localStorage.setItem('compraConcluida', JSON.stringify(compraFinal));
      console.log('Compra realizada com sucesso!');
      sessionStorage.clear();
    //   redirect to success.html
      window.location.href = 'index.html';
    });
  });