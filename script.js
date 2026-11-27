/* 1. ACESSIBILIDADE WCAG 2.2 (TAMANHO DE FONTE E ALTO CONTRASTE) */
let tamanhoFonteAtual = parseInt(localStorage.getItem('mv_fonte')) || 16;
let altoContrasteAtivo = localStorage.getItem('mv_contraste') === 'true';

function aplicarAcessibilidade() {
    document.documentElement.style.setProperty('--base-font-size', tamanhoFonteAtual + 'px');
    if (altoContrasteAtivo) {
        document.body.classList.add('alto-contraste');
    } else {
        document.body.classList.remove('alto-contraste');
    }
}

function alterarFonte(delta) {
    tamanhoFonteAtual = Math.min(Math.max(14, tamanhoFonteAtual + delta), 24);
    localStorage.setItem('mv_fonte', tamanhoFonteAtual);
    aplicarAcessibilidade();
}

function alternarAltoContraste() {
    altoContrasteAtivo = !altoContrasteAtivo;
    localStorage.setItem('mv_contraste', altoContrasteAtivo);
    aplicarAcessibilidade();
}

/* 2. SISTEMA DE GAMIFICAÇÃO (EDUCAÇÃO PATRIMONIAL - 6 CONQUISTAS + AGRADECIMENTO FINAL) */
const CATALOGO_CONQUISTAS = {
    visitante: {
        icone: '🏛️',
        nome: 'Explorador Inicial da Memória Viva',
        motivo: 'Iniciou sua jornada acessando a página principal do patrimônio de Bauru.'
    },
    comparador: {
        icone: '📸',
        nome: 'Guardião Visual Antes e Depois',
        motivo: 'Utilizou o controle deslizante para comparar o passado e o presente urbano.'
    },
    historiador: {
        icone: '📜',
        nome: 'Conhecedor da Linha do Tempo',
        motivo: 'Explorou a cronologia histórica e os marcos de formação de Bauru.'
    },
    avaliador: {
        icone: '⭐',
        nome: 'Avaliador do Patrimônio',
        motivo: 'Atribuiu estrelas a um registro histórico catalogado no Acervo Dublin Core.'
    },
    colaborador: {
        icone: '🗣️',
        nome: 'Colaborador da Memória Oral',
        motivo: 'Enviou um relato ou fotografia comunitária com consentimento da LGPD.'
    },
    mestre_quiz: {
        icone: '🎓',
        nome: 'Mestre do Quiz de Bauru',
        motivo: 'Respondeu às 10 questões do Quiz Interativo e conferiu o Gabarito Oficial.'
    }
};

// Imagem exibida quando o usuário completa todas as conquistas
const IMAGEM_AGRADECIMENTO_GAMIFICACAO = "./img/agradecimento.jpeg";
const FIGURINHA_AGRADECIMENTO_GAMIFICACAO = "./img/figurinhanatalina.jpeg";
const CHAVE_AGRADECIMENTO_VISTO = "mv_agradecimento_completo_visto";

function obterConquistasValidas() {
    const salvas = JSON.parse(localStorage.getItem('mv_conquistas') || '{}');
    const validas = {};
    for (const chave in CATALOGO_CONQUISTAS) {
        if (salvas[chave]) {
            validas[chave] = CATALOGO_CONQUISTAS[chave].nome;
        }
    }
    return validas;
}

function todasConquistasCompletas() {
    const total = Object.keys(obterConquistasValidas()).length;
    const maximo = Object.keys(CATALOGO_CONQUISTAS).length;
    return total >= maximo;
}

function mostrarToastConquista(info, completouTudo = false) {
    const exibir = () => {
        const antigo = document.getElementById('toastConquistaAtivo');
        if (antigo) antigo.remove();

        const toast = document.createElement('div');
        toast.id = 'toastConquistaAtivo';
        toast.className = 'toast-conquista';
        toast.setAttribute('role', 'status');
        toast.innerHTML = `
            <strong>${info.icone} Nova Conquista Desbloqueada!</strong>
            <div><strong>${info.nome}</strong></div>
            <small>${info.motivo}</small>
            ${completouTudo ? `<div style="margin-top:8px;"><button type="button" class="btn-wcag" onclick="abrirModalAgradecimento()">🎉 Ver Mensagem de Agradecimento</button></div>` : ''}
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, completouTudo ? 8000 : 5000);
    };

    if (document.body) {
        exibir();
    } else {
        window.addEventListener('DOMContentLoaded', exibir);
    }
}

function abrirModalAgradecimento() {
    const modalConquistas = document.getElementById('modalConquistasOverlay');
    if (modalConquistas) modalConquistas.remove();

    const existente = document.getElementById('modalAgradecimentoOverlay');
    if (existente) existente.remove();

    const overlay = document.createElement('div');
    overlay.id = 'modalAgradecimentoOverlay';
    overlay.className = 'modal-conquistas-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    overlay.innerHTML = `
        <div class="modal-conquistas-box modal-agradecimento-box" role="dialog" aria-modal="true" aria-label="Agradecimento por concluir todas as conquistas">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span class="ano-tag" style="margin:0;">🏆 Jornada 100% Concluída (6/6)</span>
                <button type="button" class="btn-wcag" onclick="document.getElementById('modalAgradecimentoOverlay').remove()">✕ Fechar</button>
            </div>

            <img
                src="${IMAGEM_AGRADECIMENTO_GAMIFICACAO}"
                alt="Vista panorâmica de Bauru simbolizando a preservação do patrimônio histórico e cultural"
                class="imagem-agradecimento"
                onerror="if (!this.dataset.fb) { this.dataset.fb = '1'; this.src = './img/logo.png'; } else { this.style.display = 'none'; }"
            >

            <a
                href="${FIGURINHA_AGRADECIMENTO_GAMIFICACAO}"
                download="figurinha-natalina.jpeg"
                class="botao-acao"
                style="display:block; width:fit-content; margin:15px auto;"
            >
                🎄 Baixar Figurinha
            </a>

            <h2 style="margin-top:14px; margin-bottom:10px; font-size:1.5rem;">
                💛 Muito obrigado por valorizar a história de Bauru!
            </h2>
            <p style="margin-bottom:12px;">
                Você completou todas as <strong>6 Conquistas Patrimoniais</strong> do projeto <strong>Memória Viva</strong>. Ao explorar nossa linha do tempo, comparar transformações urbanas, avaliar o acervo, participar da comunidade e testar seus conhecimentos no quiz, você ajuda a manter viva a identidade da <em>Cidade Sem Limites</em>.
            </p>
            <div class="box-destaque" style="margin:14px 0;">
                <strong>Guardião da Memória Bauruense:</strong> Continue compartilhando memórias, convidando amigos e explorando os registros históricos da nossa cidade.
            </div>

            <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between; margin-top:18px;">
                <button type="button" class="botao-acao" onclick="abrirModalConquistas()">🏅 Ver Lista de Conquistas</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}

function abrirModalConquistas() {
    const modalAgradecimento = document.getElementById('modalAgradecimentoOverlay');
    if (modalAgradecimento) modalAgradecimento.remove();

    const existente = document.getElementById('modalConquistasOverlay');
    if (existente) existente.remove();

    const desbloqueadas = obterConquistasValidas();
    const total = Object.keys(desbloqueadas).length;
    const maximo = Object.keys(CATALOGO_CONQUISTAS).length;
    const completo = total >= maximo;

    const itensHtml = Object.entries(CATALOGO_CONQUISTAS).map(([chave, info]) => {
        const ganhou = Boolean(desbloqueadas[chave]);
        return `
            <div class="item-conquista ${ganhou ? '' : 'bloqueada'}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>${info.icone} ${info.nome}</strong>
                    <span>${ganhou ? '✅ Desbloqueada' : '🔒 Bloqueada'}</span>
                </div>
                <small style="display:block; margin-top:4px;">
                    ${ganhou ? '<strong>Por que você ganhou:</strong> ' : '<strong>Como ganhar:</strong> '}${info.motivo}
                </small>
            </div>
        `;
    }).join('');

    const overlay = document.createElement('div');
    overlay.id = 'modalConquistasOverlay';
    overlay.className = 'modal-conquistas-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
        <div class="modal-conquistas-box" role="dialog" aria-modal="true" aria-label="Suas Conquistas Patrimoniais">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                <h2 style="margin:0; font-size:1.35rem;">🏅 Conquistas Patrimoniais (${total}/${maximo})</h2>
                <button type="button" class="btn-wcag" onclick="document.getElementById('modalConquistasOverlay').remove()">✕ Fechar</button>
            </div>
            <p style="margin-bottom:15px;">Explore os recursos de educação patrimonial da plataforma para desbloquear todas as insígnias:</p>
            ${itensHtml}
            ${completo ? `
                <div style="margin-top:16px; text-align:right;">
                    <button type="button" class="botao-acao" onclick="abrirModalAgradecimento()">🎉 Abrir Imagem de Agradecimento</button>
                </div>
            ` : ''}
        </div>
    `;
    document.body.appendChild(overlay);
}

function registrarConquista(chave) {
    const info = CATALOGO_CONQUISTAS[chave];
    if (!info) return;

    const conquistas = obterConquistasValidas();
    const jaTinha = Boolean(conquistas[chave]);

    if (!jaTinha) {
        conquistas[chave] = info.nome;
        localStorage.setItem('mv_conquistas', JSON.stringify(conquistas));

        const completouAgora = Object.keys(conquistas).length >= Object.keys(CATALOGO_CONQUISTAS).length;
        mostrarToastConquista(info, completouAgora);

        if (completouAgora && !localStorage.getItem(CHAVE_AGRADECIMENTO_VISTO)) {
            localStorage.setItem(CHAVE_AGRADECIMENTO_VISTO, 'true');
            setTimeout(() => {
                abrirModalAgradecimento();
            }, 900);
        }
    }

    atualizarPainelGamificacao();
}

function atualizarPainelGamificacao() {
    const el = document.getElementById('statusGamificacao');
    if (!el) return;
    const conquistas = obterConquistasValidas();
    const total = Object.keys(conquistas).length;
    const maximo = Object.keys(CATALOGO_CONQUISTAS).length;
    const completo = total >= maximo;

    el.innerHTML = completo
        ? `🏆 Completo: <strong>${total}/${maximo}</strong> (Agradecimento)`
        : `🏅 Conquistas Patrimoniais: <strong>${total}/${maximo}</strong> (Ver detalhes)`;

    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.title = completo
        ? 'Parabéns! Clique para ver a mensagem e imagem de agradecimento'
        : 'Clique para ver quais conquistas você desbloqueou e como ganhar as demais';

    el.onclick = completo ? abrirModalAgradecimento : abrirModalConquistas;
    el.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (completo) {
                abrirModalAgradecimento();
            } else {
                abrirModalConquistas();
            }
        }
    };
}

/* 3. BANCO DE DADOS DUBLIN CORE COMPLETO (OS 4 EIXOS + TURISMO + PERSONALIDADES + BAIRROS + FACULDADES) */
const acervoDublinCore = [
    {
        dc_identifier: "DC-BAURU-001",
        dc_title: "Estação Ferroviária Central (Estrada de Ferro Noroeste do Brasil - NOB)",
        dc_subject: "Patrimônio Arquitetônico e Ferroviário",
        dc_description: "Símbolo máximo do entroncamento ferroviário que uniu as linhas Noroeste do Brasil (NOB), Sorocabana e Companhia Paulista. Construída em estilo Art Déco e inaugurada em 1939, enfrenta desafios de conservação e restauro, sendo peça-chave da memória ferroviária bauruense.",
        dc_creator: "Estrada de Ferro Noroeste do Brasil",
        dc_source: "CODEPAC / IPHAN / Museu Ferroviário Regional de Bauru",
        dc_date: "1939",
        dc_coverage_spatial: "Centro",
        dc_coverage_temporal: "1900-1950",
        eixo_documental: "Eixo 1: Institucional e Técnico",
        categoria: "Patrimônio e Monumentos",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM63wW1K29NHCESPw6LsiXN3LaZNIoGdquyypXA0PmKw&s=10"
    },
    {
        dc_identifier: "DC-BAURU-002",
        dc_title: "Entorno da Praça Machado de Melo e Rua Batista de Carvalho",
        dc_subject: "Urbanismo e Memória Coletiva",
        dc_description: "Porta de entrada histórica para quem desembarcava na Estação Ferroviária. Concentrava os principais hotéis, cafés e o comércio do centro de Bauru entre as décadas de 1920 e 1980, retratado nas obras de Célio Losnak.",
        dc_creator: "Município de Bauru",
        dc_source: "FAAC/UNESP / Polifonia Urbana (LOSNAK, 2004)",
        dc_date: "1920-1980",
        dc_coverage_spatial: "Centro",
        dc_coverage_temporal: "1900-1950",
        eixo_documental: "Eixo 2: Acadêmico e de Preservação",
        categoria: "Patrimônio e Monumentos",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bauru_SP.jpg/640px-Bauru_SP.jpg"
    },
    {
        dc_identifier: "DC-BAURU-003",
        dc_title: "Antigo Hotel Milanese e Hotel Cariani",
        dc_subject: "Arquitetura Histórica em Risco",
        dc_description: "Edifícios históricos que hospedaram viajantes, imigrantes e personalidades (como a passagem clandestina de Che Guevara em 1966). Representam a urgência da salvaguarda contra o abandono de bens patrimoniais no centro antigo.",
        dc_creator: "Acervo Histórico de Bauru",
        dc_source: "Atas do CODEPAC / Câmara Municipal (SAPL)",
        dc_date: "1945",
        dc_coverage_spatial: "Centro",
        dc_coverage_temporal: "1900-1950",
        eixo_documental: "Eixo 1: Institucional e Técnico",
        categoria: "Patrimônio e Monumentos",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSolHEMrqxJOdt0dTac2zX3rq3DSCrtnwDjZ_c_0xr8qQ&s"
    },
    {
        dc_identifier: "DC-BAURU-004",
        dc_title: "Museu Ferroviário Regional, Museu Histórico e Pinacoteca Municipal",
        dc_subject: "Museus e Arquivos Municipais",
        dc_description: "Rede de instituições públicas que junto à Biblioteca Rodrigues de Abreu e ao Arquivo Público Municipal preservam locomotivas a vapor, fotografias, periódicos e documentos primários da formação de Bauru.",
        dc_creator: "Secretaria Municipal de Cultura de Bauru",
        dc_source: "Prefeitura Municipal de Bauru / Projeto Memórias UNESP",
        dc_date: "1989",
        dc_coverage_spatial: "Centro",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 2: Acadêmico e de Preservação",
        categoria: "Patrimônio e Monumentos",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM63wW1K29NHCESPw6LsiXN3LaZNIoGdquyypXA0PmKw&s=10"
    },
    {
        dc_identifier: "DC-BAURU-005",
        dc_title: "Pelé e o Bauru Atlético Clube (BAC)",
        dc_subject: "Personalidades e Esporte",
        dc_description: "Edson Arantes do Nascimento (Pelé) viveu sua infância e juventude em Bauru a partir dos 4 anos. Foi nos campos do Bauru Atlético Clube (BAC), treinado por Waldemar de Brito, que conquistou títulos juvenis antes de brilhar no Santos FC e na Seleção.",
        dc_creator: "Imprensa Bauruense",
        dc_source: "Jornal da Cidade de Bauru / G1 Bauru e Marília / Social Bauru",
        dc_date: "1950",
        dc_coverage_spatial: "Centro",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 3: Midiático e de Entretenimento",
        categoria: "Personalidades",
        imagem: "https://conteudo.imguol.com.br/c/esporte/d4/2022/05/11/pele-1652290787737_v2_750x768.jpg"
    },
    {
        dc_identifier: "DC-BAURU-006",
        dc_title: "Casimiro Pinto Neto e o Sanduíche Bauru (Patrimônio Imaterial)",
        dc_subject: "Cultura e Gastronomia",
        dc_description: "Estudante bauruense que em 1937, no restaurante Ponto Chic em São Paulo, criou a receita original no pão francês sem miolo com rosbife, queijos derretidos em banho-maria, tomate e picles. Declarado Patrimônio Imaterial do Estado de SP.",
        dc_creator: "Casimiro Pinto Neto",
        dc_source: "Acervo Bauru Ilustrado (Luciano Dias Pires) / Câmara Municipal",
        dc_date: "1937",
        dc_coverage_spatial: "Centro",
        dc_coverage_temporal: "1900-1950",
        eixo_documental: "Eixo 4: Comunitário e Afetivo",
        categoria: "Personalidades",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3nnzndBYc8lI2S_2a0CBxNA-sKL0tCGNr9kFSWJIIof4iUXUVXdZkqiA&s=10"
    },
    {
        dc_identifier: "DC-BAURU-007",
        dc_title: "Marcos Pontes e Ozires Silva: A Vocação Aeroespacial",
        dc_subject: "Ciência, Aviação e Tecnologia",
        dc_description: "Bauru é berço da paixão aeronáutica do engenheiro Ozires Silva (fundador da Embraer, que iniciou seus voos no Aeroclube de Bauru) e terra natal de Marcos Pontes, primeiro astronauta brasileiro a ir à Estação Espacial Internacional (ISS) em 2006.",
        dc_creator: "Aeroclube de Bauru / Memória Local",
        dc_source: "Social Bauru / TV TEM / Jornal da Cidade",
        dc_date: "2006",
        dc_coverage_spatial: "Jardim Estoril",
        dc_coverage_temporal: "1991-Atualidade",
        eixo_documental: "Eixo 3: Midiático e de Entretenimento",
        categoria: "Personalidades",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS8Du5slNk8GWf3anR65SAYzOjGBdOo-Uu4nAeUPTIrA&s=10"
    },
    {
        dc_identifier: "DC-BAURU-008",
        dc_title: "Parque Vitória Régia, Zoológico Municipal e Jardim Botânico",
        dc_subject: "Turismo, Lazer e Meio Ambiente",
        dc_description: "Conjunto dos principais cartões-postais turísticos de Bauru: o anfiteatro do Parque Vitória Régia (palco de eventos culturais e da festa de aniversário da cidade), o renomado Zoológico Municipal e a reserva de mata nativa do Jardim Botânico.",
        dc_creator: "Prefeitura Municipal de Bauru",
        dc_source: "Portal Oficial da Prefeitura de Bauru / Plano Diretor",
        dc_date: "1980-2026",
        dc_coverage_spatial: "Altos da Cidade",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 1: Institucional e Técnico",
        categoria: "Pontos Turísticos",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXUnKn0iUbap-ljlyNDjNi0CtM8g-BurxxM_0wCZr1Ig&s=10"
    },
    {
        dc_identifier: "DC-BAURU-009",
        dc_title: "Vila Universitária (USP/Centrinho), UNESP e SESC Bauru",
        dc_subject: "Educação Superior e Cultura",
        dc_description: "Consolidação de Bauru como capital acadêmica e cultural do centro-oeste paulista a partir da instalação da USP Bauru (FOB e Centrinho), do amplo campus da UNESP (FAAC, FEB e FC) e do centro multicultural do SESC Bauru.",
        dc_creator: "Comunidade Acadêmica Bauruense",
        dc_source: "Repositório Institucional UNESP / USP Bauru",
        dc_date: "1962-2026",
        dc_coverage_spatial: "Vila Universitária",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 2: Acadêmico e de Preservação",
        categoria: "Bairros e Regiões",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFPpDKGOIzlbrFx1vj2v4JvQzmpBs10kjJ0w8vxildog&s=10"
    },
    {
        dc_identifier: "DC-BAURU-010",
        dc_title: "Memória dos Bairros: Vila Falcão, Distrito de Tibiriçá, Bela Vista e Estoril",
        dc_subject: "História dos Bairros e Periferias",
        dc_description: "Das origens indígenas Kaingangs em Tibiriçá e dos bairros operários ferroviários como Vila Falcão e Bela Vista até a expansão moderna do Jardim Estoril e Jardim Europa, preservados pelas páginas 'Bauru de Antigamente' e 'Bauru Ilustrado'.",
        dc_creator: "Pelegrina & Bastos (2015) / Comunidade Bauruense",
        dc_source: "Bauru de Antigamente / Bauru Ilustrado / Origens Históricas (2015)",
        dc_date: "1896-2026",
        dc_coverage_spatial: "Vila Falcão / Tibiriçá",
        dc_coverage_temporal: "Século XIX",
        eixo_documental: "Eixo 4: Comunitário e Afetivo",
        categoria: "Bairros e Regiões",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSez4El_QKwstpSN5ojn4NOlJqWH_QcIskAa0__6O86Ew&s=10"
    },
    {
        dc_identifier: "DC-BAURU-011",
        dc_title: "USP Bauru (FOB e HRAC-Centrinho)",
        dc_subject: "Ensino Superior, Odontologia e Saúde",
        dc_description: "Campus da Universidade de São Paulo em Bauru, referência nacional e internacional em odontologia (FOB) e no tratamento de fissuras labiopalatinas e anomalias craniofaciais (HRAC-Centrinho).",
        dc_creator: "Universidade de São Paulo",
        dc_source: "USP Bauru / Acervo Acadêmico",
        dc_date: "1962-2026",
        dc_coverage_spatial: "Vila Universitária",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 2: Acadêmico e de Preservação",
        categoria: "Faculdades e Universidades",
        faculdade: "USP",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxT6kbcY1gMnIo9fZmAjRQGY-CgPh__lPNkBExw9mlyA&s=10"
    },
    {
        dc_identifier: "DC-BAURU-012",
        dc_title: "UNESP Bauru (FAAC, FEB e FC)",
        dc_subject: "Ensino Superior, Comunicação, Engenharias e Ciências",
        dc_description: "Campus da Universidade Estadual Paulista em Bauru, reunindo as faculdades de Arquitetura, Artes e Comunicação (FAAC), Engenharia (FEB) e Ciências (FC) e forte produção de pesquisa e extensão.",
        dc_creator: "Universidade Estadual Paulista",
        dc_source: "Repositório Institucional UNESP",
        dc_date: "1976-2026",
        dc_coverage_spatial: "Vila Universitária",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 2: Acadêmico e de Preservação",
        categoria: "Faculdades e Universidades",
        faculdade: "UNESP",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScT3dF3KqZrMBUUWgkdAtlt_Z55i896qkvHaSQUOPje0vZxruVWD4lvhnb&s=10"
    },
    {
        dc_identifier: "DC-BAURU-013",
        dc_title: "Unisagrado (Antiga USC — Universidade do Sagrado Coração)",
        dc_subject: "Educação Superior e História Local",
        dc_description: "Tradicional instituição de ensino superior de Bauru, originada da Universidade do Sagrado Coração (USC), com forte presença na formação de profissionais de saúde, humanas, exatas e sociais.",
        dc_creator: "Unisagrado",
        dc_source: "Acervo Histórico e Acadêmico de Bauru",
        dc_date: "1953-2026",
        dc_coverage_spatial: "Jardim América",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 2: Acadêmico e de Preservação",
        categoria: "Faculdades e Universidades",
        faculdade: "USC / Unisagrado",
        imagem: "https://socialbauru.com.br/wp-content/uploads/2024/05/unisagrado-bauru-cursos-2021.jpg"
    },
    {
        dc_identifier: "DC-BAURU-014",
        dc_title: "ITE — Instituição Toledo de Ensino",
        dc_subject: "Ensino Jurídico e Acadêmico",
        dc_description: "Instituição tradicional de ensino superior de Bauru, amplamente reconhecida na região pela formação jurídica e pela participação na vida acadêmica e cultural do município.",
        dc_creator: "Instituição Toledo de Ensino",
        dc_source: "Memória Acadêmica de Bauru",
        dc_date: "1952-2026",
        dc_coverage_spatial: "Vila Coralina",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 2: Acadêmico e de Preservação",
        categoria: "Faculdades e Universidades",
        faculdade: "ITE",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQscI3fly6qz_ybh6FDQAYT0Oa1Lge20deMOClCmiemnw&s=10"
    },
    {
        dc_identifier: "DC-BAURU-015",
        dc_title: "Fatec Bauru e Polo de Ensino Superior e Técnico",
        dc_subject: "Educação Tecnológica e Profissional",
        dc_description: "Faculdade de Tecnologia do Estado de São Paulo em Bauru, voltada à formação tecnológica superior e ao desenvolvimento profissional da região.",
        dc_creator: "Centro Paula Souza / Fatec Bauru",
        dc_source: "Portal Educacional de Bauru",
        dc_date: "2000-2026",
        dc_coverage_spatial: "Jardim Panorama",
        dc_coverage_temporal: "1991-Atualidade",
        eixo_documental: "Eixo 1: Institucional e Técnico",
        categoria: "Faculdades e Universidades",
        faculdade: "Fatec",
        imagem: "https://bkpsitecpsnew.blob.core.windows.net/uploadsitecps/sites/51/2023/08/WhatsApp-Image-2021-08-12-at-16.49.19.jpeg"
    },
    {
        dc_identifier: "DC-BAURU-016",
        dc_title: "Jardim Bela Vista, Jardim Panorama e Vila Coralina",
        dc_subject: "Bairros, Crescimento Urbano e Cotidiano",
        dc_description: "Bairros que integram a malha urbana de Bauru e refletem a expansão residencial, comercial e estudantil da cidade ao longo das últimas décadas.",
        dc_creator: "Comunidade Bauruense",
        dc_source: "Prefeitura Municipal de Bauru / Bauru de Antigamente",
        dc_date: "1950-2026",
        dc_coverage_spatial: "Jardim Bela Vista",
        dc_coverage_temporal: "1951-1990",
        eixo_documental: "Eixo 4: Comunitário e Afetivo",
        categoria: "Bairros e Regiões",
        faculdade: "Instituição de Ensino Técnico e Superior",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSez4El_QKwstpSN5ojn4NOlJqWH_QcIskAa0__6O86Ew&s=10"
    }
];

/* 4. AVALIAÇÃO POR ESTRELAS (1 A 5 ESTRELAS SEM VOTOS INFINITOS) */
function obterAvaliacao(id) {
    const salvas = JSON.parse(localStorage.getItem('mv_avaliacoes') || '{}');
    return salvas[id] || { soma: 5, votos: 1 };
}

function obterMeuVoto(id) {
    const meusVotos = JSON.parse(localStorage.getItem('mv_meus_votos') || '{}');
    return meusVotos[id] || null;
}

function votarEstrela(id, notaEscolhida) {
    const salvas = JSON.parse(localStorage.getItem('mv_avaliacoes') || '{}');
    const meusVotos = JSON.parse(localStorage.getItem('mv_meus_votos') || '{}');

    const atual = salvas[id] || { soma: 5, votos: 1 };
    const votoAnterior = meusVotos[id];

    if (votoAnterior) {
        atual.soma = atual.soma - votoAnterior + notaEscolhida;
    } else {
        atual.soma += notaEscolhida;
        atual.votos += 1;
    }

    meusVotos[id] = notaEscolhida;
    salvas[id] = atual;

    localStorage.setItem('mv_avaliacoes', JSON.stringify(salvas));
    localStorage.setItem('mv_meus_votos', JSON.stringify(meusVotos));

    registrarConquista('avaliador');
    if (typeof renderizarCatalogo === 'function') renderizarCatalogo();
}

window.addEventListener('DOMContentLoaded', () => {
    aplicarAcessibilidade();
    atualizarPainelGamificacao();
});

/* 5. ARMAZENAMENTO E RENDERIZAÇÃO DE MÍDIA (IMAGENS, VÍDEOS, ÁUDIOS E LINKS) */
function abrirBancoMidia() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('MemoriaVivaMidias', 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('arquivos')) {
                db.createObjectStore('arquivos');
            }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error);
    });
}

async function salvarArquivoLocal(id, file) {
    const db = await abrirBancoMidia();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('arquivos', 'readwrite');
        tx.objectStore('arquivos').put(file, id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
    });
}

async function buscarArquivoLocal(id) {
    try {
        const db = await abrirBancoMidia();
        return await new Promise((resolve) => {
            const tx = db.transaction('arquivos', 'readonly');
            const req = tx.objectStore('arquivos').get(id);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch {
        return null;
    }
}

function extrairIdYoutube(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

function detectarTipoMidia(src, tipoSalvo) {
    if (tipoSalvo) return tipoSalvo;
    if (!src) return '';
    if (extrairIdYoutube(src)) return 'youtube';
    const limpo = src.split('?')[0].toLowerCase();
    if (/\.(mp4|webm|ogg|mov)$/.test(limpo)) return 'video';
    if (/\.(mp3|wav|m4a|aac|oga)$/.test(limpo)) return 'audio';
    return 'imagem';
}

function falhaCarregarImagem(imgEl, url) {
    const aviso = document.createElement('div');
    aviso.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="botao-acao" style="font-size:0.85rem;">🔗 Abrir link de mídia externa</a>`;
    imgEl.replaceWith(aviso);
}

async function gerarHtmlMidiaRelato(r, compacto = false) {
    let src = (r.midia_url || '').trim();
    let tipo = r.midia_tipo || '';

    if (!src && r.midia_local_id) {
        const arquivo = await buscarArquivoLocal(r.midia_local_id);
        if (arquivo) {
            src = URL.createObjectURL(arquivo);
            if (!tipo && arquivo.type) {
                if (arquivo.type.startsWith('video/')) tipo = 'video';
                else if (arquivo.type.startsWith('audio/')) tipo = 'audio';
                else tipo = 'imagem';
            }
        }
    }

    if (!src) return compacto ? '<small>Sem mídia</small>' : '';

    tipo = detectarTipoMidia(src, tipo);
    const estiloCompacto = compacto ? 'style="max-width:220px; max-height:140px;"' : '';

    if (tipo === 'youtube') {
        const ytId = extrairIdYoutube(src);
        return `
            <div class="midia-relato-container">
                <iframe class="midia-youtube-frame" ${compacto ? 'style="height:130px; max-width:220px;"' : ''}
                    src="https://www.youtube-nocookie.com/embed/${ytId}"
                    title="Vídeo enviado pela comunidade" allowfullscreen></iframe>
            </div>`;
    }

    if (tipo === 'video') {
        return `
            <div class="midia-relato-container">
                <video class="midia-relato-video" ${estiloCompacto} controls preload="metadata">
                    <source src="${src}">
                    Seu navegador não suporta a reprodução deste vídeo.
                </video>
            </div>`;
    }

    if (tipo === 'audio') {
        return `
            <div class="midia-relato-container">
                <audio class="midia-relato-audio" controls preload="metadata">
                    <source src="${src}">
                    Seu navegador não suporta a reprodução deste áudio.
                </audio>
            </div>`;
    }

    return `
        <div class="midia-relato-container">
            <img src="${src}" alt="Registro enviado por ${r.autor}" class="midia-relato-img" ${estiloCompacto}
                 onerror="falhaCarregarImagem(this, this.src)">
        </div>`;
}