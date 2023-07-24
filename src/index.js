import { fetchImages } from './fetch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ref = {
  formEl: document.querySelector('.search-form'),
  galerryEl: document.querySelector('.gallery'),
  loadButEl: document.querySelector('.load-more'),
};

let gallery = new SimpleLightbox('.gallery a');

ref.formEl.addEventListener('submit', searchImages);
ref.loadButEl.addEventListener('click', loadMoreImages);

ref.loadButEl.style.display = 'none';
let page = 1;
async function searchImages(event) {
  event.preventDefault();
  page = 1;
  await fetchImages(ref.formEl.elements.searchQuery.value.trim(), page)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          "Sorry, we didn't find anything! Try changing your search!"
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      const imageCards = data.hits.map(item => createCard(item)).join('');
      ref.galerryEl.innerHTML = imageCards;
      gallery.refresh();
      if (data.totalHits <= 40) {
        ref.loadButEl.style.display = 'none';
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
  page += 1;
  await fetchImages(ref.formEl.elements.searchQuery.value, page)
    .then(data => {
      const imageCards = data.hits.map(item => createCard(item)).join('');
      ref.galerryEl.insertAdjacentHTML('beforeend', imageCards);
      gallery.refresh();
      pageNumbers(data);
    })
    .catch(error => {
      console.error(error);
    });
}

function pageNumbers(data) {
  let pagesCount = Math.round(data.totalHits / 40);
  if (page !== pagesCount) {
    return;
  }
  ref.loadButEl.style.display = 'none';

  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}
