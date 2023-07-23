import { fetchImages } from './fetch';

const ref = {
  formEl: document.querySelector('.search-form'),
  galerryEl: document.querySelector('.gallery'),
  loadButEl: document.querySelector('.load-more'),
};

ref.formEl.addEventListener('submit', searchImages);
ref.loadButEl.addEventListener('click', loadMoreImages);

let page = 1;

async function searchImages(event) {
  event.preventDefault();
  page = 1;
  await fetchImages(ref.formEl.elements.searchQuery.value, page)
    .then(data => {
      console.log(data);
      console.log(data.hits);
      const imageCards = data.hits.map(item => createCard(item)).join('');
      // ref.galerryEl.insertAdjacentHTML('beforeend', imageCards);
      ref.galerryEl.innerHTML = imageCards;
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}

function createCard(imageData) {
  let {
    webformatURL,
    //   largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = imageData;

  return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>`;
}

async function loadMoreImages() {
  page += 1;
  await fetchImages(ref.formEl.elements.searchQuery.value, page)
    .then(data => {
      console.log(data);
      console.log(data.hits);
      const imageCards = data.hits.map(item => createCard(item)).join('');
      ref.galerryEl.insertAdjacentHTML('beforeend', imageCards);
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}
