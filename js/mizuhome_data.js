/**
 * MIZUHOME (水の家) — Base de Dados Oficial
 * Extraído dos documentos:
 * - MIZUHOME — Livro do Jogador
 * - MIZUHOME — Poderes
 */

const MIZUHOME_DATA = {
  // Informações de Classes
  classes: {
    vanguarda: {
      id: "vanguarda",
      name: "Vanguarda",
      nameJp: "先鋒 (Senpō)",
      tagline: "O semikami da linha de frente, escudo e aríete do grupo.",
      description: "Treinada para absorver impactos e abrir caminho, a Vanguarda mantém os inimigos ocupados enquanto seus aliados agem com segurança. Sua presença em combate torna mais difícil ignorá-la ou ultrapassá-la.",
      pvBase: 32,
      pvVigorMultiplier: 2, // 32 + (2 x Vigor)
      estaminaBase: 10,     // 10 + Presença
      defesaBaseBonus: 2,   // 10 + Agilidade + 2
      periciasIniciais: 7,
      poderesIniciais: 3,
      periciaObrigatoria: null,
      icon: "fa-shield-halved"
    },
    erudito: {
      id: "erudito",
      name: "Erudito",
      nameJp: "学者 (Gakusha)",
      tagline: "Mestre da inteligência, tática e suporte investigativo.",
      description: "O Erudito prefere inteligência, técnica e versatilidade à força bruta. Ele resolve conflitos por meio da investigação, do conhecimento e da leitura cuidadosa do ambiente — físico ou espiritual — atuando como suporte e estrategista do grupo.",
      pvBase: 26,
      pvVigorMultiplier: 1, // 26 + Vigor
      estaminaBase: 11,     // 11 + Presença
      defesaBaseBonus: 0,   // 10 + Agilidade
      periciasIniciais: 9,
      poderesIniciais: 3,
      periciaObrigatoria: null,
      icon: "fa-book-bookmark"
    },
    conjurador: {
      id: "conjurador",
      name: "Conjurador",
      nameJp: "呪術師 (Jujutsushi)",
      tagline: "Canalizador divino supremo de bênçãos e maldições.",
      description: "Aquele que se dedica a compreender, canalizar e sustentar o poder divino por mais tempo do que qualquer outro. Embora todos possam invocar bênçãos, o Conjurador é treinado para fazê-lo repetidamente, resistindo ao desgaste físico e espiritual.",
      pvBase: 22,
      pvVigorMultiplier: 1, // 22 + Vigor
      estaminaBase: 12,     // 12 + Presença
      defesaBaseBonus: 0,   // 10 + Agilidade
      periciasIniciais: 7,  // 6 perícias + 1 extra obrigatória
      poderesIniciais: 4,
      periciaObrigatoria: "conjuracao",
      icon: "fa-wand-magic-sparkles"
    }
  },

  // Perícias Oficiais (19 perícias)
  pericias: [
    // Intelecto
    { id: "investigacao", nome: "Investigação", atributo: "intelecto", descricao: "Analisar pistas, cenas de crimes e rastros materiais." },
    { id: "espiritualidade", nome: "Espiritualidade", atributo: "intelecto", descricao: "Doutrinas, práticas sagradas, rituais e costumes xintoístas." },
    { id: "conhecimento", nome: "Conhecimento", atributo: "intelecto", descricao: "Relembrar informações gerais, história, mitos e ciência." },
    { id: "medicina", nome: "Medicina", atributo: "intelecto", descricao: "Tratamento de ferimentos, primeiros-socorros e estabilização de agonia." },
    { id: "tecnologia", nome: "Tecnologia", atributo: "intelecto", descricao: "Uso, invasão e reparo de equipamentos eletrônicos e digitais." },

    // Presença
    { id: "vontade", nome: "Vontade", atributo: "presenca", descricao: "Resistir a medo, intimidação e influências espirituais hostis." },
    { id: "enganacao", nome: "Enganação", atributo: "presenca", descricao: "Mentir, blefar, criar disfarces e ludibriar oponentes." },
    { id: "intimidacao", nome: "Intimidação", atributo: "presenca", descricao: "Coagir, impor medo, autoridade e pressionar alvos." },
    { id: "diplomacia", nome: "Diplomacia", atributo: "presenca", descricao: "Convencer, negociar, acalmar e criar laços sociais." },
    { id: "percepcao", nome: "Percepção", atributo: "presenca", descricao: "Notar detalhes sutis, presenças ocultas e perigos iminentes." },
    { id: "intuicao", nome: "Intuição", atributo: "presenca", descricao: "Ler as intenções ocultas de pessoas e espíritos no ambiente." },
    { id: "conjuracao", nome: "Conjuração", atributo: "presenca", descricao: "Canalização de Poderes Ativos Divinos (Perícia Especial)." },

    // Agilidade
    { id: "furtividade", nome: "Furtividade", atributo: "agilidade", descricao: "Mover-se sem ser visto, ocultar-se e agir nas sombras." },
    { id: "acrobacia", nome: "Acrobacia", atributo: "agilidade", descricao: "Equilíbrio corporal, saltos acrobáticos, manobras e amortecer quedas." },
    { id: "reflexos", nome: "Reflexos", atributo: "agilidade", descricao: "Reações rápidas no combate (soma à Defesa durante Esquiva)." },
    { id: "pontaria", nome: "Pontaria", atributo: "agilidade", descricao: "Ataques com armas de tiro, arremesso e projéteis à distância." },

    // Força
    { id: "atletismo", nome: "Atletismo", atributo: "forca", descricao: "Esforço físico bruto, corrida, escalada, natação e saltos longos." },
    { id: "luta", nome: "Luta", atributo: "forca", descricao: "Combate corpo a corpo, desarmar, manobras e Bloqueio de dano." },

    // Vigor
    { id: "fortitude", nome: "Fortitude", atributo: "vigor", descricao: "Resistência física a venenos, doenças, fadiga e testes de Agonia." },
    { id: "sobrevivencia", nome: "Sobrevivência", atributo: "vigor", descricao: "Rastreamento, navegação em ermos e adaptação ambiental." }
  ],

  // Divindades / Kamis & Poderes
  kamis: {
    amaterasu: {
      id: "amaterasu",
      nome: "Amaterasu",
      nomeJp: "天照大御神",
      titulo: "Deusa do Sol e da Purificação",
      descricao: "Divindade solar suprema, senhora da luz purificadora que dissipa as trevas espirituais e cura as feridas de seus protegidos.",
      poderes: [
        {
          id: "amaterasu_luz_purificadora",
          nome: "Luz Purificadora",
          tipo: "Passivo",
          acao: "Ação de Movimento",
          custo: 1,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Erudito ou Vanguarda",
          efeito: "Você deixa um rastro luminoso no chão em até 3 espaços que percorreu. Até o fim da rodada, qualquer inimigo que entrar nesse rastro sofre 1d6 de dano de luz.",
          dano: "1d6",
          tipoDano: "Luz"
        },
        {
          id: "amaterasu_clarao_da_verdade",
          nome: "Clarão da Verdade",
          tipo: "Passivo",
          acao: "Reação",
          gatilho: "Ao ser alvo de ilusão, engano ou efeito de ocultação",
          custo: 2,
          atributo: "intelecto",
          pericia: "percepcao",
          classeSugerida: "Erudito ou Conjurador",
          efeito: "Você dissipa automaticamente a ilusão/ocultação e, além disso, o conjurador da ilusão sofre 1d4 de dano espiritual.",
          dano: "1d4",
          tipoDano: "Espiritual"
        },
        {
          id: "amaterasu_juizo_final",
          nome: "Juízo Final",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 8,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Vanguarda ou Conjurador",
          efeito: "Causa 2d10 de dano de luz em um alvo. Se acertar, o alvo fica Restrito (perde todas as ações e reações) por 1 rodada, paralisado pela luz divina.",
          dano: "2d10",
          tipoDano: "Luz",
          condicaoAplica: "Restrito (1 rodada)"
        },
        {
          id: "amaterasu_abraco_da_alvorada",
          nome: "Abraço da Alvorada",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 6,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Conjurador ou Erudito",
          efeito: "Um aliado em alcance curto recupera 2d8 + Presença em PV e, se estiver em Agonia, é estabilizado automaticamente. Além disso, fica imune a 'Perturbado' por 2 rodadas.",
          cura: "2d8 + Presença",
          buff: "Imune a Perturbado (2 rodadas), Estabiliza Agonia"
        }
      ]
    },

    inari: {
      id: "inari",
      nome: "Inari",
      nomeJp: "稲荷大神",
      titulo: "Deus do Arroz, Raposas e Sorte",
      descricao: "Divindade astuta das raposas (kitsune), da abundância e da sorte inesperada no campo de batalha.",
      poderes: [
        {
          id: "inari_cauda_espectral",
          nome: "Cauda Espectral",
          tipo: "Passivo",
          acao: "Ação de Movimento",
          custo: 1,
          atributo: "agilidade",
          pericia: "furtividade",
          classeSugerida: "Vanguarda ou Erudito",
          efeito: "Você cria uma cópia ilusória sua em um espaço adjacente que dura até o fim da rodada. O primeiro ataque corpo a corpo ou à distância que você sofreria acerta a cópia, anulando o dano e destruindo a ilusão.",
          defensivo: "Anula 1º ataque recebido"
        },
        {
          id: "inari_sorte_da_colheita",
          nome: "Sorte da Colheita",
          tipo: "Passivo",
          acao: "Reação",
          gatilho: "Ao falhar em um teste de perícia ou ataque",
          custo: 2,
          atributo: "presenca",
          pericia: "intuicao",
          classeSugerida: "Todas",
          efeito: "Se passar no teste do poder (Presença + Intuição), você refaz o teste falho com um dado extra no resultado.",
          suporte: "Refaz teste com +1 dado"
        },
        {
          id: "inari_kitsunebi",
          nome: "Kitsunebi",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 6,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Vanguarda ou Conjurador",
          efeito: "Causa 2d6 de dano espiritual em um alvo. Se acertar, o alvo fica Envergonhado (não pode usar Reações, como Esquivar ou Bloquear) até o próximo turno dele.",
          dano: "2d6",
          tipoDano: "Espiritual",
          condicaoAplica: "Envergonhado (até prox. turno)"
        },
        {
          id: "inari_translocacao",
          nome: "Translocação",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 5,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Erudito ou Conjurador",
          efeito: "Você ou um aliado em alcance curto é teletransportado para até 9 metros de distância (em local visível).",
          mobilidade: "Teleporte até 9m"
        }
      ]
    },

    benten: {
      id: "benten",
      nome: "Benten",
      nomeJp: "弁才天",
      titulo: "Deusa da Música, Artes e Eloquência",
      descricao: "Deusa graciosa das melodias harmoniosas, da eloquência e da capacidade de alterar emoções e reescrever a sorte.",
      poderes: [
        {
          id: "benten_cancao_labil",
          nome: "Canção Lábil",
          tipo: "Passivo",
          acao: "Ação de Movimento",
          custo: 1,
          atributo: "presenca",
          pericia: "diplomacia",
          classeSugerida: "Erudito ou Conjurador",
          efeito: "Entoa uma melodia que altera o estado emocional de um inimigo em alcance curto (dura 1 rodada). Escolha: Medo (não pode se mover na sua direção), Tristeza (-2 em testes de ataque) ou Fascínio (gasta Ação Padrão para te observar, a menos que seja atacado).",
          controle: "Medo / Tristeza (-2 ataque) / Fascínio"
        },
        {
          id: "benten_aquarela",
          nome: "Aquarela",
          tipo: "Passivo",
          acao: "Reação",
          gatilho: "Quando um aliado próximo for alvo de um ataque ou efeito negativo",
          custo: 2,
          atributo: "presenca",
          pericia: "intuicao",
          classeSugerida: "Erudito ou Conjurador",
          efeito: "Desenha no ar um símbolo que distorce a sorte. O ataque ou efeito que atingiria você ou o aliado agora tem 50% de chance de errar (role 1d20; 11+ acerta o alvo original, 10- desvia e atinge ponto aleatório).",
          defensivo: "50% de chance de errar ataque"
        },
        {
          id: "benten_canto_da_sereia",
          nome: "Canto da Sereia",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 7,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Conjurador ou Erudito",
          efeito: "Performance artística que inspira aliados em alcance curto: ganham +1d4 em todos os testes de perícia (exceto combate) e +2 de Defesa até o final da próxima rodada. Um aliado pode refazer um teste de perícia que acabou de falhar.",
          buff: "+1d4 em perícias gerais e +2 Defesa"
        },
        {
          id: "benten_acorde_rompante",
          nome: "Acorde Rompante",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 6,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Erudito ou Conjurador",
          efeito: "Causa 1d10 de dano espiritual em um alvo e drena 1d4 de Estamina do alvo (se ele tiver). A Estamina drenada é perdida, não transferida.",
          dano: "1d10",
          tipoDano: "Espiritual",
          dreno: "1d4 Estamina perdida"
        }
      ]
    },

    susanoo: {
      id: "susanoo",
      nome: "Susano'o",
      nomeJp: "須佐之男命",
      titulo: "Deus das Tempestades e do Mar",
      descricao: "Divindade furiosa dos mares agitados, ventos cortantes e relâmpagos devastadores que assolam o campo de combate.",
      poderes: [
        {
          id: "susanoo_escudo_de_vento",
          nome: "Escudo de Vento",
          tipo: "Passivo",
          acao: "Ação de Movimento",
          custo: 1,
          atributo: "vigor",
          pericia: "fortitude",
          classeSugerida: "Vanguarda ou Erudito",
          efeito: "Cria um redemoinho ao redor. Até o fim da rodada, projéteis (balas e flechas) sofrem desvantagem para te acertar e, se errarem, o projétil é desviado podendo acertar inimigo próximo (1d6 de dano).",
          defensivo: "Desvantagem em projéteis + 1d6 ricochete"
        },
        {
          id: "susanoo_furia",
          nome: "Fúria",
          tipo: "Passivo",
          acao: "Reação",
          gatilho: "Ao ser reduzido a 0 PV ou menos",
          custo: 2,
          atributo: "vigor",
          pericia: "fortitude",
          classeSugerida: "Vanguarda ou Conjurador",
          efeito: "Você não cai em Agonia. Em vez disso, permanece de pé com 1 PV, mas fica Perturbado (-1 dado em ações) por 2 rodadas. Só pode ser usado uma vez por combate.",
          defensivo: "Evita Agonia (1 PV), Perturbado por 2 rodadas (1x/combate)"
        },
        {
          id: "susanoo_trovejada",
          nome: "Trovejada",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 7,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Vanguarda ou Conjurador",
          efeito: "Causa 2d8 de dano cortante + 1d6 de dano elétrico. Se acertar, o alvo é empurrado 3 metros para trás (sem teste de resistência) e cai no chão (fica deitado).",
          dano: "2d8 cortante + 1d6 elétrico",
          controle: "Empurrão de 3m e derruba o alvo"
        },
        {
          id: "susanoo_ira_celestial",
          nome: "Ira Celestial",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 8,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Erudito ou Conjurador",
          efeito: "Raios caem sobre área circular de 6 metros de raio (alcance médio). Todos os inimigos na área sofrem 2d6 de dano elétrico e devem passar em Reflexos. Os que falharem ficam Restritos por 1 rodada.",
          dano: "2d6 (Área 6m raio)",
          tipoDano: "Elétrico",
          condicaoAplica: "Restrito (se falhar em Reflexos)"
        }
      ]
    },

    orochi: {
      id: "orochi",
      nome: "Orochi",
      nomeJp: "八岐大蛇 (Yamata no Orochi)",
      titulo: "A Serpente Lendária de Oito Cabeças",
      descricao: "Força primordial venenosa e implacável, capaz de regenerar carnes feridas e expelir ácidos corrosivos letais.",
      poderes: [
        {
          id: "orochi_sangue_corrosivo",
          nome: "Sangue Corrosivo",
          tipo: "Passivo",
          acao: "Ação de Movimento",
          custo: 1,
          atributo: "vigor",
          pericia: "fortitude",
          classeSugerida: "Vanguarda",
          efeito: "Seu sangue se torna ácido por 1 rodada. Se for atingido por ataque corpo a corpo, o atacante sofre 1d8 de dano de ácido e deve passar em Fortitude ou perder a Ação Padrão da próxima rodada.",
          dano: "1d8",
          tipoDano: "Ácido",
          controle: "Alvo perde Ação Padrão se falhar Fortitude"
        },
        {
          id: "orochi_regeneracao_ofidica",
          nome: "Regeneração Ofídica",
          tipo: "Passivo",
          acao: "Reação",
          gatilho: "Ao sofrer dano",
          custo: 2,
          atributo: "vigor",
          pericia: "fortitude",
          classeSugerida: "Vanguarda ou Erudito",
          efeito: "Você recupera 1d6 de PV imediatamente após o dano ser aplicado. Se o dano te levar a 0, você recupera 1d6 e fica com esse valor (não cai em Agonia).",
          cura: "1d6 PV imediato"
        },
        {
          id: "orochi_oito_mordidas",
          nome: "Oito Mordidas",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 6,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Vanguarda ou Conjurador",
          efeito: "Realiza 2 ataques corpo a corpo (no mesmo alvo ou diferentes). Cada acerto causa 1d8 perfurante e aplica Veneno (1d6 de dano de ácido no início de cada turno por 2 rodadas, cancelável com Fortitude).",
          dano: "2x 1d8 perfurante + Veneno (1d6 ácido/rodada por 2 rodadas)"
        },
        {
          id: "orochi_nevoeiro_putrido",
          nome: "Nevoeiro Pútrido",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 8,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Conjurador ou Vanguarda",
          efeito: "Exala nuvem tóxica de 6m de raio. Inimigos sofrem 1d8 de dano de ácido e devem passar em Fortitude. Se falharem, sofrem envenenamento (1d4 ácido por rodada) e perdem Ação de Movimento na próxima rodada.",
          dano: "1d8 ácido (Área 6m)",
          condicaoAplica: "Veneno (1d4) + Perde Ação Movimento"
        }
      ]
    },

    sarutahiko: {
      id: "sarutahiko",
      nome: "Sarutahiko",
      nomeJp: "猿田毘古神",
      titulo: "Deus das Encruzilhadas e Caminhos",
      descricao: "Guia divino dos caminhos cósmicos, senhor do espaço e das escolhas difíceis que ditam o destino das batalhas.",
      poderes: [
        {
          id: "sarutahiko_encruzilhada_forcada",
          nome: "Encruzilhada Forçada",
          tipo: "Passivo",
          acao: "Ação de Movimento",
          custo: 1,
          atributo: "presenca",
          pericia: "intimidacao",
          classeSugerida: "Vanguarda ou Erudito",
          efeito: "Aponta para um inimigo em alcance curto e impõe um dilema espiritual: se mover voluntariamente sofre 1d8 espiritual; se não se mover, fica Perturbado (-1 dado) na próxima rodada por hesitação.",
          controle: "Dilema: 1d8 espiritual se mover OU Perturbado se ficar parado"
        },
        {
          id: "sarutahiko_atalho_espacial",
          nome: "Atalho Espacial",
          tipo: "Passivo",
          acao: "Reação",
          gatilho: "Ao ser alvo de um ataque corpo a corpo ou à distância",
          custo: 2,
          atributo: "agilidade",
          pericia: "reflexos",
          classeSugerida: "Todas",
          efeito: "Teletransporta instantaneamente para um espaço visível adjacente (até 6m), anulando o ataque oponente. Pode levar um aliado em alcance curto gastando +1 Estamina (total 3).",
          mobilidade: "Teleporte 6m que anula o ataque sofrido"
        },
        {
          id: "sarutahiko_caminho_da_subjugacao",
          nome: "Caminho da Subjugação",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 7,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Vanguarda ou Conjurador",
          efeito: "Causa 2d6 de dano espiritual em alcance médio e ordena o movimento do alvo (ex: 'fuja', 'venha até mim' ou 'fique parado'). Se desobedecer, sofre 1d6 adicional e fica Restrito na rodada seguinte.",
          dano: "2d6 espiritual",
          controle: "Comando de movimento obrigatório"
        },
        {
          id: "sarutahiko_fenda_dos_caminhos",
          nome: "Fenda dos Caminhos",
          tipo: "Ativo",
          acao: "Ação Padrão",
          custo: 8,
          atributo: "presenca",
          pericia: "conjuracao",
          classeSugerida: "Vanguarda ou Erudito",
          efeito: "Golpeia o chão e abre uma fenda de energia. Você e todos à sua escolha em alcance curto se deslocam até 9 metros. Inimigos no trajeto sofrem 1d10 contundente e são empurrados 3m para fora.",
          dano: "1d10 contundente",
          mobilidade: "Desloca aliados até 9m + empurra inimigos 3m"
        }
      ]
    }
  },

  // Armamentos Oficiais (15 armas)
  armas: [
    {
      id: "tanto",
      nome: "Tantō",
      tipo: "Corpo a corpo (leve)",
      alcance: "Adjacente",
      dano: "1d6",
      tipoDano: "perfurante",
      espaco: 1,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Adaga japonesa curta, fácil de ocultar e ideal para golpes rápidos e furtivos."
    },
    {
      id: "kunai",
      nome: "Kunai",
      tipo: "Corpo a corpo / Arremesso",
      alcance: "Adj. / Curto",
      dano: "1d6",
      tipoDano: "perfurante",
      espaco: 0.5,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Ferramenta adaptada como arma, usada para perfurar ou ser arremessada com precisão."
    },
    {
      id: "kama",
      nome: "Kama",
      tipo: "Corpo a corpo",
      alcance: "Adjacente",
      dano: "1d8",
      tipoDano: "cortante",
      espaco: 1,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Foice curta de origem agrícola, eficiente para puxar ou ferir o oponente."
    },
    {
      id: "wakizashi",
      nome: "Wakizashi",
      tipo: "Corpo a corpo",
      alcance: "Adjacente",
      dano: "1d8",
      tipoDano: "cortante",
      espaco: 2,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Espada curta samurai tradicional, equilibrada e altamente eficaz em ambientes fechados."
    },
    {
      id: "katana",
      nome: "Katana",
      tipo: "Corpo a corpo (versátil)",
      alcance: "Adjacente",
      dano: "1d10",
      tipoDano: "cortante",
      espaco: 3,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Espada longa japonesa tradicional, forjada e balanceada para cortes precisos e letais."
    },
    {
      id: "naginata",
      nome: "Naginata",
      tipo: "Corpo a corpo (alcance)",
      alcance: "Médio",
      dano: "1d10",
      tipoDano: "cortante",
      espaco: 3,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Lâmina curva em haste longa, permite controlar o campo de batalha e golpear com distância segura."
    },
    {
      id: "yumi",
      nome: "Yumi",
      tipo: "Distância",
      alcance: "Longo",
      dano: "1d8",
      tipoDano: "perfurante",
      espaco: 3,
      municaoMax: 15,
      municaoAtual: 15,
      critico: "x2 no 20 Natural",
      descricao: "Arco japonês assimétrico tradicional, silencioso e preciso, usado em combate à distância."
    },
    {
      id: "shuriken",
      nome: "Shuriken",
      tipo: "Arremesso",
      alcance: "Curto",
      dano: "1d4",
      tipoDano: "perfurante",
      espaco: 0.5,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Pequenas lâminas estelares arremessáveis usadas para ferir, sangrar ou distrair inimigos."
    },
    {
      id: "gohei",
      nome: "Gohei",
      tipo: "Corpo a corpo (paranormal)",
      alcance: "Adjacente",
      dano: "1d6",
      tipoDano: "paranormal",
      espaco: 1,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Bastão ritual xintoísta com serpentinas de papel (shide), usado para purificação e combate espiritual."
    },
    {
      id: "garrafa_saque",
      nome: "Garrafa de Saquê Quebrada",
      tipo: "Corpo a corpo (improvisada)",
      alcance: "Adjacente",
      dano: "1d6",
      tipoDano: "cortante",
      espaco: 0.5,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Garrafa de vidro quebrada usada em momentos desesperados como lâmina cortante improvisada."
    },
    {
      id: "pe_de_cabra",
      nome: "Pé-de-Cabra Industrial",
      tipo: "Corpo a corpo (contundente)",
      alcance: "Adjacente",
      dano: "1d8",
      tipoDano: "contundente",
      espaco: 2,
      municaoMax: 0,
      municaoAtual: 0,
      critico: "x2 no 20 Natural",
      descricao: "Ferramenta pesada de aço reforçado usada para arrombar portas ou desferir golpes contundentes."
    },
    {
      id: "pistola_9mm",
      nome: "Pistola 9mm",
      tipo: "Distância (tiro)",
      alcance: "Médio",
      dano: "2d6",
      tipoDano: "perfurante",
      espaco: 2,
      municaoMax: 15,
      municaoAtual: 15,
      critico: "x2 no 20 Natural",
      descricao: "Arma de fogo semiautomática moderna, comum em operações táticas (inicia com 15 munições)."
    },
    {
      id: "revolver_38",
      nome: "Revólver .38",
      tipo: "Distância (tiro)",
      alcance: "Médio",
      dano: "2d6",
      tipoDano: "perfurante",
      espaco: 2,
      municaoMax: 15,
      municaoAtual: 15,
      critico: "x2 no 20 Natural",
      descricao: "Arma de fogo de tambor, simples, robusta e confiável, fácil de operar e manter."
    },
    {
      id: "escopeta",
      nome: "Escopeta",
      tipo: "Distância (tiro)",
      alcance: "Curto",
      dano: "2d8",
      tipoDano: "perfurante",
      espaco: 3,
      municaoMax: 15,
      municaoAtual: 15,
      critico: "x2 no 20 Natural",
      descricao: "Arma de fogo devastadora a curta distância, com grande dispersão em ambientes fechados."
    },
    {
      id: "fuzil_assalto",
      nome: "Fuzil de Assalto",
      tipo: "Distância (tiro)",
      alcance: "Longo",
      dano: "2d10",
      tipoDano: "perfurante",
      espaco: 4,
      municaoMax: 15,
      municaoAtual: 15,
      critico: "x2 no 20 Natural",
      descricao: "Arma automática militar com alta cadência e imenso poder de destruição balística."
    }
  ],

  // Itens Básicos de Inventário (14 itens)
  itensBasicos: [
    {
      id: "zukin",
      nome: "Zukin de Viagem",
      espaco: 1,
      quantidade: 1,
      efeitoEspecial: "+3 espaços de inventário",
      capacidadeExtra: 3,
      descricao: "Uma mochila simples de pano reforçado com fechos de couro, que concede 3 espaços extras ao inventário."
    },
    {
      id: "binoculos",
      nome: "Binóculos",
      espaco: 0.5,
      quantidade: 1,
      descricao: "Permite enxergar objetos com o dobro do tamanho a longa distância."
    },
    {
      id: "cordas",
      nome: "Cordas (30m)",
      espaco: 1,
      quantidade: 1,
      descricao: "Corda de fibra trançada de 30 metros capaz de sustentar grandes pesos e auxiliar em escaladas."
    },
    {
      id: "cantil",
      nome: "Cantil",
      espaco: 1,
      quantidade: 1,
      descricao: "Cantil de metal ou polímero para transportar água potável ou outros líquidos essenciais."
    },
    {
      id: "garrafa_vidro",
      nome: "Garrafa de Vidro",
      espaco: 0.5,
      quantidade: 1,
      descricao: "Garrafa de vidro vazia e resistente para armazenamento ou uso criativo."
    },
    {
      id: "guloseimas",
      nome: "Guloseimas de Máquina",
      espaco: 1,
      quantidade: 1,
      descricao: "Pacotinhos de doces e snacks de máquinas de conveniência japonesas. Úteis contra a fome e para agrados."
    },
    {
      id: "primeiros_socorros",
      nome: "Equipamentos de Primeiros Socorros",
      espaco: 2,
      quantidade: 1,
      recupera: "1d8 + 2 PV",
      descricao: "Bandagens, talismãs de proteção e ervas secas. Reduz a DT de Medicina para 10 (ao invés de 15), estabilizando Agonia e curando 1d8+2 PV. Reutilizável."
    },
    {
      id: "cicatrizante",
      nome: "Cicatrizante Espiritual",
      espaco: 1,
      quantidade: 1,
      consumivel: true,
      recupera: "2d8 + 2 PV",
      descricao: "Pasta de ervas cicatrizantes e magia espiritual. Recupera 2d8+2 PV e é gasta após o uso (não funciona em Agonia)."
    },
    {
      id: "isqueiro",
      nome: "Isqueiro",
      espaco: 0.5,
      quantidade: 1,
      descricao: "Isqueiro portátil recarregável para acender fogo, incensos e tochas."
    },
    {
      id: "amuleto_estamina",
      nome: "Amuleto de Estamina",
      espaco: 1,
      quantidade: 1,
      recupera: "1d4 + 2 Estamina",
      descricao: "Amuleto consagrado que, quando ativado, recupera 1d4+2 de Estamina ao usuário (1 vez ao dia)."
    },
    {
      id: "tenda",
      nome: "Tenda",
      espaco: 3,
      quantidade: 1,
      descricao: "Tenda dobrável impermeável com capacidade para abrigar até 4 pessoas durante acampamentos."
    },
    {
      id: "saco_dormir",
      nome: "Saco de Dormir",
      espaco: 2,
      quantidade: 1,
      descricao: "Saco de dormir térmico para 1 pessoa, ideal para descanso seguro nos ermos."
    },
    {
      id: "incenso",
      nome: "Incenso Purificador",
      espaco: 1,
      quantidade: 1,
      descricao: "Purifica ambientes corrompidos por energias negativas, capaz de manifestar yōkai ou entidades ocultas que falharem na DT do mestre."
    },
    {
      id: "caneta_papel_ritual",
      nome: "Caneta e Papel Ritualísticos",
      espaco: 0.5,
      quantidade: 1,
      descricao: "Conjunto ritual com caneta de ponta fina (ou pincel espiritual) e folhas de papel consagrado para selos (ofuda) e inscrições."
    },
    {
      id: "shimenawa",
      nome: "Shimenawa",
      espaco: 1,
      quantidade: 1,
      descricao: "Corda sagrada trançada de palha de arroz ou cânhamo para demarcar espaços sagrados, purificar áreas e convidar Kamis."
    }
  ],

  // Regras de Condições
  condicoes: [
    {
      id: "perturbado",
      nome: "Perturbado",
      nomeJp: "乱心 (Ranshin)",
      cor: "danger",
      icone: "fa-brain",
      descricao: "Sofre a penalidade de -1 dado em qualquer ação ou reação que deseje realizar."
    },
    {
      id: "restrito",
      nome: "Restrito",
      nomeJp: "束縛 (Sokubaku)",
      cor: "warning",
      icone: "fa-link",
      descricao: "Perde todas as suas ações e reações durante a quantidade de turnos estipulados."
    },
    {
      id: "envergonhado",
      nome: "Envergonhado",
      nomeJp: "羞恥 (Shūchi)",
      cor: "secondary",
      icone: "fa-face-flushed",
      descricao: "Perde suas reações (como Esquivar, Bloquear ou poderes de reação) durante o tempo estipulado."
    },
    {
      id: "envenenado",
      nome: "Envenenado",
      nomeJp: "中毒 (Chūdoku)",
      cor: "success",
      icone: "fa-biohazard",
      descricao: "Sofre dano contínuo de ácido (ex: 1d6 ou 1d4) no início de cada rodada até passar no teste de Fortitude."
    },
    {
      id: "agonia",
      nome: "Agonia",
      nomeJp: "瀕死 (Hinshi)",
      cor: "dark",
      icone: "fa-skull-crossbones",
      descricao: "Ao atingir 0 PV ou menos, cai vulnerável. Realize testes de Fortitude nos próximos 3 turnos. 3 Falhas de Morte = Morte definitiva."
    }
  ]
};
