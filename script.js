$(document).ready(function () {

    loadChatDefault();

    // モード切り替えボタンのイベントリスナー
    $('#button_mode-description').on('click', function () {
        $('.mode-default').addClass('d-none');
        $('.mode-favorite').addClass('d-none');
        $('.mode-trash').addClass('d-none');
        $('.mode-description').removeClass('d-none');
        $('.description-1').removeClass('d-none');
        $('.menu-mode').removeClass('active');
    });
    $('#button_description1').on('click', function () {
        $('.description-1').addClass('d-none');
        $('.description-2').removeClass('d-none');
    });
    $('#button_description2').on('click', function () {
        $('.description-2').addClass('d-none');
        $('.description-3').removeClass('d-none');
    });
    $('#button_description3').on('click', function () {
        $('.description-3').addClass('d-none');
        $('.description-4').removeClass('d-none');
    });
    $('#button_description4').on('click', function () {
        $('.description-4').addClass('d-none');
        $('.mode-description').addClass('d-none');
        $('.mode-default').removeClass('d-none');
        $('.menu-mode').removeClass('active');
        $('#button_mode-default').addClass('active');
        loadChatDefault();
    });
    $('.skip').on('click', function () {
        $('.description-1').addClass('d-none');
        $('.description-2').addClass('d-none');
        $('.description-3').addClass('d-none');
        $('.description-4').addClass('d-none');
        $('.mode-description').addClass('d-none');
        $('.mode-default').removeClass('d-none');
        $('.menu-mode').removeClass('active');
        $('#button_mode-default').addClass('active');
        loadChatDefault();
    });

    $('#button_mode-default').on('click', function () {
        $('.mode-default').removeClass('d-none');
        $('.mode-favorite').addClass('d-none');
        $('.mode-trash').addClass('d-none');
        $('.mode-description').addClass('d-none');
        $('.menu-mode').removeClass('active');
        $(this).addClass('active');
        loadChatDefault();
    });

    $('#button_mode-favorite').on('click', function () {
        $('.mode-favorite').removeClass('d-none');
        $('.mode-default').addClass('d-none');
        $('.mode-trash').addClass('d-none');
        $('.mode-description').addClass('d-none');
        $('.menu-mode').removeClass('active');
        $(this).addClass('active');
        loadChatFavorite();
    });

    $('#button_mode-trash').on('click', function () {
        $('.mode-trash').removeClass('d-none');
        $('.mode-default').addClass('d-none');
        $('.mode-favorite').addClass('d-none');
        $('.mode-description').addClass('d-none');
        $('.menu-mode').removeClass('active');
        $(this).addClass('active');
        loadChatTrash();
    });

    // 送信ボタンのイベントリスナー
    $('#button_submit').on('click', function () {
        const timestamp = new Date().getTime();
        const memoText = $('#memo').val();
        const data = { type: "normal", user: "me", value: nl2brEx(memoText)};
        localStorage.setItem(timestamp, JSON.stringify(data));
        $('#memo').val('');
        loadChatDefault();
    });

    // ショートカットのイベントリスナー
    $('#memo').on('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
            event.preventDefault();
            const timestamp = new Date().getTime();
            const memoText = $('#memo').val();
            const data = { type: "normal", user: "me", value: nl2brEx(memoText)};
            localStorage.setItem(timestamp, JSON.stringify(data));
            $('#memo').val('');
            loadChatDefault();
        }
    });

    $(window).on('keydown', function (event) {
        if ($('#memo').is(':hover')){
            return;
        }
        if (event.keyCode == 72) {
            event.preventDefault();
            $('.mode-default').removeClass('d-none');
            $('.mode-favorite').addClass('d-none');
            $('.mode-trash').addClass('d-none');
            $('.mode-description').addClass('d-none');
            $('.menu-mode').removeClass('active');
            $('#button_mode-default').addClass('active');
            loadChatDefault();
        }
    });
    $(window).on('keydown', function (event) {
        if ($('#memo').is(':hover')){
            return;
        }
        if (event.keyCode == 74) {
            event.preventDefault();
            $('.mode-favorite').removeClass('d-none');
            $('.mode-default').addClass('d-none');
            $('.mode-trash').addClass('d-none');
            $('.mode-description').addClass('d-none');
            $('.menu-mode').removeClass('active');
            $('#button_mode-favorite').addClass('active');
            loadChatFavorite();
        }
    });
    $(window).on('keydown', function (event) {
        if ($('#memo').is(':hover')){
            return;
        }
        if (event.keyCode == 75) {
            event.preventDefault();
            $('.mode-trash').removeClass('d-none');
            $('.mode-default').addClass('d-none');
            $('.mode-favorite').addClass('d-none');
            $('.mode-description').addClass('d-none');
            $('.menu-mode').removeClass('active');
            $('#button_mode-trash').addClass('active');
            loadChatTrash();
        }
    });

    // 質問モーダルのイベントリスナー
    $('#button_modal-question').on('click', function () {
        $('#modal-question').modal('show');
    });

    // 質問カードのイベントリスナー
    $('.question-card').on('click', function () {
        const timestamp = new Date().getTime();
        const cardText = $(this).find('.card-text').text();
        const data = { type: "normal", user: "you", value: cardText};
        localStorage.setItem(timestamp, JSON.stringify(data));
        loadChatDefault();
        $('#modal-question').modal('hide');
    });

    // チャット履歴のロード関数
    function loadChatDefault() {
        $('.area-chat').empty();
        const keys = Object.keys(localStorage);
        keys.sort((a, b) => parseInt(a) - parseInt(b));
        keys.slice(-100).forEach((key) => {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.type === "normal" || data.type === "favorite") {
            createChatCard(data, key);
          }
        });
    }
    function loadChatFavorite() {
        $('.area-chat').empty();
        const keys = Object.keys(localStorage);
        keys.sort((a, b) => parseInt(a) - parseInt(b));
        keys.forEach((key) => {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.type === "favorite") {
            createChatCard(data, key);
          }
        });
    }
    function loadChatTrash() {
        $('.area-chat').empty();
        const keys = Object.keys(localStorage);
        keys.sort((a, b) => parseInt(a) - parseInt(b));
        keys.forEach((key) => {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.type === "trash") {
            createChatCard(data, key);
          }
        });
    }

    function toRelativeDate(key) {
        const date = new Date(parseInt(key, 10));
        const seconds = (new Date - date) / 1000;
        const days = seconds / 3600 / 24;
        if (seconds < 1) return '今';
        if (seconds < 60) return Math.floor(seconds) + '秒前';
        if (seconds < 3600) return Math.floor(seconds / 60) + '分前';
        if (seconds < 3600 * 24) return Math.floor(seconds / 3600) + '時間前';
        if (days < 365.25 / 12) return Math.floor(days) + '日前';
        // 1か月を一律(365.25 / 12)日とみなして計算
        if (days < 365.25) return Math.floor(days / 365.25 * 12) + 'か月前';
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }

    function nl2brEx(v){
		if(v == null || v == '' || v=='0'){
			return v;
		}

		v = v.replace(/\r\n|\n\r|\r|\n/g,'<br>');
		return v;
	}

    // チャットカードの作成関数
    function createChatCard(data, key) {
        if (data.type === 'normal'){
            if (data.user === 'me'){
                $('.area-chat').append('<div class="card mb-2"><div class="card-header bg-white d-flex justify-content-between align-items-center"><div class="card-left d-flex align-items-center"><span class="user-name text-dark fw-bold me-2 fs-6">あなた：ヌシ</span><span class="time mx-2 text-muted small">' + toRelativeDate(key) + '</span></div><div class="card-right d-flex align-items-center"><span class="pointer material-symbols-outlined fs-6 text-muted me-2 favorite-no" data-key="' + key + '">favorite</span><span class="pointer material-symbols-outlined fs-6 text-muted delete" data-key="' + key + '">delete</span></div></div><div class="card-body"><p class="card-text text-dark">' + data.value + '</p></div></div>');
            }
            if (data.user === 'you'){
                $('.area-chat').append('<div class="card mb-2 card-you"><div class="card-header bg-success d-flex justify-content-between align-items-center"><div class="card-left d-flex align-items-center"><span class="user-name text-white fw-bold me-2 fs-6">相手：アリス</span><span class="time mx-2 text-light small">' + toRelativeDate(key) + '</span></div><div class="card-right d-flex align-items-center"><span class="pointer material-symbols-outlined fs-6 text-light me-2 favorite-no" data-key="' + key + '">favorite</span><span class="pointer material-symbols-outlined fs-6 text-light delete" data-key="' + key + '">delete</span></div></div><div class="card-body bg-success"><p class="card-text text-white">' + data.value + '</p></div></div>');
            }
        }
        if (data.type === 'favorite'){
            if (data.user === 'me'){
                $('.area-chat').append('<div class="card mb-2"><div class="card-header bg-white d-flex justify-content-between align-items-center"><div class="card-left d-flex align-items-center"><span class="user-name text-dark fw-bold me-2 fs-6">あなた：ヌシ</span><span class="time mx-2 text-muted small">' + toRelativeDate(key) + '</span></div><div class="card-right d-flex align-items-center"><span class="pointer material-symbols-outlined fs-6 text-danger me-2 fill favorite-yes" data-key="' + key + '">favorite</span><span class="not-allowed material-symbols-outlined fs-6 text-light cantdelete" data-key="' + key + '">delete</span></div></div><div class="card-body"><p class="card-text text-dark">' + data.value + '</p></div></div>');
            }
            if (data.user === 'you'){
                $('.area-chat').append('<div class="card mb-2 card-you"><div class="card-header bg-success d-flex justify-content-between align-items-center"><div class="card-left d-flex align-items-center"><span class="user-name text-white fw-bold me-2 fs-6">相手：アリス</span><span class="time mx-2 text-light small">' + toRelativeDate(key) + '</span></div><div class="card-right d-flex align-items-center"><span class="pointer material-symbols-outlined fs-6 text-danger me-2 fill favorite-yes" data-key="' + key + '">favorite</span><span class="not-allowed material-symbols-outlined fs-6 text-muted cantdelete" data-key="' + key + '">delete</span></div></div><div class="card-body bg-success"><p class="card-text text-white">' + data.value + '</p></div></div>');
            }
        }
        if (data.type === 'trash'){
            if (data.user === 'me'){
                $('.area-chat').append('<div class="card mb-2"><div class="card-header bg-white d-flex justify-content-between align-items-center"><div class="card-left d-flex align-items-center"><span class="user-name text-dark fw-bold me-2 fs-6">あなた：ヌシ</span><span class="time mx-2 text-muted small">' + toRelativeDate(key) + '</span></div><div class="card-right d-flex align-items-center"><span class="pointer material-symbols-outlined fs-6 text-muted me-2 undo" data-key="' + key + '">undo</span><span class="pointer material-symbols-outlined fs-6 text-muted deleteforever" data-key="' + key + '">close</span></div></div><div class="card-body"><p class="card-text text-dark">' + data.value + '</p></div></div>');
            }
            if (data.user === 'you'){
                $('.area-chat').append('<div class="card mb-2 card-you"><div class="card-header bg-success d-flex justify-content-between align-items-center"><div class="card-left d-flex align-items-center"><span class="user-name text-white fw-bold me-2 fs-6">相手：アリス</span><span class="time mx-2 text-light small">' + toRelativeDate(key) + '</span></div><div class="card-right d-flex align-items-center"><span class="pointer material-symbols-outlined fs-6 text-light me-2 undo" data-key="' + key + '">undo</span><span class="pointer material-symbols-outlined fs-6 text-light deleteforever" data-key="' + key + '">close</span></div></div><div class="card-body bg-success"><p class="card-text text-white">' + data.value + '</p></div></div>');
            }
        }
    }

  // お気に入りボタンのイベント設定
    $(document).on('click', '.favorite-no', function () {
        const key = $(this).data('key');
        const data = JSON.parse(localStorage.getItem(key));
        data.type = 'favorite';
        localStorage.setItem(key, JSON.stringify(data));
        if ($('#button_mode-default').hasClass('active')) {
            loadChatDefault();
        }
        if ($('#button_mode-favorite').hasClass('active')) {
            loadChatFavorite();
        }
    });
    $(document).on('click', '.favorite-yes', function () {
        const key = $(this).data('key');
        const data = JSON.parse(localStorage.getItem(key));
        data.type = 'normal';
        localStorage.setItem(key, JSON.stringify(data));
        if ($('#button_mode-default').hasClass('active')) {
            loadChatDefault();
        }
        if ($('#button_mode-favorite').hasClass('active')) {
            loadChatFavorite();
        }
    });
  // ゴミ箱ボタンのイベント設定
    $(document).on('click', '.delete', function () {
        const key = $(this).data('key');
        const data = JSON.parse(localStorage.getItem(key));
        data.type = 'trash';
        localStorage.setItem(key, JSON.stringify(data));
        loadChatDefault();
    });
  // 元に戻すボタンのイベント設定
    $(document).on('click', '.undo', function () {
        const key = $(this).data('key');
        const data = JSON.parse(localStorage.getItem(key));
        data.type = 'normal';
        localStorage.setItem(key, JSON.stringify(data));
        loadChatTrash();
    });
  // 永久削除ボタンのイベント設定
    $(document).on('click', '.deleteforever', function () {
        const key = $(this).data('key');
        localStorage.removeItem(key);
        loadChatTrash();
    });

    // お気に入りリセットボタンのイベント設定
    $(document).on('click', '#button_reset-favorite', function () {
        Object.keys(localStorage).forEach(function (key) {
        const data = JSON.parse(localStorage.getItem(key));
        if (data.type === 'favorite') {
            data.type = 'normal';
            localStorage.setItem(key, JSON.stringify(data));
        }
        });
        loadChatFavorite();
    });

  // ゴミ箱から永久削除ボタンのイベント設定
    $(document).on('click', '#button_reset-trash', function () {
        Object.keys(localStorage).forEach(function (key) {
        const data = JSON.parse(localStorage.getItem(key));
        if (data.type === 'trash') {
            localStorage.removeItem(key);
        }
        });
        loadChatTrash();
    });

  // 初期表示
  $('.mode-default').removeClass('d-none');
  $('.mode-favorite').addClass('d-none');
  $('.mode-trash').addClass('d-none');
  $('.mode-description').addClass('d-none');
  $('.menu-mode').removeClass('active');
  $('#button_mode-default').addClass('active');
  loadChatDefault();
});
