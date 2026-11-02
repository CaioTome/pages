(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={rei:{id:`rei`,name:`Rei`,category:`classic`,subtitle:`Líder Supremo`,description:`Move 1 casa em qualquer direção. É a peça real obrigatória do exército; sua perda ou xeque-mate encerra a partida.`,maxCopies:1,isRoyal:!0},rainha:{id:`rainha`,name:`Rainha`,category:`classic`,subtitle:`Majestade Poderosa`,description:`Desliza qualquer número de casas em linha reta ou diagonal. Não pode coexistir com o Papa no mesmo exército. Ao encostar em um Sapo aliado, cura-o de volta à forma original!`,maxCopies:1},torre:{id:`torre`,name:`Torre`,category:`classic`,subtitle:`Fortaleza Móvel`,description:`Desliza qualquer número de casas ortogonalmente (horizontal ou vertical).`,maxCopies:2},bispo:{id:`bispo`,name:`Bispo`,category:`classic`,subtitle:`Clérigo Veloz`,description:`Desliza qualquer número de casas em diagonal. Se o Papa estiver vivo no seu exército, ganha também movimento e captura de Rei.`,maxCopies:2},cavalo:{id:`cavalo`,name:`Cavalo`,category:`classic`,subtitle:`Saltador Ágil`,description:`Salta em forma de "L" (2 casas em uma direção e 1 perpendicular), transpondo peças no caminho.`,maxCopies:2},peao:{id:`peao`,name:`Peão`,category:`classic`,subtitle:`Infantaria Valorosa`,description:`Anda 1 casa para frente (ou 2 do ponto de partida). Captura 1 casa em diagonal para frente. Promove a Rainha, Torre, Bispo ou Cavalo na última fileira.`,maxCopies:8},boto_cor_de_rosa:{id:`boto_cor_de_rosa`,name:`Boto Cor-de-Rosa`,category:`gatito`,subtitle:`O Conquistador Fluvial`,description:`Move e captura saltando como Cavalo. Caso capture a Rainha inimiga, você VENCE O JOGO imediatamente!`,maxCopies:2},sniper:{id:`sniper`,name:`Sniper`,category:`gatito`,subtitle:`Atirador de Elite`,description:`Move-se para casas vazias deslizando na diagonal como Bispo. Ao atacar um inimigo na diagonal (linha de visão limpa), elimina o alvo SEM SAIR do lugar!`,maxCopies:2},homem_bomba:{id:`homem_bomba`,name:`Homem Bomba`,category:`gatito`,subtitle:`Sacrifício Explosivo`,description:`Move e captura como Peão. Ao terminar seu movimento, pode optar por detonar: sacrifica-se e destrói todas as peças nas 8 casas adjacentes (aliadas e inimigas, exceto Baratinhas).`,maxCopies:2},principe:{id:`principe`,name:`Príncipe`,category:`gatito`,subtitle:`Herdeiro Real`,description:`Move e captura 1 casa em qualquer direção como Rei. Conta como peça Real: enquanto Rei e Príncipe estiverem vivos, nenhum deles sofre xeque-mate até que sobre apenas um.`,maxCopies:1,isRoyal:!0},arqueiro:{id:`arqueiro`,name:`Arqueiro`,category:`gatito`,subtitle:`Arqueiro Mágico`,description:`Move-se para casas vazias 1 casa em qualquer direção como Rei. Captura à distância no padrão de Cavalo ("L") sem sair do lugar!`,maxCopies:2},baratinha:{id:`baratinha`,name:`Baratinha`,category:`gatito`,subtitle:`Imortal Indestrutível`,description:`Desliza para casas vazias em qualquer direção como Rainha. É totalmente IMUNE a capturas, explosões e transformações, mas não pode capturar nem gerar xeque-mate.`,maxCopies:8,isImmune:!0,cannotCapture:!0,noThreatCheck:!0},construtor:{id:`construtor`,name:`Construtor`,category:`gatito`,subtitle:`Mestre de Obras`,description:`Move-se para casas vazias 1 casa em qualquer direção como Rei (não captura). Pode gastar o turno para erguer uma Torre: transforma 1 Peão clássico aliado adjacente em Torre!`,maxCopies:2,cannotCapture:!0},mago:{id:`mago`,name:`Mago`,category:`gatito`,subtitle:`Transmutador Espacial`,description:`Move-se para casas vazias como Rei (não captura). Habilidade ativa: gasta o turno escolhendo 2 casas dentre suas 8 vizinhas e permuta o conteúdo delas (peças ou vazio).`,maxCopies:2,cannotCapture:!0},papa:{id:`papa`,name:`Papa`,category:`gatito`,subtitle:`Bênção Pontifícia`,description:`Substitui a Rainha (não pode haver Rainha no seu exército). Move e captura como Rei. Enquanto estiver vivo, concede a todos os seus Bispos movimento e captura de Rei adicionais!`,maxCopies:1},guarda:{id:`guarda`,name:`Guarda`,category:`gatito`,subtitle:`Escudo Leal`,description:`Move e captura como Peão. Reação: quando uma peça aliada adjacente estiver prestes a ser capturada, o Guarda pode intervir, trocar de lugar com ela e morrer em seu lugar!`,maxCopies:2},baleia_cinzenta:{id:`baleia_cinzenta`,name:`Baleia Cinzenta`,category:`gatita`,subtitle:`Tsunami Devastador`,description:`Desliza em linha reta ortogonal como Torre. Possui massa colossal: pode atravessar e capturar até 2 peças inimigas em um único golpe ao longo da mesma trajetória reta!`,maxCopies:2},baleia_assassina:{id:`baleia_assassina`,name:`Baleia Assassina`,category:`gatita`,subtitle:`Orca Predadora`,description:`Move-se para casas vazias em linha reta ortogonal como Torre. Só realiza capturas a 1 casa de distância nas 3 posições à sua frente (diagonal-esquerda, frente, diagonal-direita).`,maxCopies:2},gatito_gasoso:{id:`gatito_gasoso`,name:`Gatito Gasoso`,category:`gatita`,subtitle:`Nuvem Tóxica`,description:`Salta em "L" como Cavalo. Você escolhe a rota do "L", e a nuvem de gás tóxico destrói todas as peças (aliadas e inimigas, exceto Baratinhas) nas 2 casas do trajeto e no destino!`,maxCopies:2},gatito_apaixonado:{id:`gatito_apaixonado`,name:`Gatito Apaixonado`,category:`gatita`,subtitle:`Coração Louco`,description:`Move e captura como Cavalo. Além disso, se a Rainha inimiga estiver a até 2 casas de distância (área 5x5 ao redor dele), pode saltar diretamente sobre ela para capturá-la!`,maxCopies:2},gatito_mahchia:{id:`gatito_mahchia`,name:`Gatito Mahchia`,category:`gatita`,subtitle:`Bruxinha Transformadora`,description:`Move-se para casas vazias como Rainha. Ao atacar um inimigo na sua linha de visão, para 1 casa antes e o transforma em SAPO! (Contra o último Rei inimigo, aplica xeque normal).`,maxCopies:2},sapo:{id:`sapo`,name:`Sapo`,category:`gatita`,subtitle:`Vítima Encantada`,description:`Anda apenas 1 casa para frente (não captura). Guarda na memória quem era originalmente: se uma Rainha aliada se aproximar adjacente a ele, o encanto é quebrado e ele volta ao normal!`,maxCopies:2,cannotCapture:!0},passaro_uratal:{id:`passaro_uratal`,name:`Pássaro Uratal`,category:`gatita`,subtitle:`Grito Aterrador`,description:`Move-se para casas vazias na diagonal como Bispo (não captura). Ao se mover, solta um grito assustador: no próximo turno inimigo, as peças oponentes só podem se mover para casas que maximizem a distância até o Uratal!`,maxCopies:2,cannotCapture:!0},bela_adormecida:{id:`bela_adormecida`,name:`Bela Adormecida`,category:`gatita`,subtitle:`Sonolenta Determinada`,description:`Move-se 1 casa à frente e captura diretamente na casa à frente (em vez de na diagonal). Pode-se ter até 8 no exército!`,maxCopies:8},perereca:{id:`perereca`,name:`Perereca`,category:`gatita`,subtitle:`Saltadora Saltitante`,description:`Move e captura 1 casa em qualquer direção como Rei. Se houver um inimigo adjacente com a casa logo atrás dele vazia, pode saltar por cima dele para aquela casa vazia sem capturá-lo.`,maxCopies:2},goham:{id:`goham`,name:`Goham`,category:`gatita`,subtitle:`Aura Fofinha e Distraída`,description:`Move-se 1 casa para frente como Peão (não captura). Inimigos nas 8 casas adjacentes a Goham ficam totalmente distraídos: não podem mover, atacar nem usar habilidades!`,maxCopies:2,cannotCapture:!0},mirra:{id:`mirra`,name:`Mirra`,category:`gatita`,subtitle:`Gatinha Destemida`,description:`Move-se 1 casa para frente e captura 1 casa diretamente à frente. Pode-se ter até 8 no exército!`,maxCopies:8},quero_quero:{id:`quero_quero`,name:`Quero-quero`,category:`gatita`,subtitle:`Rasante Territorial`,description:`Move-se 1 casa para frente (vazia). Para capturar, desfere um rasante em linha reta de 1 a 4 casas à frente com caminho livre, capturando a primeira presa!`,maxCopies:2},tartaruga_maligna:{id:`tartaruga_maligna`,name:`Tartaruga Maligna`,category:`gatita`,subtitle:`Casco Enfeitiçado`,description:`Move-se 1 casa para frente (vazia). Ataca a peça inimiga imediatamente à frente sem sair do lugar, transformando-a em SAPO!`,maxCopies:2},pimentinha:{id:`pimentinha`,name:`Pimentinha`,category:`gatita`,subtitle:`Ardência Congelante`,description:`Move e captura como Peão. Ao terminar o movimento, pode detonar sua essência picante: sacrifica-se e congela todas as peças nas 3 casas à sua frente por 1 rodada inteira!`,maxCopies:2}};function t(e,t,n=64){let r=t===`white`,i=r?`#f8fafc`:`#1e1b4b`,a=r?`#38bdf8`:`#e879f9`,o=r?`#0284c7`:`#f43f5e`,s=r?`#fbbf24`:`#c084fc`,c=r?`#0f172a`:`#ffffff`,l=``;switch(e){case`rei`:l=`
        <!-- Coroa Real Clássica -->
        <path d="M22 46 L42 46 L44 32 L36 36 L32 24 L28 36 L20 32 Z" fill="${s}" stroke="${c}" stroke-width="2"/>
        <line x1="32" y1="18" x2="32" y2="24" stroke="${s}" stroke-width="3" stroke-linecap="round"/>
        <line x1="29" y1="21" x2="35" y2="21" stroke="${s}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="32" cy="16" r="2.5" fill="${c}"/>
      `;break;case`rainha`:l=`
        <!-- Tiara com Jóias da Rainha -->
        <path d="M19 46 L45 46 L47 30 L39 37 L32 23 L25 37 L17 30 Z" fill="${o}" stroke="${c}" stroke-width="2"/>
        <circle cx="17" cy="27" r="2.5" fill="${s}"/>
        <circle cx="25" cy="34" r="2.5" fill="${s}"/>
        <circle cx="32" cy="20" r="3" fill="${s}"/>
        <circle cx="39" cy="34" r="2.5" fill="${s}"/>
        <circle cx="47" cy="27" r="2.5" fill="${s}"/>
      `;break;case`torre`:l=`
        <!-- Fortaleza Ameiada -->
        <path d="M22 46 L42 46 L41 30 L44 30 L44 22 L39 22 L39 26 L34 26 L34 22 L30 22 L30 26 L25 26 L25 22 L20 22 L20 30 L23 30 Z" fill="${o}" stroke="${c}" stroke-width="2"/>
        <rect x="29" y="34" width="6" height="8" rx="3" fill="${i}"/>
      `;break;case`bispo`:l=`
        <!-- Mitra Clériga com Cruz -->
        <path d="M24 46 L40 46 L40 38 C40 28 32 20 32 20 C32 20 24 28 24 38 Z" fill="${o}" stroke="${c}" stroke-width="2"/>
        <circle cx="32" cy="18" r="2.5" fill="${s}"/>
        <path d="M30 32 L34 32 M32 28 L32 36" stroke="${s}" stroke-width="2" stroke-linecap="round"/>
      `;break;case`cavalo`:l=`
        <!-- Cavalo Nobre -->
        <path d="M22 46 L42 46 C42 44 41 38 38 34 C36 31 38 27 38 23 C38 18 34 16 30 18 L26 21 C24 23 23 27 24 29 L21 31 C19 33 21 37 24 37 C22 41 22 46 22 46 Z" fill="${o}" stroke="${c}" stroke-width="2"/>
        <circle cx="33" cy="23" r="2" fill="${c}"/>
      `;break;case`peao`:l=`
        <!-- Elmo de Peão -->
        <circle cx="32" cy="25" r="7" fill="${o}" stroke="${c}" stroke-width="2"/>
        <path d="M24 46 L40 46 C40 37 36 34 32 34 C28 34 24 37 24 46 Z" fill="${o}" stroke="${c}" stroke-width="2"/>
      `;break;case`boto_cor_de_rosa`:l=`
        <!-- Boto Saltitante com Coração -->
        <path d="M18 42 C20 30 28 22 36 22 C43 22 46 28 44 34 C42 38 34 40 26 44 Z" fill="#f472b6" stroke="${c}" stroke-width="2"/>
        <path d="M36 22 C40 17 48 20 44 26 Z" fill="#ec4899"/>
        <circle cx="25" cy="30" r="2" fill="${c}"/>
        <path d="M34 14 C34 14 36 11 39 13 C41 15 39 18 34 21 C29 18 27 15 29 13 C32 11 34 14 34 14 Z" fill="#f43f5e"/>
      `;break;case`sniper`:l=`
        <!-- Mira Telescópica / Retículo de Alta Precisão -->
        <circle cx="32" cy="32" r="14" fill="none" stroke="${o}" stroke-width="3"/>
        <circle cx="32" cy="32" r="7" fill="none" stroke="${s}" stroke-width="2"/>
        <line x1="32" y1="14" x2="32" y2="50" stroke="${c}" stroke-width="2"/>
        <line x1="14" y1="32" x2="50" y2="32" stroke="${c}" stroke-width="2"/>
        <circle cx="32" cy="32" r="2" fill="#ef4444"/>
      `;break;case`homem_bomba`:l=`
        <!-- Bomba Redonda com Pavio Aceso -->
        <circle cx="32" cy="35" r="12" fill="#334155" stroke="${c}" stroke-width="2"/>
        <rect x="29" y="20" width="6" height="4" rx="1" fill="#64748b"/>
        <path d="M32 20 Q35 14 42 16" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="43" cy="16" r="3" fill="#ef4444"/>
        <path d="M28 33 Q32 37 36 33" stroke="#f8fafc" stroke-width="2" fill="none" stroke-linecap="round"/>
      `;break;case`principe`:l=`
        <!-- Pequena Coroa de Príncipe com Penacho -->
        <path d="M22 46 L42 46 L44 34 L36 37 L32 27 L28 37 L20 34 Z" fill="${s}" stroke="${c}" stroke-width="2"/>
        <path d="M32 27 Q37 18 35 13 Q31 16 32 27 Z" fill="#38bdf8"/>
        <circle cx="32" cy="33" r="2" fill="${o}"/>
      `;break;case`arqueiro`:l=`
        <!-- Arco e Flecha Élfico -->
        <path d="M22 20 Q38 32 22 44" fill="none" stroke="${o}" stroke-width="3" stroke-linecap="round"/>
        <line x1="22" y1="20" x2="22" y2="44" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="18" y1="32" x2="44" y2="32" stroke="${s}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M40 28 L46 32 L40 36 Z" fill="${s}"/>
      `;break;case`baratinha`:l=`
        <!-- Baratinha Fofa e Indestrutível com Óculos/Antenas -->
        <ellipse cx="32" cy="35" rx="8" ry="11" fill="#78350f" stroke="${c}" stroke-width="2"/>
        <path d="M28 25 Q22 15 16 16" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
        <path d="M36 25 Q42 15 48 16" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="28" cy="31" r="2" fill="#fbbf24"/>
        <circle cx="36" cy="31" r="2" fill="#fbbf24"/>
        <path d="M20 33 L14 30 M20 38 L13 40 M44 33 L50 30 M44 38 L51 40" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      `;break;case`construtor`:l=`
        <!-- Capacete de Obra com Martelo/Tijolos -->
        <path d="M20 34 C20 24 44 24 44 34 L46 38 L18 38 Z" fill="#eab308" stroke="${c}" stroke-width="2"/>
        <rect x="23" y="38" width="18" height="8" rx="2" fill="#b45309" stroke="${c}" stroke-width="1.5"/>
        <line x1="32" y1="38" x2="32" y2="46" stroke="${c}" stroke-width="1.5"/>
        <line x1="28" y1="20" x2="36" y2="28" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
      `;break;case`mago`:l=`
        <!-- Chapéu Pontudo de Mago com Estrelas -->
        <path d="M18 44 Q32 46 46 44 L38 24 L32 14 L26 24 Z" fill="#6366f1" stroke="${c}" stroke-width="2"/>
        <ellipse cx="32" cy="44" rx="16" ry="4" fill="#4f46e5" stroke="${c}" stroke-width="1.5"/>
        <polygon points="32,22 34,26 38,26 35,28 36,32 32,29 28,32 29,28 26,26 30,26" fill="#facc15"/>
      `;break;case`papa`:l=`
        <!-- Mitra Papal Imponente com Cruz Dourada Dupla -->
        <path d="M22 46 L42 46 C42 40 44 30 32 16 C20 30 22 40 22 46 Z" fill="#f8fafc" stroke="${c}" stroke-width="2"/>
        <path d="M32 24 L32 40 M26 30 L38 30 M28 34 L36 34" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="32" cy="15" r="2.5" fill="#eab308"/>
      `;break;case`guarda`:l=`
        <!-- Escudo de Guarda Robusto com Insígnia -->
        <path d="M22 20 L42 20 C42 34 32 46 32 46 C32 46 22 34 22 20 Z" fill="#0284c7" stroke="${c}" stroke-width="2.5"/>
        <path d="M32 24 L32 38 M26 30 L38 30" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>
      `;break;case`baleia_cinzenta`:l=`
        <!-- Baleia Cinzenta Gigante com Jato d'água -->
        <path d="M16 38 C18 26 32 24 44 30 C48 32 50 38 46 42 C38 46 22 46 16 38 Z" fill="#94a3b8" stroke="${c}" stroke-width="2"/>
        <path d="M16 38 L10 32 L12 42 Z" fill="#64748b"/>
        <circle cx="42" cy="34" r="2" fill="${c}"/>
        <path d="M36 24 C36 18 33 16 30 16 M36 24 C38 18 42 16 44 18" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      `;break;case`baleia_assassina`:l=`
        <!-- Orca (Preta e Branca com Mancha) -->
        <path d="M16 38 C20 26 34 24 46 30 C50 33 48 39 44 42 C34 46 20 46 16 38 Z" fill="#0f172a" stroke="${c}" stroke-width="2"/>
        <path d="M32 24 L36 16 L38 25 Z" fill="#0f172a"/>
        <ellipse cx="40" cy="33" rx="3" ry="2" fill="#ffffff"/>
        <circle cx="44" cy="35" r="1.5" fill="#38bdf8"/>
      `;break;case`gatito_gasoso`:l=`
        <!-- Gatinho com Fumaça / Máscara de Gás Fofa -->
        <circle cx="32" cy="34" r="10" fill="#a7f3d0" stroke="${c}" stroke-width="2"/>
        <polygon points="23,28 26,20 29,27" fill="#10b981"/>
        <polygon points="41,28 38,20 35,27" fill="#10b981"/>
        <circle cx="28" cy="34" r="3" fill="#065f46"/>
        <circle cx="36" cy="34" r="3" fill="#065f46"/>
        <path d="M30 46 Q24 44 26 40 Q32 38 34 42 Q38 44 42 41" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/>
      `;break;case`gatito_apaixonado`:l=`
        <!-- Gatinho com Olhos de Coração Radiante -->
        <circle cx="32" cy="33" r="11" fill="#fbcfe8" stroke="${c}" stroke-width="2"/>
        <polygon points="22,26 25,18 29,25" fill="#f43f5e"/>
        <polygon points="42,26 39,18 35,25" fill="#f43f5e"/>
        <!-- Olhos de coração -->
        <path d="M28 32 C28 30 26 29 25 30 C24 31 25 33 28 35 C31 33 32 31 31 30 C30 29 28 30 28 32 Z" fill="#e11d48"/>
        <path d="M36 32 C36 30 34 29 33 30 C32 31 33 33 36 35 C39 33 40 31 39 30 C38 29 36 30 36 32 Z" fill="#e11d48"/>
      `;break;case`gatito_mahchia`:l=`
        <!-- Bruxinha Mágica com Varinha de Estrela -->
        <circle cx="30" cy="34" r="9" fill="#e9d5ff" stroke="${c}" stroke-width="2"/>
        <polygon points="22,28 24,20 28,26" fill="#a855f7"/>
        <polygon points="38,28 36,20 32,26" fill="#a855f7"/>
        <line x1="36" y1="36" x2="48" y2="20" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
        <polygon points="48,16 49,20 53,20 50,22 51,26 48,23 45,26 46,22 43,20 47,20" fill="#fbbf24"/>
      `;break;case`sapo`:l=`
        <!-- Sapo Encantado com Olhinhos Esbugalhados -->
        <ellipse cx="32" cy="36" rx="12" ry="9" fill="#4ade80" stroke="${c}" stroke-width="2"/>
        <circle cx="26" cy="27" r="4.5" fill="#22c55e" stroke="${c}" stroke-width="1.5"/>
        <circle cx="38" cy="27" r="4.5" fill="#22c55e" stroke="${c}" stroke-width="1.5"/>
        <circle cx="26" cy="27" r="2" fill="${c}"/>
        <circle cx="38" cy="27" r="2" fill="${c}"/>
        <path d="M26 38 Q32 42 38 38" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      `;break;case`passaro_uratal`:l=`
        <!-- Pássaro Urutau com Penas Hipnóticas -->
        <ellipse cx="32" cy="34" rx="9" ry="12" fill="#78716c" stroke="${c}" stroke-width="2"/>
        <circle cx="29" cy="28" r="4" fill="#facc15" stroke="${c}" stroke-width="1.5"/>
        <circle cx="29" cy="28" r="2" fill="#000000"/>
        <polygon points="36,28 44,30 36,32" fill="#f97316"/>
        <path d="M24 44 Q32 50 40 44" fill="none" stroke="#d6d3d1" stroke-width="2"/>
      `;break;case`bela_adormecida`:l=`
        <!-- Gatinha Dorminhoca com "Zzz" e Travesseirinho -->
        <ellipse cx="32" cy="36" rx="11" ry="8" fill="#fed7aa" stroke="${c}" stroke-width="2"/>
        <polygon points="23,31 25,24 28,30" fill="#f97316"/>
        <polygon points="41,31 39,24 36,30" fill="#f97316"/>
        <!-- Olhinhos fechados dormindo -->
        <path d="M26 35 Q28 37 30 35 M34 35 Q36 37 38 35" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
        <!-- Zzz -->
        <text x="40" y="22" font-size="9" font-weight="bold" fill="#818cf8">Z</text>
        <text x="46" y="16" font-size="7" font-weight="bold" fill="#a5b4fc">z</text>
      `;break;case`perereca`:l=`
        <!-- Perereca Ágil em Posição de Salto -->
        <ellipse cx="32" cy="35" rx="10" ry="7" fill="#84cc16" stroke="${c}" stroke-width="2"/>
        <circle cx="25" cy="29" r="4" fill="#a3e635" stroke="${c}" stroke-width="1.5"/>
        <circle cx="39" cy="29" r="4" fill="#a3e635" stroke="${c}" stroke-width="1.5"/>
        <circle cx="25" cy="29" r="2" fill="#0f172a"/>
        <circle cx="39" cy="29" r="2" fill="#0f172a"/>
        <path d="M18 40 Q22 36 24 38 M46 40 Q42 36 40 38" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>
      `;break;case`goham`:l=`
        <!-- Goham: Fofura Hipnótica e Bochechuda -->
        <circle cx="32" cy="34" r="12" fill="#fef08a" stroke="${c}" stroke-width="2"/>
        <ellipse cx="25" cy="37" rx="3" ry="2" fill="#f472b6"/>
        <ellipse cx="39" cy="37" rx="3" ry="2" fill="#f472b6"/>
        <circle cx="27" cy="31" r="2" fill="${c}"/>
        <circle cx="37" cy="31" r="2" fill="${c}"/>
        <path d="M30 34 Q32 36 34 34" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="32" cy="18" r="3" fill="#ec4899"/>
      `;break;case`mirra`:l=`
        <!-- Mirra: Gatinha Branca Valente com Laço Vermelho -->
        <circle cx="32" cy="34" r="10" fill="#ffffff" stroke="${c}" stroke-width="2"/>
        <polygon points="23,27 25,19 29,26" fill="#fbcfe8"/>
        <polygon points="41,27 39,19 35,26" fill="#fbcfe8"/>
        <circle cx="28" cy="33" r="2" fill="#0f172a"/>
        <circle cx="36" cy="33" r="2" fill="#0f172a"/>
        <path d="M31 36 L33 36" stroke="#f43f5e" stroke-width="2"/>
        <!-- Lacinho -->
        <polygon points="23,22 27,24 23,26" fill="#ef4444"/>
        <polygon points="27,22 23,24 27,26" fill="#ef4444"/>
      `;break;case`quero_quero`:l=`
        <!-- Pássaro Quero-quero com Esporão e Penacho -->
        <ellipse cx="30" cy="35" rx="10" ry="8" fill="#64748b" stroke="${c}" stroke-width="2"/>
        <circle cx="35" cy="28" r="5" fill="#f8fafc" stroke="${c}" stroke-width="1.5"/>
        <circle cx="36" cy="27" r="1.5" fill="#ef4444"/>
        <polygon points="40,28 48,30 40,32" fill="#0f172a"/>
        <path d="M33 23 Q28 15 25 18" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
      `;break;case`tartaruga_maligna`:l=`
        <!-- Casco Espinhoso Enfeitiçado com Olhos Maliciosos -->
        <path d="M20 40 C20 28 44 28 44 40 Z" fill="#15803d" stroke="${c}" stroke-width="2"/>
        <polygon points="32,24 29,28 35,28" fill="#84cc16"/>
        <ellipse cx="44" cy="37" rx="4" ry="3" fill="#166534" stroke="${c}" stroke-width="1.5"/>
        <circle cx="45" cy="36" r="1.5" fill="#dc2626"/>
      `;break;case`pimentinha`:l=`
        <!-- Pimenta Vermelha Ardente com Fogo -->
        <path d="M38 22 C34 22 28 26 26 34 C24 42 32 46 34 46 C34 46 34 38 40 32 C43 28 42 22 38 22 Z" fill="#dc2626" stroke="${c}" stroke-width="2"/>
        <path d="M38 22 Q42 16 44 14" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/>
        <!-- Gotinhas de fogo / gelo ardente -->
        <circle cx="23" cy="28" r="2" fill="#38bdf8"/>
        <circle cx="43" cy="38" r="2.5" fill="#f97316"/>
      `}return`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${n}" height="${n}" class="piece-svg piece-${e} player-${t}">
      <defs>
        <radialGradient id="grad-${e}-${t}" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="${i}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${i}" stop-opacity="0.75"/>
        </radialGradient>
        <filter id="shadow-${e}-${t}" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <!-- Base circular de medalhão -->
      <circle cx="32" cy="32" r="27" fill="url(#grad-${e}-${t})" stroke="${a}" stroke-width="2.5" filter="url(#shadow-${e}-${t})"/>
      <circle cx="32" cy="32" r="23" fill="none" stroke="${a}" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>
      <!-- Ilustração interna -->
      ${l}
    </svg>
  `.trim()}var n=class{overlay;constructor(){this.overlay=document.createElement(`div`),this.overlay.className=`inspector-overlay hidden`,this.overlay.innerHTML=`
      <div class="inspector-card" role="dialog" aria-modal="true">
        <button class="inspector-close" aria-label="Fechar">&times;</button>
        <div class="inspector-header">
          <div class="inspector-icon" id="inspector-icon"></div>
          <div class="inspector-titles">
            <span class="inspector-category-badge" id="inspector-category"></span>
            <h3 class="inspector-name" id="inspector-name"></h3>
            <span class="inspector-subtitle" id="inspector-subtitle"></span>
          </div>
        </div>
        <div class="inspector-body">
          <div class="inspector-section">
            <h4>Como se move e age</h4>
            <p id="inspector-desc"></p>
          </div>
          <div class="inspector-stats" id="inspector-stats"></div>
        </div>
      </div>
    `,document.body.appendChild(this.overlay),this.overlay.querySelector(`.inspector-close`).addEventListener(`click`,()=>this.hide()),this.overlay.addEventListener(`click`,e=>{e.target===this.overlay&&this.hide()})}show(n,r=`white`){let i=e[n];if(!i)return;let a=this.overlay.querySelector(`#inspector-icon`),o=this.overlay.querySelector(`#inspector-name`),s=this.overlay.querySelector(`#inspector-subtitle`),c=this.overlay.querySelector(`#inspector-category`),l=this.overlay.querySelector(`#inspector-desc`),u=this.overlay.querySelector(`#inspector-stats`);a.innerHTML=t(n,r,72),o.textContent=i.name,s.textContent=i.subtitle,c.textContent={classic:`Clássica`,gatito:`Peças do Gatito`,gatita:`Peças da Gatita`}[i.category],c.className=`inspector-category-badge badge-${i.category}`,l.textContent=i.description;let d=`
      <div class="stat-pill"><strong>Limite:</strong> até ${i.maxCopies} no exército</div>
    `;i.isRoyal&&(d+=`<div class="stat-pill stat-royal">👑 Peça Real (Sujeita a Xeque)</div>`),i.isImmune&&(d+=`<div class="stat-pill stat-immune">🛡️ Imune a Capturas e Feitiços</div>`),i.cannotCapture&&(d+=`<div class="stat-pill stat-peace">🕊️ Não Captura Peças</div>`),n===`papa`&&(d+=`<div class="stat-pill stat-warning">⚠️ Não pode coexistir com Rainha</div>`),u.innerHTML=d,this.overlay.classList.remove(`hidden`)}hide(){this.overlay.classList.add(`hidden`)}};function r(e){return e===`white`?[6,7]:[0,1]}function i(t,n){let i=[],a=r(n),o={};for(let t in e)o[t]=0;let s=0;for(let e of a)for(let r=0;r<8;r++){let a=t[e][r];a&&(a.player!==n&&i.push({code:`WRONG_PLAYER_PIECE`,message:`Peça de outro jogador encontrada em (${e}, ${r}).`}),o[a.type]=(o[a.type]||0)+1,s++)}s<16?i.push({code:`INCOMPLETE_ARMY`,message:`O exército possui apenas ${s} de 16 peças posicionadas.`}):s>16&&i.push({code:`TOO_MANY_PIECES`,message:`O exército possui ${s} peças (máximo 16).`}),o.rei!==1&&i.push({code:`KING_COUNT_INVALID`,message:`O exército precisa ter exatamente 1 Rei (atual: ${o.rei}).`}),o.papa>0&&o.rainha>0&&i.push({code:`PAPA_RAINHA_CONFLICT`,message:`O Papa substitui a Rainha: não é permitido ter Papa e Rainha no mesmo exército.`});for(let[t,n]of Object.entries(o)){let r=e[t];r&&n>r.maxCopies&&i.push({code:`EXCEEDED_MAX_COPIES`,message:`Limite de cópias excedido para ${r.name}: máximo ${r.maxCopies}, atual ${n}.`})}return{isValid:i.length===0,errors:i,pieceCounts:o}}function a(e){let t=Array(8).fill(null).map(()=>Array(8).fill(null)),[n,r]=e===`white`?[6,7]:[1,0],i=[`torre`,`cavalo`,`bispo`,`rainha`,`rei`,`bispo`,`cavalo`,`torre`];for(let a=0;a<8;a++)t[n][a]={instanceId:`${e}-peao-${a}`,type:`peao`,player:e,hasMoved:!1},t[r][a]={instanceId:`${e}-${i[a]}-${a}`,type:i[a],player:e,hasMoved:!1};return t}var o=`xadrex2_army_presets_v1`,s=class{element;player=`white`;board=a(`white`);selectedDeckPiece=null;selectedBoardSquare=null;currentTab=`classic`;inspector;onCompleteCallback=()=>{};constructor(e){this.inspector=e,this.element=document.createElement(`div`),this.element.className=`setup-screen-container`}getElement(){return this.element}startSetup(e,t){this.player=e,this.onCompleteCallback=t,this.board=a(e),this.selectedDeckPiece=null,this.selectedBoardSquare=null,this.currentTab=`classic`,this.render()}render(){let e=this.player===`white`,t=i(this.board,this.player),n=r(this.player);this.element.innerHTML=`
      <header class="setup-header">
        <div class="player-badge player-${this.player}">
          <span class="player-icon">${e?`🐱`:`🐾`}</span>
          <div class="player-info">
            <h2>Montagem de Exército: ${e?`Jogador 1 (Brancas / Gatito)`:`Jogador 2 (Pretas / Gatita)`}</h2>
            <p>Posicione suas 16 peças livremente nas suas 2 fileiras iniciais.</p>
          </div>
        </div>
        <div class="setup-quick-actions">
          <button class="btn btn-secondary" id="btn-reset-standard" title="Restaurar formação clássica de xadrez">♟️ Padrão Clássico</button>
          <button class="btn btn-secondary" id="btn-clear-board" title="Esvaziar todas as casas">🗑️ Limpar</button>
          <button class="btn btn-secondary" id="btn-save-preset" title="Salvar exército no navegador">💾 Salvar Preset</button>
          <button class="btn btn-secondary" id="btn-load-preset" title="Carregar exército salvo">📂 Carregar Preset</button>
        </div>
      </header>

      <main class="setup-main-layout">
        <!-- Tabuleiro -->
        <section class="setup-board-section">
          <div class="board-frame">
            <div class="board-grid setup-grid" id="setup-board-grid"></div>
          </div>
          <div class="setup-status-bar ${t.isValid?`valid`:`invalid`}">
            <div class="status-message">
              ${t.isValid?`<strong>✅ Exército Pronto!</strong> Todas as 16 peças posicionadas respeitando as regras.`:`<strong>⚠️ Ajustes Necessários:</strong> ${t.errors.map(e=>e.message).join(` | `)}`}
            </div>
            <button class="btn btn-primary btn-large" id="btn-confirm-army" ${t.isValid?``:`disabled`}>
              Confirmar Exército ➔
            </button>
          </div>
        </section>

        <!-- Menu Lateral em Abas -->
        <aside class="setup-deck-section">
          <div class="deck-tabs">
            <button class="deck-tab ${this.currentTab===`classic`?`active`:``}" data-tab="classic">
              Clássicas (6)
            </button>
            <button class="deck-tab ${this.currentTab===`gatito`?`active`:``}" data-tab="gatito">
              Gatito (10)
            </button>
            <button class="deck-tab ${this.currentTab===`gatita`?`active`:``}" data-tab="gatita">
              Gatita (14)
            </button>
          </div>

          <div class="deck-piece-list" id="deck-piece-list"></div>
        </aside>
      </main>
    `,this.renderBoard(n,t),this.renderDeckList(t),this.attachEventListeners()}renderBoard(e,n){let r=this.element.querySelector(`#setup-board-grid`);r.innerHTML=``;for(let n=0;n<8;n++)for(let i=0;i<8;i++){let a=e.includes(n),o=(n+i)%2==1,s=document.createElement(`div`);s.className=`board-cell ${o?`dark`:`light`} ${a?`setup-zone`:`neutral-zone`}`,s.dataset.r=String(n),s.dataset.c=String(i),this.selectedBoardSquare?.r===n&&this.selectedBoardSquare?.c===i&&s.classList.add(`selected`);let c=this.board[n][i];if(c){let e=document.createElement(`div`);e.className=`board-piece`,e.setAttribute(`draggable`,`true`),e.innerHTML=t(c.type,c.player,56),s.appendChild(e),e.addEventListener(`dragstart`,e=>{e.dataTransfer?.setData(`text/plain`,JSON.stringify({r:n,c:i,from:`board`}))})}a&&(s.addEventListener(`dragover`,e=>{e.preventDefault(),s.classList.add(`drag-over`)}),s.addEventListener(`dragleave`,()=>{s.classList.remove(`drag-over`)}),s.addEventListener(`drop`,e=>{e.preventDefault(),s.classList.remove(`drag-over`);let t=e.dataTransfer?.getData(`text/plain`);if(t){let e=JSON.parse(t);e.from===`deck`&&e.pieceId?this.placePiece(e.pieceId,n,i):e.from===`board`&&this.swapOrMoveBoardSquares({r:e.r,c:e.c},{r:n,c:i})}}),s.addEventListener(`click`,()=>{this.selectedDeckPiece?this.placePiece(this.selectedDeckPiece,n,i):this.selectedBoardSquare?(this.swapOrMoveBoardSquares(this.selectedBoardSquare,{r:n,c:i}),this.selectedBoardSquare=null,this.render()):c&&(this.selectedBoardSquare={r:n,c:i},this.render())})),r.appendChild(s)}}renderDeckList(n){let r=this.element.querySelector(`#deck-piece-list`);r.innerHTML=``;let i=Object.values(e).filter(e=>e.category===this.currentTab);for(let e of i){let i=n.pieceCounts[e.id]||0,a=i>=e.maxCopies,o=e.id===`papa`&&n.pieceCounts.rainha>0||e.id===`rainha`&&n.pieceCounts.papa>0,s=this.selectedDeckPiece===e.id,c=document.createElement(`div`);c.className=`deck-card ${s?`selected`:``} ${a?`limit-reached`:``}`,c.setAttribute(`draggable`,a?`false`:`true`),c.innerHTML=`
        <div class="card-icon">${t(e.id,this.player,48)}</div>
        <div class="card-details">
          <div class="card-title-row">
            <span class="card-name">${e.name}</span>
            <button class="card-info-btn" data-id="${e.id}" title="Ver detalhes das regras">ℹ️</button>
          </div>
          <span class="card-subtitle">${e.subtitle}</span>
          <div class="card-meta">
            <span class="count-pill ${a?`full`:``}">
              ${i} / ${e.maxCopies}
            </span>
            ${o?`<span class="conflict-badge">Conflito Papa/Rainha</span>`:``}
          </div>
        </div>
      `,c.addEventListener(`dragstart`,t=>{a?t.preventDefault():t.dataTransfer?.setData(`text/plain`,JSON.stringify({from:`deck`,pieceId:e.id}))}),c.addEventListener(`click`,t=>{t.target.classList.contains(`card-info-btn`)?this.inspector.show(e.id,this.player):(this.selectedDeckPiece===e.id?this.selectedDeckPiece=null:(this.selectedDeckPiece=e.id,this.selectedBoardSquare=null),this.render())}),r.appendChild(c)}}placePiece(e,t,n){this.board[t][n]={instanceId:`${this.player}-${e}-${Date.now()}-${Math.random().toString(36).substr(2,4)}`,type:e,player:this.player,hasMoved:!1},this.render()}swapOrMoveBoardSquares(e,t){let n=this.board[t.r][t.c];this.board[t.r][t.c]=this.board[e.r][e.c],this.board[e.r][e.c]=n,this.render()}attachEventListeners(){this.element.querySelectorAll(`.deck-tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.tab;t&&(this.currentTab=t,this.render())})}),this.element.querySelector(`#btn-reset-standard`)?.addEventListener(`click`,()=>{this.board=a(this.player),this.selectedDeckPiece=null,this.selectedBoardSquare=null,this.render()}),this.element.querySelector(`#btn-clear-board`)?.addEventListener(`click`,()=>{let e=r(this.player);for(let t of e)for(let e=0;e<8;e++)this.board[t][e]=null;this.selectedDeckPiece=null,this.selectedBoardSquare=null,this.render()}),this.element.querySelector(`#btn-save-preset`)?.addEventListener(`click`,()=>{this.saveCurrentPreset()}),this.element.querySelector(`#btn-load-preset`)?.addEventListener(`click`,()=>{this.loadSavedPreset()}),this.element.querySelector(`#btn-confirm-army`)?.addEventListener(`click`,()=>{i(this.board,this.player).isValid&&this.onCompleteCallback(this.board)})}saveCurrentPreset(){let e=window.prompt(`Digite um nome para o seu Preset de Exército:`,`Exército ${this.player===`white`?`Gatito`:`Gatita`} 1`);if(!e)return;let t=r(this.player),n=[];for(let e of t)for(let r=0;r<8;r++){let i=this.board[e][r];if(i){let a=e===t[0]?0:1;n.push({r:a,c:r,pieceId:i.type})}}let i={id:`preset-${Date.now()}`,name:e,createdAt:Date.now(),layout:n},a=localStorage.getItem(o),s=a?JSON.parse(a):[];s.push(i),localStorage.setItem(o,JSON.stringify(s)),alert(`Preset "${e}" salvo com sucesso no navegador!`)}loadSavedPreset(){let e=localStorage.getItem(o),t=e?JSON.parse(e):[];if(t.length===0){alert(`Nenhum preset encontrado no armazenamento local. Crie e salve um primeiro!`);return}let n=t.map((e,t)=>`${t+1}: ${e.name}`).join(`
`),i=window.prompt(`Escolha o número do preset a carregar:\n${n}`);if(!i)return;let a=parseInt(i,10)-1;if(a>=0&&a<t.length){let e=t[a],n=r(this.player);for(let e of n)for(let t=0;t<8;t++)this.board[e][t]=null;for(let t of e.layout){let e=t.r===0?n[0]:n[1];this.board[e][t.c]={instanceId:`${this.player}-${t.pieceId}-${Date.now()}-${Math.random().toString(36).substr(2,4)}`,type:t.pieceId,player:this.player,hasMoved:!1}}this.render(),alert(`Preset "${e.name}" carregado!`)}else alert(`Opção inválida.`)}},c=class{element;onReadyCallback=()=>{};constructor(){this.element=document.createElement(`div`),this.element.className=`curtain-container hidden`,this.element.innerHTML=`
      <div class="curtain-card">
        <div class="curtain-emblem">🐱 🎭 🐾</div>
        <h2>Zona Secreta de Privacidade</h2>
        <p class="curtain-message">
          Passe o mouse / tablet para o <strong>Jogador 2</strong>!
        </p>
        <p class="curtain-hint">
          Nenhuma formação do Jogador 1 será visível. O Jogador 2 montará seu exército às cegas antes da revelação simultânea.
        </p>
        <button class="btn btn-primary btn-large curtain-btn" id="curtain-proceed-btn">
          Estou Pronto! Iniciar Montagem do Jogador 2 ➔
        </button>
      </div>
    `,this.element.querySelector(`#curtain-proceed-btn`).addEventListener(`click`,()=>{this.hide(),this.onReadyCallback()})}getElement(){return this.element}show(e){this.onReadyCallback=e,this.element.classList.remove(`hidden`)}hide(){this.element.classList.add(`hidden`)}};function l(e,t){return e>=0&&e<8&&t>=0&&t<8}function u(e){return e.map(e=>e.map(e=>e?{...e}:null))}function d(e,t){return e.r===t.r&&e.c===t.c}function f(e,t){let n=e.r-t.r,r=e.c-t.c;return n*n+r*r}function p(t,n){let r=[];for(let i=0;i<8;i++)for(let a=0;a<8;a++){let o=t[i][a];o&&o.player===n&&e[o.type]?.isRoyal&&r.push({piece:o,pos:{r:i,c:a}})}return r}function m(e,t,n){let r=n===`white`?`black`:`white`;for(let n=-1;n<=1;n++)for(let i=-1;i<=1;i++){if(n===0&&i===0)continue;let a=t.r+n,o=t.c+i;if(l(a,o)){let t=e[a][o];if(t&&t.player===r&&t.type===`goham`)return!0}}return!1}function h(e,t){for(let n=0;n<8;n++)for(let r=0;r<8;r++){let i=e[n][r];if(i&&i.player===t&&i.type===`papa`)return!0}return!1}function g(t,n){let r=t[n.r][n.c];if(!r||(r.frozenRounds??0)>0||m(t,n,r.player))return[];let i=[],a=r.player,o=a===`white`?`black`:`white`,s=a===`white`?-1:1,c=a===`white`?6:1,u=e[r.type],f=e=>!(!e||e.player===a||e.type===`baratinha`),g=e=>{i.push({type:`MOVE`,from:n,to:e,description:`Mover para ${x(e.c)}${8-e.r}`,badgeColor:`blue`})},_=e=>{i.push({type:`CAPTURE`,from:n,to:e,target:e,description:`Capturar em ${x(e.c)}${8-e.r}`,badgeColor:`red`})},v=e=>{for(let[r,i]of e){let e=1;for(;;){let a=n.r+r*e,o=n.c+i*e;if(!l(a,o))break;let s=t[a][o];if(!s)g({r:a,c:o});else{!u.cannotCapture&&f(s)&&_({r:a,c:o});break}e++}}},y=e=>{for(let[r,i]of e){let e=n.r+r,a=n.c+i;if(!l(e,a))continue;let o=t[e][a];o?!u.cannotCapture&&f(o)&&_({r:e,c:a}):g({r:e,c:a})}};switch(r.type){case`rei`:case`principe`:y([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);break;case`rainha`:v([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);break;case`torre`:v([[-1,0],[1,0],[0,-1],[0,1]]);break;case`bispo`:v([[-1,-1],[-1,1],[1,-1],[1,1]]),h(t,a)&&y([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);break;case`cavalo`:case`boto_cor_de_rosa`:for(let[e,r]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){let i=n.r+e,a=n.c+r;if(!l(i,a))continue;let o=t[i][a];o?f(o)&&_({r:i,c:a}):g({r:i,c:a})}break;case`peao`:case`homem_bomba`:case`guarda`:case`pimentinha`:{let e=n.r+s;if(l(e,n.c)&&!t[e][n.c]&&(g({r:e,c:n.c}),n.r===c)){let e=n.r+2*s;l(e,n.c)&&!t[e][n.c]&&g({r:e,c:n.c})}for(let e of[-1,1]){let r=n.r+s,i=n.c+e;if(l(r,i)){let e=t[r][i];e&&f(e)&&_({r,c:i})}}break}case`sniper`:for(let[e,r]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let a=1;for(;;){let o=n.r+e*a,s=n.c+r*a;if(!l(o,s))break;let c=t[o][s];if(!c)g({r:o,c:s});else{f(c)&&i.push({type:`RANGED_ATTACK`,from:n,to:n,target:{r:o,c:s},description:`Tiro Sniper em ${x(s)}${8-o}`,badgeColor:`red`});break}a++}}break;case`arqueiro`:for(let e=-1;e<=1;e++)for(let r=-1;r<=1;r++){if(e===0&&r===0)continue;let i=n.r+e,a=n.c+r;l(i,a)&&!t[i][a]&&g({r:i,c:a})}for(let[e,r]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){let a=n.r+e,o=n.c+r;if(l(a,o)){let e=t[a][o];e&&f(e)&&i.push({type:`RANGED_ATTACK`,from:n,to:n,target:{r:a,c:o},description:`Disparo de Flecha em ${x(o)}${8-a}`,badgeColor:`red`})}}break;case`baratinha`:for(let[e,r]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){let i=1;for(;;){let a=n.r+e*i,o=n.c+r*i;if(!l(a,o))break;if(!t[a][o])g({r:a,c:o});else break;i++}}break;case`construtor`:for(let e=-1;e<=1;e++)for(let r=-1;r<=1;r++){if(e===0&&r===0)continue;let o=n.r+e,s=n.c+r;if(l(o,s)){let e=t[o][s];e?e.player===a&&e.type===`peao`&&i.push({type:`CONSTRUCTOR_BUILD`,from:n,to:n,target:{r:o,c:s},description:`Construir Torre sobre Peão em ${x(s)}${8-o}`,badgeColor:`green`}):g({r:o,c:s})}}break;case`mago`:for(let e=-1;e<=1;e++)for(let r=-1;r<=1;r++){if(e===0&&r===0)continue;let i=n.r+e,a=n.c+r;l(i,a)&&!t[i][a]&&g({r:i,c:a})}i.push({type:`MAGO_SWAP`,from:n,to:n,description:`Transmutar: Permutar 2 casas vizinhas`,badgeColor:`purple`});break;case`papa`:y([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);break;case`baleia_cinzenta`:for(let[e,r]of[[-1,0],[1,0],[0,-1],[0,1]]){let o=1,s=[];for(;;){let c=n.r+e*o,u=n.c+r*o;if(!l(c,u))break;let d=t[c][u];if(!d)s.length===0?g({r:c,c:u}):i.push({type:`BALEIA_CINZENTA_SWEEP`,from:n,to:{r:c,c:u},secondaryTargets:[...s],description:`Tsunami Devastador até ${x(u)}${8-c} (capturando ${s.length})`,badgeColor:`red`});else if(d.player===a)break;else{if(d.type===`baratinha`)break;if(s.length===0)s.push({r:c,c:u}),i.push({type:`BALEIA_CINZENTA_SWEEP`,from:n,to:{r:c,c:u},secondaryTargets:[{r:c,c:u}],description:`Capturar 1ª presa em ${x(u)}${8-c}`,badgeColor:`red`});else if(s.length===1){s.push({r:c,c:u}),i.push({type:`BALEIA_CINZENTA_SWEEP`,from:n,to:{r:c,c:u},secondaryTargets:[...s],description:`Captura dupla (2 presas) em ${x(u)}${8-c}`,badgeColor:`red`});break}}o++}}break;case`baleia_assassina`:for(let[e,r]of[[-1,0],[1,0],[0,-1],[0,1]]){let i=1;for(;;){let a=n.r+e*i,o=n.c+r*i;if(!l(a,o))break;if(!t[a][o])g({r:a,c:o});else break;i++}}for(let e of[-1,0,1]){let r=n.r+s,i=n.c+e;if(l(r,i)){let e=t[r][i];e&&f(e)&&_({r,c:i})}}break;case`gatito_gasoso`:for(let[e,r]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){let a=n.r+e,o=n.c+r;if(!l(a,o))continue;let s,c;if(Math.abs(e)===2){let t=n.r+e/2;s=[{r:t,c:n.c},{r:a,c:n.c}],c=[{r:n.r,c:o},{r:t,c:o}]}else{let e=n.c+r/2;s=[{r:n.r,c:e},{r:n.r,c:o}],c=[{r:a,c:n.c},{r:a,c:e}]}let u=(e,t)=>{i.push({type:`GATITO_GASOSO_JUMP`,from:n,to:{r:a,c:o},route:e,description:`Salto Tóxico (${t}) até ${x(o)}${8-a}`,badgeColor:`purple`})},d=s.some(e=>{let n=t[e.r][e.c];return n&&n.type!==`baratinha`}),f=c.some(e=>{let n=t[e.r][e.c];return n&&n.type!==`baratinha`});d||f?(u(s,`Curva A`),u(c,`Curva B`)):u(s,`Salto`)}break;case`gatito_apaixonado`:for(let[e,r]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){let i=n.r+e,a=n.c+r;if(!l(i,a))continue;let o=t[i][a];o?f(o)&&_({r:i,c:a}):g({r:i,c:a})}for(let e=-2;e<=2;e++)for(let r=-2;r<=2;r++){if(e===0&&r===0)continue;let a=n.r+e,s=n.c+r;if(l(a,s)){let e=t[a][s];e&&e.player===o&&e.type===`rainha`&&(i.some(e=>e.to.r===a&&e.to.c===s)||i.push({type:`CAPTURE`,from:n,to:{r:a,c:s},target:{r:a,c:s},description:`Pulo Apaixonado na Rainha em ${x(s)}${8-a}! ❤️`,badgeColor:`red`}))}}break;case`gatito_mahchia`:{let e=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],r=p(t,o);for(let[a,s]of e){let e=1;for(;;){let c=n.r+a*e,u=n.c+s*e;if(!l(c,u))break;let f=t[c][u];if(!f)g({r:c,c:u});else{if(f.player===o&&f.type!==`baratinha`){if(r.length===1&&d(r[0].pos,{r:c,c:u}))_({r:c,c:u});else{let t=e===1?n.r:n.r+a*(e-1),r=e===1?n.c:n.c+s*(e-1);i.push({type:`TRANSFORM_SAPO`,from:n,to:{r:t,c:r},target:{r:c,c:u},description:`Enfeitiçar em Sapo em ${x(u)}${8-c}`,badgeColor:`green`})}}break}e++}}break}case`sapo`:{let e=n.r+s;l(e,n.c)&&!t[e][n.c]&&g({r:e,c:n.c});break}case`passaro_uratal`:for(let[e,r]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let i=1;for(;;){let a=n.r+e*i,o=n.c+r*i;if(!l(a,o))break;if(!t[a][o])g({r:a,c:o});else break;i++}}break;case`bela_adormecida`:case`mirra`:{let e=n.r+s;if(l(e,n.c)){let r=t[e][n.c];r?f(r)&&_({r:e,c:n.c}):g({r:e,c:n.c})}break}case`perereca`:y([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);for(let e=-1;e<=1;e++)for(let r=-1;r<=1;r++){if(e===0&&r===0)continue;let a=n.r+e,s=n.c+r,c=n.r+2*e,u=n.c+2*r;if(l(a,s)&&l(c,u)){let e=t[a][s],r=t[c][u];e&&e.player===o&&!r&&i.push({type:`PERERECA_LEAP`,from:n,to:{r:c,c:u},description:`Pulo da Perereca sobre inimigo para ${x(u)}${8-c}`,badgeColor:`purple`})}}break;case`goham`:{let e=n.r+s;l(e,n.c)&&!t[e][n.c]&&g({r:e,c:n.c});break}case`quero_quero`:{let e=n.r+s;l(e,n.c)&&!t[e][n.c]&&g({r:e,c:n.c});for(let e=1;e<=4;e++){let r=n.r+s*e;if(!l(r,n.c))break;let i=t[r][n.c];if(i){f(i)&&_({r,c:n.c});break}}break}case`tartaruga_maligna`:{let e=n.r+s;if(l(e,n.c)){let r=t[e][n.c];r?r.player===o&&r.type!==`baratinha`&&i.push({type:`TRANSFORM_SAPO`,from:n,to:n,target:{r:e,c:n.c},description:`Enfeitiçar em Sapo em ${x(n.c)}${8-e}`,badgeColor:`green`}):g({r:e,pos:{r:e,c:n.c}}.pos)}break}}return i}function _(t,n,r){for(let i=0;i<8;i++)for(let a=0;a<8;a++){let o=t[i][a];if(!o||o.player!==r||e[o.type]?.noThreatCheck)continue;let s=g(t,{r:i,c:a});for(let e of s)if((e.type===`CAPTURE`||e.type===`RANGED_ATTACK`||e.type===`TRANSFORM_SAPO`||e.type===`BALEIA_CINZENTA_SWEEP`)&&(d(e.to,n)||e.target&&d(e.target,n)||e.secondaryTargets&&e.secondaryTargets.some(e=>d(e,n)))||e.type===`GATITO_GASOSO_JUMP`&&(d(e.to,n)||e.route&&e.route.some(e=>d(e,n))))return!0}return!1}function v(e,t){let n=u(e),r=n[t.from.r][t.from.c];if(!r)return n;switch(t.type){case`MOVE`:case`CAPTURE`:case`PERERECA_LEAP`:n[t.from.r][t.from.c]=null,n[t.to.r][t.to.c]={...r,hasMoved:!0};break;case`RANGED_ATTACK`:t.target&&(n[t.target.r][t.target.c]=null);break;case`BALEIA_CINZENTA_SWEEP`:if(n[t.from.r][t.from.c]=null,t.secondaryTargets)for(let e of t.secondaryTargets)n[e.r][e.c]=null;n[t.to.r][t.to.c]={...r,hasMoved:!0};break;case`GATITO_GASOSO_JUMP`:if(n[t.from.r][t.from.c]=null,t.route)for(let e of t.route){let t=n[e.r][e.c];t&&t.type!==`baratinha`&&(n[e.r][e.c]=null)}n[t.to.r][t.to.c]={...r,hasMoved:!0};break;case`TRANSFORM_SAPO`:if(n[t.from.r][t.from.c]=null,n[t.to.r][t.to.c]={...r,hasMoved:!0},t.target){let e=n[t.target.r][t.target.c];e&&e.type!==`baratinha`&&(n[t.target.r][t.target.c]={...e,originalType:e.originalType||e.type,type:`sapo`})}break;case`CONSTRUCTOR_BUILD`:if(t.target){let e=n[t.target.r][t.target.c];e&&(n[t.target.r][t.target.c]={...e,type:`torre`})}}return n}function y(e,t,n=null){let r=e[t.r][t.c];if(!r)return[];let i=g(e,t),a=r.player,o=a===`white`?`black`:`white`,s=[];for(let t of i){if(t.type===`MAGO_SWAP`){s.push(t);continue}let n=v(e,t),r=p(n,a);if(r.length!==0){if(r.length===1){let e=r[0].pos;if(_(n,e,o))continue}s.push(t)}}if(n&&s.length>0){let e=-1;for(let t of s){let r=t.to,i=f(r,n);i>e&&(e=i)}return s.filter(t=>f(t.to,n)===e)}return s}function b(e,t,n=null){let r=[];for(let i=0;i<8;i++)for(let a=0;a<8;a++){let o=e[i][a];if(o&&o.player===t){let t=y(e,{r:i,c:a},n);t.length>0&&r.push({from:{r:i,c:a},actions:t})}}return r}function x(e){return String.fromCharCode(97+e)}function S(e,t){let n=Array(8).fill(null).map(()=>Array(8).fill(null));for(let t=6;t<=7;t++)for(let r=0;r<8;r++)e[t][r]&&(n[t][r]={...e[t][r]});for(let e=0;e<=1;e++)for(let r=0;r<8;r++)t[e][r]&&(n[e][r]={...t[e][r]});return{board:n,turn:`white`,halfMoves:0,fullMoves:1,history:[`Partida iniciada! Exércitos revelados.`],lastUratalScreechTurn:null,winner:null,winReason:void 0,inCheck:!1,selectedPos:null,validActions:[],pendingSubStep:null,pendingReaction:null}}function C(t,n){if(t.winner)return t;switch(n.type){case`SELECT_PIECE`:{if(t.pendingSubStep||t.pendingReaction)return t;let e=t.board[n.pos.r][n.pos.c];if(!e||e.player!==t.turn)return{...t,selectedPos:null,validActions:[]};let r=t.lastUratalScreechTurn?.player===t.turn?t.lastUratalScreechTurn.birdPos:null,i=y(t.board,n.pos,r);return{...t,selectedPos:n.pos,validActions:i}}case`DESELECT`:return t.pendingSubStep||t.pendingReaction?t:{...t,selectedPos:null,validActions:[]};case`EXECUTE_ACTION`:return t.pendingSubStep||t.pendingReaction?t:T(t,n.action);case`RESPOND_GUARD`:return t.pendingReaction?E(t,n.sacrifice):t;case`EXPLODE_BOMBA`:return t.pendingSubStep?.type===`HOMEM_BOMBA_DECISION`?O(t,t.pendingSubStep.piecePos):t;case`SKIP_BOMBA`:return t.pendingSubStep?.type===`HOMEM_BOMBA_DECISION`?A({...t,pendingSubStep:null}):t;case`EXPLODE_PIMENTINHA`:return t.pendingSubStep?.type===`PIMENTINHA_DECISION`?k(t,t.pendingSubStep.piecePos):t;case`SKIP_PIMENTINHA`:return t.pendingSubStep?.type===`PIMENTINHA_DECISION`?A({...t,pendingSubStep:null}):t;case`PROMOTE_PAWN`:{if(t.pendingSubStep?.type!==`PROMOTION`)return t;let{r,c:i}=t.pendingSubStep.piecePos,a=u(t.board),o=a[r][i];o&&(a[r][i]={...o,type:n.newType});let s=`${t.turn===`white`?`Brancas`:`Pretas`}: Peão promovido a ${e[n.newType].name} em ${x(i)}${8-r}!`;return A({...t,board:a,pendingSubStep:null,history:[s,...t.history]})}case`SELECT_MAGO_FIRST_TARGET`:{if(!t.selectedPos)return t;let e=t.board[t.selectedPos.r][t.selectedPos.c];return!e||e.type!==`mago`?t:{...t,pendingSubStep:{type:`MAGO_FIRST_SELECTED`,magoPos:t.selectedPos,firstPos:n.firstPos}}}case`SELECT_MAGO_SECOND_TARGET`:{if(t.pendingSubStep?.type!==`MAGO_FIRST_SELECTED`)return t;let{firstPos:e,magoPos:r}=t.pendingSubStep,i=n.secondPos,a=u(t.board),o=a[e.r][e.c];a[e.r][e.c]=a[i.r][i.c],a[i.r][i.c]=o;let s=`${t.turn===`white`?`Brancas`:`Pretas`}: Mago permutou ${x(e.c)}${8-e.r} com ${x(i.c)}${8-i.r}!`;return A({...t,board:a,selectedPos:null,validActions:[],pendingSubStep:null,history:[s,...t.history]})}default:return t}}function w(e,t,n){for(let r=-1;r<=1;r++)for(let i=-1;i<=1;i++){if(r===0&&i===0)continue;let a=t.r+r,o=t.c+i;if(l(a,o)){let t=e[a][o];if(t&&t.player===n&&t.type===`guarda`)return{pos:{r:a,c:o},piece:t}}}return null}function T(e,t){let n=e.board[t.from.r][t.from.c];if(!n)return e;let r=null;if(t.type===`CAPTURE`?r=t.to:(t.type===`RANGED_ATTACK`||t.type===`TRANSFORM_SAPO`)&&(r=t.target||null),r){let i=e.board[r.r][r.c];if(i&&i.player!==e.turn){let a=w(e.board,r,i.player);if(a)return{...e,pendingReaction:{attacker:n,attackAction:t,targetPiece:i,targetPos:r,guardPos:a.pos,guardPiece:a.piece}}}}return D(e,t)}function E(t,n){let r=t.pendingReaction;if(!n)return D({...t,pendingReaction:null},r.attackAction);let i=u(t.board),a=r.targetPos,o=r.guardPos,s=i[a.r][a.c],c=i[o.r][o.c];i[o.r][o.c]=s,i[a.r][a.c]=c;let l=`🛡️ Guarda se sacrificou para salvar ${e[r.targetPiece.type].name} em ${x(a.c)}${8-a.r}!`;return D({...t,board:i,pendingReaction:null,history:[l,...t.history]},r.attackAction)}function D(t,n){let r=u(t.board),i=r[n.from.r][n.from.c],a=t.turn,o=a===`white`?`black`:`white`,s=null,c=`${a===`white`?`Brancas`:`Pretas`}: ${n.description}`,d=null;switch(n.type){case`MOVE`:r[n.from.r][n.from.c]=null,r[n.to.r][n.to.c]={...i,hasMoved:!0},i.type===`passaro_uratal`&&(d=n.to);break;case`CAPTURE`:{let e=r[n.to.r][n.to.c];i.type===`boto_cor_de_rosa`&&e?.type===`rainha`&&(s={winner:a,reason:`O Boto Cor-de-Rosa capturou a Rainha inimiga e conquistou o reino! Vitória instantânea!`}),r[n.from.r][n.from.c]=null,r[n.to.r][n.to.c]={...i,hasMoved:!0};break}case`RANGED_ATTACK`:if(n.target){let e=r[n.target.r][n.target.c];i.type===`boto_cor_de_rosa`&&e?.type===`rainha`&&(s={winner:a,reason:`O Boto Cor-de-Rosa eliminou a Rainha inimiga! Vitória instantânea!`}),r[n.target.r][n.target.c]=null}r[n.from.r][n.from.c]={...i,hasMoved:!0};break;case`BALEIA_CINZENTA_SWEEP`:if(r[n.from.r][n.from.c]=null,n.secondaryTargets)for(let e of n.secondaryTargets)r[e.r][e.c]=null;r[n.to.r][n.to.c]={...i,hasMoved:!0};break;case`GATITO_GASOSO_JUMP`:{if(r[n.from.r][n.from.c]=null,n.route)for(let e of n.route){let t=r[e.r][e.c];t&&t.type!==`baratinha`&&(r[e.r][e.c]=null)}let e=r[n.to.r][n.to.c];e&&e.type!==`baratinha`&&(r[n.to.r][n.to.c]=null),r[n.to.r][n.to.c]={...i,hasMoved:!0};break}case`TRANSFORM_SAPO`:if(r[n.from.r][n.from.c]=null,r[n.to.r][n.to.c]={...i,hasMoved:!0},n.target){let t=r[n.target.r][n.target.c];t&&t.type!==`baratinha`&&(r[n.target.r][n.target.c]={...t,originalType:t.originalType||t.type,type:`sapo`},c+=` (transformou ${e[t.type].name} em Sapo! 🐸)`)}break;case`CONSTRUCTOR_BUILD`:if(n.target){let e=r[n.target.r][n.target.c];e&&(r[n.target.r][n.target.c]={...e,type:`torre`},c=`${a===`white`?`Brancas`:`Pretas`}: Construtor ergueu uma Torre sobre o Peão em ${x(n.target.c)}${8-n.target.r}! 🏰`)}r[n.from.r][n.from.c]={...i,hasMoved:!0};break;case`PERERECA_LEAP`:r[n.from.r][n.from.c]=null,r[n.to.r][n.to.c]={...i,hasMoved:!0};break;case`MAGO_SWAP`:return{...t,pendingSubStep:null}}if(i.type===`rainha`)for(let t=-1;t<=1;t++)for(let i=-1;i<=1;i++){if(t===0&&i===0)continue;let o=n.to.r+t,s=n.to.c+i;if(l(o,s)){let t=r[o][s];t&&t.player===a&&t.type===`sapo`&&t.originalType&&(c+=` (A Rainha curou o Sapo em ${x(s)}${8-o} de volta a ${e[t.originalType].name}! ✨)`,r[o][s]={...t,type:t.originalType,originalType:void 0})}}let f={...t,board:r,selectedPos:null,validActions:[],history:[c,...t.history],lastUratalScreechTurn:d?{player:o,birdPos:d}:t.lastUratalScreechTurn?.player===a?null:t.lastUratalScreechTurn};if(s)return{...f,winner:s.winner,winReason:s.reason};if(i.type===`homem_bomba`)return{...f,pendingSubStep:{type:`HOMEM_BOMBA_DECISION`,piecePos:n.to}};if(i.type===`pimentinha`)return{...f,pendingSubStep:{type:`PIMENTINHA_DECISION`,piecePos:n.to}};if(i.type===`peao`){let e=a===`white`?0:7;if(n.to.r===e)return{...f,pendingSubStep:{type:`PROMOTION`,piecePos:n.to}}}return A(f)}function O(e,t){let n=u(e.board);n[t.r][t.c]=null;for(let e=-1;e<=1;e++)for(let r=-1;r<=1;r++){if(e===0&&r===0)continue;let i=t.r+e,a=t.c+r;if(l(i,a)){let e=n[i][a];e&&e.type!==`baratinha`&&(n[i][a]=null)}}let r=`💥 BUM! O Homem Bomba detonou em ${x(t.c)}${8-t.r}, varrendo as casas vizinhas!`;return A({...e,board:n,pendingSubStep:null,history:[r,...e.history]})}function k(e,t){let n=u(e.board),r=e.turn===`white`?-1:1;n[t.r][t.c]=null;for(let e of[-1,0,1]){let i=t.r+r,a=t.c+e;if(l(i,a)){let e=n[i][a];e&&(n[i][a]={...e,frozenRounds:1})}}return A({...e,board:n,pendingSubStep:null,history:[`🌶️ Pimentinha explodiu em ardência, congelando as 3 casas à frente por 1 rodada!`,...e.history]})}function A(e){let t=e.turn===`white`?`black`:`white`,n=u(e.board);for(let e=0;e<8;e++)for(let r=0;r<8;r++){let i=n[e][r];i&&i.player===t&&(i.frozenRounds??0)>0&&(n[e][r]={...i,frozenRounds:Math.max(0,(i.frozenRounds??1)-1)})}let r=p(n,t),i=p(n,e.turn);if(i.length===0&&r.length===0)return{...e,board:n,winner:`draw`,winReason:`Todas as peças reais de ambos os jogadores foram destruídas!`};if(i.length===0)return{...e,board:n,winner:t,winReason:`O jogador ficou sem peças reais!`};if(r.length===0)return{...e,board:n,winner:e.turn,winReason:`Todas as peças reais inimigas foram eliminadas!`};let a=!1;return r.length===1&&(a=_(n,r[0].pos,e.turn)),b(n,t,e.lastUratalScreechTurn?.player===t?e.lastUratalScreechTurn.birdPos:null).length===0?a?{...e,board:n,turn:t,winner:e.turn,inCheck:!0,winReason:`Xeque-Mate! As ${e.turn===`white`?`Brancas`:`Pretas`} venceram a partida!`}:{...e,board:n,turn:t,winner:`draw`,inCheck:!1,winReason:`Empate por Afogamento! O jogador da vez não possui jogadas legais.`}:{...e,board:n,turn:t,halfMoves:e.halfMoves+1,fullMoves:t===`white`?e.fullMoves+1:e.fullMoves,inCheck:a,selectedPos:null,validActions:[],pendingSubStep:null,pendingReaction:null}}var j=class{element;state;stateHistory=[];whiteArmy;blackArmy;orientation=`pc_fixed`;inspector;onRematchCallback=()=>{};onNewSetupCallback=()=>{};constructor(e){this.inspector=e,this.element=document.createElement(`div`),this.element.className=`match-screen-container`,this.whiteArmy=[],this.blackArmy=[],this.state=S(this.whiteArmy,this.blackArmy)}getElement(){return this.element}startMatch(e,t,n,r){this.whiteArmy=e,this.blackArmy=t,this.onRematchCallback=n,this.onNewSetupCallback=r,this.state=S(e,t),this.stateHistory=[],this.render()}dispatch(e){(e.type===`EXECUTE_ACTION`||e.type===`RESPOND_GUARD`)&&this.stateHistory.push(JSON.parse(JSON.stringify(this.state))),this.state=C(this.state,e),this.render()}undo(){this.stateHistory.length>0&&(this.state=this.stateHistory.pop(),this.render())}render(){let e=this.state.turn===`white`,t=this.state.lastUratalScreechTurn?.player===this.state.turn,n=``;this.orientation===`turn_rotate`&&!e?n=`rotate-180`:this.orientation===`table_face_to_face`&&(n=`table-mode`),this.element.innerHTML=`
      <header class="match-header">
        <div class="turn-indicator player-${this.state.turn}">
          <span class="player-icon">${e?`🐱`:`🐾`}</span>
          <div class="turn-text">
            <h3>Vez do ${e?`Jogador 1 (Brancas / Gatito)`:`Jogador 2 (Pretas / Gatita)`}</h3>
            <span>Rodada ${this.state.fullMoves}</span>
          </div>
        </div>

        <div class="match-controls">
          <div class="orientation-select-wrap">
            <label for="orientation-select">Orientação:</label>
            <select id="orientation-select" class="select-control">
              <option value="pc_fixed" ${this.orientation===`pc_fixed`?`selected`:``}>💻 PC (Fixo)</option>
              <option value="turn_rotate" ${this.orientation===`turn_rotate`?`selected`:``}>🔄 Girar por Turno</option>
              <option value="table_face_to_face" ${this.orientation===`table_face_to_face`?`selected`:``}>🪑 Mesa (Frente a Frente)</option>
            </select>
          </div>
          <button class="btn btn-secondary" id="btn-undo" ${this.stateHistory.length>0?``:`disabled`}>
            ↩ Desfazer
          </button>
          <button class="btn btn-secondary" id="btn-rematch">
            🔄 Revanche
          </button>
          <button class="btn btn-secondary" id="btn-new-setup">
            ⚙️ Nova Montagem
          </button>
        </div>
      </header>

      ${this.state.inCheck?`<div class="check-banner">⚠️ ATENÇÃO: XEQUE! Sua peça Real está sob ataque!</div>`:``}

      ${t?`<div class="screech-banner">🦅 GRITO DO URATAL ATIVO: Movimentos permitidos apenas para casas que maximizam a distância ao pássaro!</div>`:``}

      <main class="match-main-layout">
        <!-- Tabuleiro -->
        <div class="board-frame">
          <div class="board-grid match-grid ${n}" id="match-board-grid"></div>
        </div>

        <!-- Painel Lateral: Histórico e Ações -->
        <aside class="match-sidebar">
          <div class="sidebar-section">
            <h4>Registro de Batalha</h4>
            <div class="history-log" id="history-log">
              ${this.state.history.map(e=>`<div class="history-item">${e}</div>`).join(``)}
            </div>
          </div>
          <div class="sidebar-section">
            <p class="match-hint">💡 <em>Dica:</em> Clique com o botão direito ou clique no ícone (ℹ️) para inspecionar qualquer peça e rever seus poderes especiais.</p>
          </div>
        </aside>
      </main>

      <!-- Sub-step e Reaction Overlays -->
      <div id="substep-container"></div>
    `,this.renderBoard(),this.renderSubSteps(),this.attachEventListeners()}renderBoard(){let e=this.element.querySelector(`#match-board-grid`);e.innerHTML=``;for(let n=0;n<8;n++)for(let r=0;r<8;r++){let i=(n+r)%2==1,a=document.createElement(`div`);a.className=`board-cell ${i?`dark`:`light`}`,a.dataset.r=String(n),a.dataset.c=String(r),this.state.selectedPos&&d(this.state.selectedPos,{r:n,c:r})&&a.classList.add(`selected`);let o=this.state.validActions.filter(e=>!!(d(e.to,{r:n,c:r})||e.target&&d(e.target,{r:n,c:r})));if(o.length>0){let e=o[0],t=document.createElement(`div`);t.className=`action-marker marker-${e.badgeColor}`,t.title=e.description,a.appendChild(t),a.addEventListener(`click`,t=>{t.stopPropagation(),e.type===`MAGO_SWAP`?this.startMagoSwap({r:n,c:r}):this.dispatch({type:`EXECUTE_ACTION`,action:e})})}let s=this.state.board[n][r];if(s){let e=document.createElement(`div`);if(e.className=`board-piece ${s.player===`black`&&this.orientation===`table_face_to_face`?`upside-down`:``} ${s.frozenRounds?`frozen-piece`:``}`,e.innerHTML=t(s.type,s.player,56),s.frozenRounds){let t=document.createElement(`span`);t.className=`freeze-badge`,t.textContent=`❄️`,e.appendChild(t)}e.addEventListener(`contextmenu`,e=>{e.preventDefault(),this.inspector.show(s.type,s.player)}),a.appendChild(e),o.length===0&&a.addEventListener(`click`,()=>{s.player===this.state.turn?this.state.selectedPos&&d(this.state.selectedPos,{r:n,c:r})?this.dispatch({type:`DESELECT`}):this.dispatch({type:`SELECT_PIECE`,pos:{r:n,c:r}}):this.inspector.show(s.type,s.player)})}else o.length===0&&a.addEventListener(`click`,()=>{this.state.selectedPos&&this.dispatch({type:`DESELECT`})});e.appendChild(a)}}startMagoSwap(t){let n=[];for(let e=-1;e<=1;e++)for(let r=-1;r<=1;r++){if(e===0&&r===0)continue;let i=t.r+e,a=t.c+r;if(l(i,a)){let e=this.state.board[i][a];e&&e.type===`baratinha`||n.push({r:i,c:a})}}let r=this.element.querySelector(`#substep-container`);r.innerHTML=`
      <div class="substep-modal-overlay">
        <div class="substep-modal-card">
          <h3>🪄 Habilidade do Mago: Transmutação Espacial</h3>
          <p>Selecione a <strong>1ª casa vizinha</strong> para permutar:</p>
          <div class="mago-targets-grid" id="mago-grid-1">
            ${n.map(t=>`
              <button class="btn btn-secondary mago-sq-btn" data-r="${t.r}" data-c="${t.c}">
                ${x(t.c)}${8-t.r} ${this.state.board[t.r][t.c]?`(${e[this.state.board[t.r][t.c].type].name})`:`(Vazio)`}
              </button>
            `).join(``)}
          </div>
          <button class="btn btn-secondary" id="btn-cancel-mago">Cancelar</button>
        </div>
      </div>
    `,r.querySelector(`#btn-cancel-mago`)?.addEventListener(`click`,()=>{r.innerHTML=``}),r.querySelectorAll(`.mago-sq-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.dataset.r,10),r=parseInt(e.dataset.c,10);this.selectMagoFirst({r:t,c:r},n)})})}selectMagoFirst(t,n){let r=n.filter(e=>!d(e,t)),i=this.element.querySelector(`#substep-container`);i.innerHTML=`
      <div class="substep-modal-overlay">
        <div class="substep-modal-card">
          <h3>🪄 Mago: 1ª Casa Escolhida (${x(t.c)}${8-t.r})</h3>
          <p>Agora selecione a <strong>2ª casa vizinha</strong> para trocar de lugar:</p>
          <div class="mago-targets-grid" id="mago-grid-2">
            ${r.map(t=>`
              <button class="btn btn-secondary mago-sq-btn" data-r="${t.r}" data-c="${t.c}">
                ${x(t.c)}${8-t.r} ${this.state.board[t.r][t.c]?`(${e[this.state.board[t.r][t.c].type].name})`:`(Vazio)`}
              </button>
            `).join(``)}
          </div>
          <button class="btn btn-secondary" id="btn-cancel-mago">Cancelar</button>
        </div>
      </div>
    `,i.querySelector(`#btn-cancel-mago`)?.addEventListener(`click`,()=>{i.innerHTML=``}),i.querySelectorAll(`.mago-sq-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let n=parseInt(e.dataset.r,10),r=parseInt(e.dataset.c,10);this.dispatch({type:`SELECT_MAGO_FIRST_TARGET`,firstPos:t}),this.dispatch({type:`SELECT_MAGO_SECOND_TARGET`,secondPos:{r:n,c:r}}),i.innerHTML=``})})}renderSubSteps(){let n=this.element.querySelector(`#substep-container`);if(n.innerHTML=``,this.state.pendingReaction){let t=this.state.pendingReaction;n.innerHTML=`
        <div class="substep-modal-overlay">
          <div class="substep-modal-card">
            <div class="modal-icon">🛡️</div>
            <h3>Reação Defensiva do Guarda!</h3>
            <p>O <strong>${e[t.targetPiece.type].name}</strong> aliado em <strong>${x(t.targetPos.c)}${8-t.targetPos.r}</strong> está prestes a ser capturado!</p>
            <p>O <strong>Guarda</strong> adjacente deseja trocar de lugar e se sacrificar no lugar dele?</p>
            <div class="modal-buttons">
              <button class="btn btn-primary btn-large" id="btn-guard-yes">Sim, Sacrificar o Guarda! 🛡️</button>
              <button class="btn btn-secondary" id="btn-guard-no">Não, Deixar Capturar ❌</button>
            </div>
          </div>
        </div>
      `,n.querySelector(`#btn-guard-yes`)?.addEventListener(`click`,()=>{this.dispatch({type:`RESPOND_GUARD`,sacrifice:!0})}),n.querySelector(`#btn-guard-no`)?.addEventListener(`click`,()=>{this.dispatch({type:`RESPOND_GUARD`,sacrifice:!1})})}else if(this.state.pendingSubStep?.type===`HOMEM_BOMBA_DECISION`)n.innerHTML=`
        <div class="substep-modal-overlay">
          <div class="substep-modal-card">
            <div class="modal-icon">💥</div>
            <h3>Detonação do Homem Bomba</h3>
            <p>O Homem Bomba concluiu o seu movimento. Deseja detonar agora e explodir todas as 8 casas adjacentes?</p>
            <div class="modal-buttons">
              <button class="btn btn-danger btn-large" id="btn-bomba-explode">💥 Explodir Tudo Agora!</button>
              <button class="btn btn-secondary" id="btn-bomba-skip">Apenas Parar Aqui ✓</button>
            </div>
          </div>
        </div>
      `,n.querySelector(`#btn-bomba-explode`)?.addEventListener(`click`,()=>{this.dispatch({type:`EXPLODE_BOMBA`})}),n.querySelector(`#btn-bomba-skip`)?.addEventListener(`click`,()=>{this.dispatch({type:`SKIP_BOMBA`})});else if(this.state.pendingSubStep?.type===`PIMENTINHA_DECISION`)n.innerHTML=`
        <div class="substep-modal-overlay">
          <div class="substep-modal-card">
            <div class="modal-icon">🌶️</div>
            <h3>Ardência da Pimentinha</h3>
            <p>Deseja detonar a Pimentinha, congelando todas as peças nas 3 casas à sua frente por 1 rodada inteira?</p>
            <div class="modal-buttons">
              <button class="btn btn-danger btn-large" id="btn-pimenta-explode">🌶️ Liberar Ardência Congelante!</button>
              <button class="btn btn-secondary" id="btn-pimenta-skip">Apenas Parar Aqui ✓</button>
            </div>
          </div>
        </div>
      `,n.querySelector(`#btn-pimenta-explode`)?.addEventListener(`click`,()=>{this.dispatch({type:`EXPLODE_PIMENTINHA`})}),n.querySelector(`#btn-pimenta-skip`)?.addEventListener(`click`,()=>{this.dispatch({type:`SKIP_PIMENTINHA`})});else if(this.state.pendingSubStep?.type===`PROMOTION`)n.innerHTML=`
        <div class="substep-modal-overlay">
          <div class="substep-modal-card">
            <div class="modal-icon">👑</div>
            <h3>Promoção de Peão Clássico</h3>
            <p>Seu peão bravamente alcançou a última fileira! Escolha sua nova forma:</p>
            <div class="promotion-choices">
              <button class="btn btn-secondary promo-btn" data-type="rainha">
                ${t(`rainha`,this.state.turn,48)}
                <span>Rainha</span>
              </button>
              <button class="btn btn-secondary promo-btn" data-type="torre">
                ${t(`torre`,this.state.turn,48)}
                <span>Torre</span>
              </button>
              <button class="btn btn-secondary promo-btn" data-type="bispo">
                ${t(`bispo`,this.state.turn,48)}
                <span>Bispo</span>
              </button>
              <button class="btn btn-secondary promo-btn" data-type="cavalo">
                ${t(`cavalo`,this.state.turn,48)}
                <span>Cavalo</span>
              </button>
            </div>
          </div>
        </div>
      `,n.querySelectorAll(`.promo-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.type;this.dispatch({type:`PROMOTE_PAWN`,newType:t})})});else if(this.state.winner){let e=this.state.winner===`draw`,t=this.state.winner===`white`?`Jogador 1 (Brancas / Gatito)`:`Jogador 2 (Pretas / Gatita)`;n.innerHTML=`
        <div class="substep-modal-overlay">
          <div class="substep-modal-card game-over-card">
            <div class="modal-icon">${e?`🤝`:`🏆`}</div>
            <h2>${e?`Fim de Jogo: Empate!`:`Vitória de ${t}!`}</h2>
            <p class="game-over-reason">${this.state.winReason||`Partida finalizada.`}</p>
            <div class="modal-buttons">
              <button class="btn btn-primary btn-large" id="btn-modal-rematch">🔄 Revanche (Mesmos Exércitos)</button>
              <button class="btn btn-secondary" id="btn-modal-new-setup">⚙️ Nova Montagem</button>
            </div>
          </div>
        </div>
      `,n.querySelector(`#btn-modal-rematch`)?.addEventListener(`click`,()=>{this.onRematchCallback()}),n.querySelector(`#btn-modal-new-setup`)?.addEventListener(`click`,()=>{this.onNewSetupCallback()})}}attachEventListeners(){let e=this.element.querySelector(`#orientation-select`);e?.addEventListener(`change`,()=>{this.orientation=e.value,this.render()}),this.element.querySelector(`#btn-undo`)?.addEventListener(`click`,()=>{this.undo()}),this.element.querySelector(`#btn-rematch`)?.addEventListener(`click`,()=>{this.onRematchCallback()}),this.element.querySelector(`#btn-new-setup`)?.addEventListener(`click`,()=>{this.onNewSetupCallback()})}},M=class{appContainer;inspector;setupScreen;curtainScreen;matchScreen;whiteArmy=null;blackArmy=null;constructor(){this.appContainer=document.getElementById(`app`),this.inspector=new n,this.setupScreen=new s(this.inspector),this.curtainScreen=new c,this.matchScreen=new j(this.inspector),this.appContainer.appendChild(this.setupScreen.getElement()),this.appContainer.appendChild(this.curtainScreen.getElement()),this.appContainer.appendChild(this.matchScreen.getElement()),this.startPhase1()}startPhase1(){this.matchScreen.getElement().classList.add(`hidden`),this.curtainScreen.hide(),this.setupScreen.getElement().classList.remove(`hidden`),this.setupScreen.startSetup(`white`,e=>{this.whiteArmy=e,this.startCurtainPhase()})}startCurtainPhase(){this.setupScreen.getElement().classList.add(`hidden`),this.curtainScreen.show(()=>{this.startPhase2()})}startPhase2(){this.setupScreen.getElement().classList.remove(`hidden`),this.setupScreen.startSetup(`black`,e=>{this.blackArmy=e,this.startMatchPhase()})}startMatchPhase(){this.whiteArmy&&this.blackArmy&&(this.setupScreen.getElement().classList.add(`hidden`),this.curtainScreen.hide(),this.matchScreen.getElement().classList.remove(`hidden`),this.matchScreen.startMatch(this.whiteArmy,this.blackArmy,()=>this.startMatchPhase(),()=>this.startPhase1()))}};window.addEventListener(`DOMContentLoaded`,()=>{new M});