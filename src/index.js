import { fetchImages } from './fetch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ref = {
  formEl: document.querySelector('.search-form'),
  galerryEl: document.querySelector('.gallery'),
  loadButEl: document.querySelector('.load-more'),
  scrollUpEl: document.querySelector('.scroll-up'),
};

let gallery = new SimpleLightbox('.gallery a');

ref.formEl.addEventListener('submit', searchImages);
ref.loadButEl.addEventListener('click', loadMoreImages);
ref.scrollUpEl.addEventListener('click', () =>
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
);

ref.loadButEl.style.display = 'none';
let searchImage = '';
let page = 1;

async function searchImages(event) {
  event.preventDefault();
  page = 1;
  Notiflix.Loading.dots('We are searching your images!');
  await fetchImages(ref.formEl.elements.searchQuery.value.trim(), page)
    .then(data => {
      searchImage = ref.formEl.elements.searchQuery.value.trim();
      ref.galerryEl.innerHTML = '';
      ref.loadButEl.style.display = 'none';

      Notiflix.Loading.remove();

      if (
        data.totalHits === 0 ||
        ref.formEl.elements.searchQuery.value === ''
      ) {
        Notiflix.Notify.failure(
          "Sorry, we didn't find anything! Try changing your search!"
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      const imageCards = data.hits.map(item => createCard(item)).join('');
      ref.galerryEl.innerHTML = imageCards;

      gallery.refresh();
      ref.formEl.elements.searchQuery.value = '';
      if (data.totalHits <= 40) {
        ref.loadButEl.style.display = 'none';
        lastElement();
        return;
      }
      ref.loadButEl.style.display = 'block';
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure('Something went wrong, please reload the page');
    });
}

function createCard(imageData) {
  let { webformatURL, largeImageURL, tags, likes, views, comments, downloads } =
    imageData;

  return `<a href="${largeImageURL}">
  <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${downloads}
          </p>
        </div>
      </div>
</a>`;
}

async function loadMoreImages() {
  Notiflix.Loading.dots('We are searching for more images!');
  page += 1;
  await fetchImages(searchImage, page)
    .then(data => {
      const imageCards = data.hits.map(item => createCard(item)).join('');
      ref.galerryEl.insertAdjacentHTML('beforeend', imageCards);
      Notiflix.Loading.remove();
      gallery.refresh();
      scroll();
      pageNumbers(data);
    })
    .catch(error => {
      console.error(error);
    });
}

function pageNumbers(data) {
  let pagesCount = Math.ceil(data.totalHits / 40);
  console.log(pagesCount);
  if (page !== pagesCount) {
    return;
  }

  ref.loadButEl.style.display = 'none';
  lastElement();
}

function scroll() {
  const { height: cardHeight } =
    ref.galerryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function lastElement() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(onIntersect, options);
  const lastCard = ref.galerryEl.lastElementChild;
  observer.observe(lastCard);
}

function onIntersect(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
