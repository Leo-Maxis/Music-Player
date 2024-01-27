const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'LEO_MUSIC'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const preBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Nhạc Xuân Remix",
          singer: "Cukcak Remix",
          path: "./asset/music/song1.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/playlist/2023/12/25/d/f/6/7/1703495481402_500.jpg"
        },
        {
          name: "Con bướm xuân",
          singer: "Cukcak Remix",
          path: "./asset/music/song2.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/playlist/2023/12/25/d/f/6/7/1703495481402_500.jpg"
        },
        {
          name: "Em xinh",
          singer: "MONO",
          path: "./asset/music/song3.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/08/10/4/8/b/1/1660104031203.jpg"
        },
        {
          name: "Nụ cười xuân",
          singer: "Đại Mèo",
          path: "./asset/music/song4.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/12/29/e/e/f/b/1672307059193_500.jpg"
        },
        {
          name: "Waiting For You",
          singer: "MONO",
          path: "./asset/music/song5.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/06/08/0/0/9/1/1654684969581.jpg"
        },
        {
          name: "Như anh đã thấy em",
          singer: "PhucXD, Freak D",
          path: "./asset/music/song6.mp3",
          image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/b/f/0/1/bf0182328238f2a252496a63e51f1f74.jpg"
        },
        {
          name: "See Tình",
          singer: "Hoàng Thùy Linh",
          path: "./asset/music/song7.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/02/20/f/c/1/9/1645341331047.jpg"
        },
    ],
    setConfig : function(key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
      const htmls = this.songs.map((song, index) => {
        return `
          <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
      `
      })
      playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
      Object.defineProperty(this,'currentSong', {
        get: function() {
          return this.songs[this.currentIndex]
        }
      })
    },
    handleEvents: function() {
      const _this = this
      const cdWidth = cd.offsetWidth

      //Xử lý CD quay /dừng
      const cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
      ], {
          duration: 10000, // 10 seconds
          iterations: Infinity
      })
      cdThumbAnimate.pause()


      //xử lý phóng to / thu nhỏ cd
      document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const newCdWidth = cdWidth - scrollTop

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        cd.style.opacity = newCdWidth / cdWidth
      }

      //xử lý khi click play
      playBtn.onclick = function() {
        if (_this.isPlaying) {
          audio.pause()
        }
        else {
          audio.play()
        }
      }
      //khi song được play
      audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
      }
      //khi song bị pause
      audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }

      //Khi tiến độ bài hát thay đổi 
      audio.ontimeupdate = function() {
        if (audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPercent
        }
      }

      // Xử lý khi tua song
      progress.onchange = function(e) {
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
      }

      //khi next song
      nextBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        }
        else {
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }
      //khi prev song
      preBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        }
        else {
          _this.prevSong()
        }
        audio.play()
        _this.render()
      }
      // random song
      randomBtn.onclick = function(e) {
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom)
        _this.setConfig('isRandom', _this.isRandom)
        _this.playRandomSong()
      }
      //xử lý lặp lại song
      repeatBtn.onclick = function(e) {
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat', _this.isRepeat)
        repeatBtn.classList.toggle('active',_this.isRepeat)
      }
      // xử lý next song khi end song
      audio.onended = function() {
        if (_this.isRepeat) {
          audio.play()
        }
        else {
          nextBtn.click()
        } 
      }

      //Lắng nghe hành vi click vào playlist
      playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active')
        //Xử lý khi click khi vào song
        if (songNode || e.target.closest('.option')) {
          //Xử lý khi click vào song
          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            _this.render()
            audio.play()
          }
          //Xử lý khi click vào option
          if(e.target.closest('.option')) {

          }
        }
      }
    },
    scrollToActiveSong: function() {
      setTimeout(() => {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block:'nearest',
        })
      },300)
    },
    loadCurrentSong: function() {
      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
    },
    loadConfig: function() {
      this.isRandom = this.config.isRandom
      this.isRepeat = this.config.isRepeat
    },
    nextSong : function() {
      this.currentIndex++
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },
    prevSong : function() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
    },
    playRandomSong: function() {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      } while (newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()      
    },

    start: function() {
      //gán cấu hình config và cấu hình gốc
      this.loadConfig()
      //Định nghĩa các thuộc tính cho Objec 
      this.defineProperties()
      //Lắng nghe xử lý các sự kiện (DOM event)
      this.handleEvents()
      //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
      this.loadCurrentSong()
      //Render playlist
      this.render()
      //hiển thị trạng thái ban đầu của button repeat và random
      randomBtn.classList.toggle('active', this.isRandom)
      repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start()