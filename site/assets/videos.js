(() => {
  const videos = window.STORY_VIDEOS;
  const player = document.querySelector('#video-player');
  const cards = [...document.querySelectorAll('.video-card')];
  const search = document.querySelector('#video-search');
  const category = document.querySelector('#video-category');
  document.querySelector('#video-download').hidden = location.protocol === 'file:';
  const duration = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  let current;

  function select(video, play) {
    if (current !== video.id) {
      player.pause();
      player.src = video.src;
      player.poster = video.poster;
      current = video.id;
      document.querySelector('#video-title').textContent = video.title;
      document.querySelector('#video-meta').textContent = `${video.category} · ${duration(video.duration)} · ${(video.bytes / 1048576).toFixed(1)} MB`;
      const download = document.querySelector('#video-download');
      download.href = video.src;
      download.download = video.title + '.mp4';
      document.querySelector('#video-status').textContent = '';
      cards.forEach(card => card.setAttribute('aria-pressed', String(card.dataset.video === video.id)));
    }
    if (play) {
      player.play().catch(error => {
        if (current === video.id && error.name !== 'AbortError') document.querySelector('#video-status').textContent = '点击播放器中的播放按钮即可开始。';
      });
      document.querySelector('.video-stage').scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  cards.forEach(card => card.addEventListener('click', () => select(videos.find(video => video.id === card.dataset.video), true)));
  function filter() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    cards.forEach(card => {
      const video = videos.find(entry => entry.id === card.dataset.video);
      card.hidden = (category.value && video.category !== category.value) || !video.title.toLocaleLowerCase().includes(query);
      if (!card.hidden) count++;
    });
    document.querySelector('#video-count').textContent = `${count} 段视频`;
    document.querySelector('#video-empty').hidden = count !== 0;
  }
  search.addEventListener('input', filter);
  category.addEventListener('change', filter);
  player.addEventListener('error', () => { document.querySelector('#video-status').textContent = '视频暂时无法播放，可以下载后查看。'; });
  select(videos[0], false);
  filter();
})();
