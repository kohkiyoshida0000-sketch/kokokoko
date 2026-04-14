const menuButtons = document.querySelectorAll('.menu-btn');
const logoButton = document.querySelector('.logo');
const views = document.querySelectorAll('.view');
const welcome = document.getElementById('welcome-text');

const showView = (id) => {
  views.forEach((v) => v.classList.toggle('active', v.id === id));
  menuButtons.forEach((b) => b.classList.toggle('active', b.dataset.target === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

menuButtons.forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.target));
});

logoButton.addEventListener('click', (event) => {
  event.preventDefault();
  showView('home');
});

const phrase = 'ようこそ INKLINK へ';
welcome.textContent = '';
let index = 0;
const timer = setInterval(() => {
  welcome.textContent += phrase[index] ?? '';
  index += 1;
  if (index >= phrase.length) {
    clearInterval(timer);
  }
}, 80);
