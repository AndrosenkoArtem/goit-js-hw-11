class PixabeyApi {
  constructor() {
    this.page = 1;
    this.currentHits = 0;
    this.totalHits = 0;
  }
  async fetchUrl(name) {
    const searchParams = new URLSearchParams({
      key: '35160374-d23f2fd4bb6bf16bf356db091',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: 40,
      page: this.page,
    });
    const response = await fetch(`https://pixabay.com/api/?${searchParams}`);
    const images = response.json();
    this.totalHits = await images;

    return images;
  }
  resetPage() {
    this.page = 1;
  }
  resetCurrentHits() {
    this.currentHits = 0;
  }
  getPage() {
    return this.page;
  }
  setPage(newPage) {
    this.page += newPage;
  }
  getCurrentHits() {
    return this.currentHits;
  }
  setCurrentHits(newCurrent) {
    this.currentHits += newCurrent;
  }
  getTotalHits() {
    return this.totalHits;
  }
  setTotalHits(newtotal) {
    this.totalHits = newtotal;
  }
}
export { PixabeyApi };
