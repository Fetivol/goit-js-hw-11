import { fetchImages } from './fetch';

const ref = {
  formEl: document.querySelector('.search-form'),
  galerryEl: document.querySelector('.gallery'),
  loadButEl: document.querySelector('.load-more'),
};

ref.formEl.addEventListener('submit', searchImages);

async function searchImages(event) {
  event.preventDefault();
  //   let searchImage = ref.formEl.elements.searchQuery.value;
  await fetchImages(ref.formEl.elements.searchQuery.value)
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
