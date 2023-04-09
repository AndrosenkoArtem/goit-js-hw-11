import './servise-api';
import { PixabeyApi } from './servise-api';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

import LoadMoreBtn from './btnMore';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('#search-form');
const galeryRef = document.querySelector('.gallery');
const btnMore = document.querySelector('.load-more');

formRef.addEventListener('submit', onSubmitForm);
btnMore.addEventListener('click', onRenderMoreCards);

const pixabeyApi = new PixabeyApi();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

function onSubmitForm(e) {
  e.preventDefault();
  let inputValue = e.target.elements.searchQuery.value;
  if (inputValue.trim() === '') {
    return;
  }
  loadMoreBtn.show();
  loadMoreBtn.disable();
  pixabeyApi.resetCurrentHits();
  pixabeyApi.resetPage();
  const images = pixabeyResponse(inputValue);
  galeryRef.innerHTML = '';
  createCard(images);
}

async function pixabeyResponse(inputValue) {
  try {
    loadMoreBtn.disable();
    const response = await pixabeyApi.fetchUrl(inputValue);
    pixabeyApi.setCurrentHits = response.hits.length;
    console.log(pixabeyApi.getPage);
    console.log(response.totalHits);
    console.log(pixabeyApi.getCurrentHits);

    if (
      pixabeyApi.getCurrentHits >= response.totalHits &&
      response.totalHits !== 0
    ) {
      loadMoreBtn.hide();
      pixabeyApi.resetPage();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    const images = await response.hits;
    if (response.hits.length === 0) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return images;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, an error occurred while fetching images. Please try again later.'
    );
    console.error(error);
    return [];
  }
}

async function renderCards(response) {
  const images = await response;
  return images
    .map(img => {
      return `
        <div class="photo-card">
            <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" href="${img.largeImageURL}" />
            <div class="info">
                <p class="info-item">
                <b>Likes: <span class="span">${img.likes}</span></b>
                </p>
                <p class="info-item">
                <b>Views: <span class="span">${img.views}</span></b>
                </p>
                <p class="info-item">
                <b>Comments: <span class="span">${img.comments}</span></b>
                </p>
                <p class="info-item">
                <b>Downloads: <span class="span">${img.downloads}</span></b>
                </p>
            </div>
        </div>
      `;
    })
    .join('');
}

async function createCard(response) {
  const imgCard = await renderCards(response);
  galeryRef.insertAdjacentHTML('beforeend', imgCard);
  const lightbox = new SimpleLightbox('.gallery img', {
    /* options */
  });
  lightbox.refresh();
  loadMoreBtn.enable();
  if (pixabeyApi.getPage !== 1) {
    scrollPage();
    return;
  } else if (pixabeyApi.getTotalHits.totalHits !== 0) {
    Notiflix.Notify.info(
      `Hooray! We found ${pixabeyApi.getTotalHits.totalHits} images.`
    );
  }
}

async function onRenderMoreCards() {
  if (formRef.elements.searchQuery.value.trim() === '') {
    return;
  }
  loadMoreBtn.disable();
  pixabeyApi.setPage = 1;
  const images = await pixabeyResponse(formRef.elements.searchQuery.value);
  createCard(images);
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
