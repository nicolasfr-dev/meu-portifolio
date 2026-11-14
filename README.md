# Dark Hour — Portfólio de Nicolas Freire

Portfólio pessoal com interface inspirada na UI de Persona 3 Reload: menu de comandos diagonal, calendário, caixas de diálogo e muito azul. Feito com [Astro](https://astro.build), sem frameworks de UI e sem dependências extras.

## Comandos

| Comando       | Ação                                      |
| :------------ | :---------------------------------------- |
| `bun install` | Instala dependências                      |
| `bun dev`     | Servidor local em `localhost:4321`        |
| `bun build`   | Gera o site estático em `./docs/`         |
| `bun preview` | Pré-visualiza o build                     |

Sem bun? `npx astro dev` funciona igual.

## Personalizando

Quase tudo o que é "seu" está em **`src/data/profile.ts`**: nome, foto, bio, atributos, equipamento (stack), requests (projetos de autoria própria), calendário (experiência e os projetos de cada cargo, que abrem num modal), educação (formação e certificados) e redes sociais. Os campos bilíngues usam `{ pt, en }`.

| O quê                         | Onde                                   |
| :---------------------------- | :------------------------------------- |
| Conteúdo pessoal e foto       | `src/data/profile.ts`                  |
| Conquistas                    | `src/data/achievements.ts`             |
| Textos da interface (PT/EN)   | `src/i18n/ui.ts`                       |
| Cores, tipografia, tokens     | `src/styles/global.css`                |
| Fontes (Barlow / Condensed)   | `astro.config.mjs` → `fonts`           |
| Ícones do Equipamento         | campo `icon` em `profile.ts`: slug do [Simple Icons](https://simpleicons.org) (ex.: `nodedotjs`) |
| Domínio (SEO / hreflang)      | `astro.config.mjs` → `site`            |

## Mecânicas

- **Menu de comandos**: no hero e no menu (Esc). ↑↓ navegam, Enter confirma, e a caixa de ajuda acompanha o item selecionado.
- **Calendário na HUD**: data, dia da semana, período do dia e fase da lua reais. Meia-noite é a Hora Sombria.
- **Progresso**: a barra enche com a rolagem e cada seção nova dá *Level up*.
- **Conquistas**: 13 (algumas secretas), salvas no `localStorage`.
- **Easter eggs**: Konami code (teclado, swipes ou o gamepad do rodapé) ativa o tema carmesim; clique na lua; visitas de madrugada; speedrun…
- **Som**: efeitos gerados via Web Audio (desligados por padrão).

## Acessibilidade, responsividade e desempenho

- Layout fluido de 320px a 4K, celular deitado, safe areas (notch).
- Respeita `prefers-reduced-motion` e `prefers-contrast`.
- Diálogos nativos (`<dialog>`), skip link, alvos de toque ≥ 44px.
- Sem animações contínuas caras (sem canvas de fundo, blur ou blend); fontes servidas pelo próprio site.
- Funciona sem JavaScript (as mecânicas de game ficam desativadas).

## Licença

O código é **source-available**, não open source: está sob a [PolyForm Strict 1.0.0](LICENSE), que permite ler e estudar o código, mas não modificá-lo, redistribuí-lo nem publicar cópias do site. A foto, o currículo e os dados pessoais em `src/data/profile.ts` têm todos os direitos reservados.
