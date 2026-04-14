const BOOKING_STORAGE_KEY = "inkreserve_bookings_v3";
const ARTIST_STORAGE_KEY = "inkreserve_artist_profiles_v2";
const BLACKLIST_STORAGE_KEY = "inkreserve_blacklist_v1";
const FLASH_STORAGE_KEY = "inkreserve_flash_v1";
const CALENDAR_STORAGE_KEY = "inkreserve_calendar_v1";

const bookingForm = document.getElementById("booking-form");
const bookingList = document.getElementById("booking-list");
const bookingMessage = document.getElementById("form-message");

const artistForm = document.getElementById("artist-profile-form");
const artistList = document.getElementById("artist-profile-list");
const artistMessage = document.getElementById("artist-form-message");
const styleCategorySelect = document.getElementById("style-category");
const styleDetailSelect = document.getElementById("style-detail");

const artistSearchKeyword = document.getElementById("artist-search-keyword");
const artistSearchMaxRate = document.getElementById("artist-search-max-rate");
const artistSearchButton = document.getElementById("artist-search-button");
const nearbySearchButton = document.getElementById("nearby-search-button");
const nearbyMessage = document.getElementById("nearby-message");

const bookingSearchDate = document.getElementById("booking-search-date");
const bookingSearchTime = document.getElementById("booking-search-time");
const bookingSearchButton = document.getElementById("booking-search-button");

const reminderList = document.getElementById("design-reminder-list");
const tomorrowCustomerList = document.getElementById("tomorrow-customer-list");

const blacklistForm = document.getElementById("blacklist-form");
const blacklistList = document.getElementById("blacklist-list");

const flashForm = document.getElementById("flash-form");
const flashList = document.getElementById("flash-list");

const calendarForm = document.getElementById("calendar-form");
const calendarList = document.getElementById("calendar-list");

const STYLE_MAP = {
  "基本スタイル": ["ワンポイント", "ミニタトゥー", "スモールタトゥー", "ミディアムタトゥー", "ラージタトゥー", "フルスリーブ", "ハーフスリーブ", "バックピース", "チェストピース"],
  "ブラック＆グレー系": ["ブラック＆グレー", "リアリズム（モノクロ）", "ブラックワーク", "ダークアート", "スケッチ風", "チカーノ", "ファインライン", "シングルニードル"],
  "カラー系": ["カラーワーク", "フルカラー", "ウォーターカラー", "ネオンカラー", "グラデーションカラー"],
  "リアリズム系": ["リアリスティック", "ポートレート", "3Dタトゥー", "ハイパーリアリズム", "フォトリアル"],
  "和彫（ジャパニーズ）": ["和彫", "伝統和彫", "新和彫", "浮世絵風", "刺青（イレズミ）", "額彫り", "抜き彫り", "ぼかし（ぼかし技法）"],
  "トラディショナル系": ["アメリカントラディショナル（オールドスクール）", "ネオトラディショナル", "ジャパニーズトラディショナル", "クラシックタトゥー"],
  "レタリング系": ["レタリング", "スクリプト", "カリグラフィー", "ゴシックレター", "オールドイングリッシュ", "筆記体", "ブロック体", "タイポグラフィ"],
  "トライバル系": ["トライバル", "ポリネシアン", "マオリ", "ハワイアン", "ブラックトライバル"],
  "幾何学・抽象": ["ジオメトリック", "シンメトリー", "マンダラ", "ラインワーク", "ドットワーク", "オプアート", "抽象デザイン"],
  "イラスト・ポップ系": ["アニメタトゥー", "漫画タトゥー", "ポップアート", "カートゥーン", "ニュースクール", "ステッカー風"],
  "モチーフ別": ["動物（アニマル）", "花（フラワー）", "植物（ボタニカル）", "スカル（ドクロ）", "ドラゴン", "天使・悪魔", "宗教モチーフ", "星・宇宙", "時計・時間", "ナイフ・武器", "シンボル・記号"],
  "特殊スタイル": ["ホワイトインク", "UVタトゥー（ブラックライト）", "バイオメカニクス", "サイバーパンク", "スチームパンク", "ミニマリスト", "カバーアップ", "リワーク"]
};

const getJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
};

const saveJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const toDate = (dateText) => new Date(`${dateText}T00:00:00`);
const diffDays = (from, to) => Math.floor((to - from) / (1000 * 60 * 60 * 24));

const initializeStyleCategory = () => {
  Object.keys(STYLE_MAP).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    styleCategorySelect.append(option);
  });
};

const updateStyleDetails = () => {
  const selectedCategory = styleCategorySelect.value;
  const styleDetails = STYLE_MAP[selectedCategory] ?? [];

  styleDetailSelect.innerHTML = "";
  styleDetails.forEach((style) => {
    const option = document.createElement("option");
    option.value = style;
    option.textContent = style;
    styleDetailSelect.append(option);
  });
};

const renderBookings = (bookings = getJSON(BOOKING_STORAGE_KEY)) => {
  if (!bookings.length) {
    bookingList.innerHTML = "<li class='muted'>まだ予約はありません。</li>";
    return;
  }

  bookingList.innerHTML = bookings
    .map(
      (booking) => `
      <li class="booking-item">
        <h4>${booking.name} / ${booking.style}</h4>
        <p>日時: ${booking.date} ${booking.timeSlot}</p>
        <p>DM: ${booking.dmHandle}</p>
        <p>部位: ${booking.placement} / 目安時間: ${booking.preferredDuration}</p>
        <p>デザイン状況: ${booking.designStage}${booking.designUrl ? ` / 参考: ${booking.designUrl}` : ""}</p>
      </li>
    `
    )
    .join("");
};

const renderArtistProfiles = (artists = getJSON(ARTIST_STORAGE_KEY)) => {
  if (!artists.length) {
    artistList.innerHTML = "<li class='muted'>まだプロフィール登録はありません。</li>";
    return;
  }

  artistList.innerHTML = artists
    .map(
      (artist) => `
      <li class="artist-card">
        <img class="profile-image" src="${artist.profileImage}" alt="${artist.artistName} のプロフィール写真" />
        <div class="artist-meta">
          <h4>${artist.artistName}</h4>
          <p>${artist.studioName} / ${artist.region}（最寄り: ${artist.nearestStation}）</p>
          <p>1時間料金: ¥${Number(artist.hourlyRate).toLocaleString()}</p>
          <p>前借り制度: ${artist.advanceSupport}</p>
          <p>カテゴリ: ${artist.styleCategory}</p>
          <p>専門: ${artist.styleDetails.join("、")}</p>
          <div class="sns-links">${artist.snsLinks
            .map((link) => `<a href="${link}" target="_blank" rel="noopener noreferrer">リンク</a>`)
            .join("")}</div>
          <div class="work-gallery">${artist.workImages
            .map((image, index) => `<img src="${image}" alt="${artist.artistName} の作品写真 ${index + 1}" />`)
            .join("")}</div>
        </div>
      </li>
    `
    )
    .join("");
};

const renderDesignReminders = () => {
  const bookings = getJSON(BOOKING_STORAGE_KEY);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminders = bookings.filter((booking) => {
    const bookingDate = toDate(booking.date);
    const days = diffDays(today, bookingDate);
    return days === 3;
  });

  reminderList.innerHTML = reminders.length
    ? reminders.map((item) => `<li class="booking-item"><p>${item.date} ${item.timeSlot} / ${item.name} - 下絵完成確認が必要</p></li>`).join("")
    : "<li class='muted'>3日前確認対象はありません。</li>";
};

const renderTomorrowCustomers = () => {
  const bookings = getJSON(BOOKING_STORAGE_KEY);
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const target = tomorrow.toISOString().slice(0, 10);

  const targets = bookings.filter((booking) => booking.date === target);
  tomorrowCustomerList.innerHTML = targets.length
    ? targets.map((item) => `<li class="booking-item"><p>${item.timeSlot} / ${item.name} / ${item.dmHandle}</p></li>`).join("")
    : "<li class='muted'>明日の予約顧客はいません。</li>";
};

const renderBlacklist = () => {
  const list = getJSON(BLACKLIST_STORAGE_KEY);
  blacklistList.innerHTML = list.length
    ? list.map((item) => `<li class="booking-item"><p>${item.customerKey} - ${item.reason}</p></li>`).join("")
    : "<li class='muted'>ブラックリスト登録はありません。</li>";
};

const renderFlash = () => {
  const list = getJSON(FLASH_STORAGE_KEY);
  flashList.innerHTML = list.length
    ? list
        .map(
          (item) => `
      <li class="artist-card">
        <img class="profile-image" src="${item.imageUrl}" alt="${item.title}" />
        <div class="artist-meta">
          <h4>${item.title}</h4>
          <p>販売価格: ¥${item.price.toLocaleString()}</p>
          <p>手数料(5%): ¥${item.fee.toLocaleString()} / 受取: ¥${item.receivable.toLocaleString()}</p>
        </div>
      </li>`
        )
        .join("")
    : "<li class='muted'>フラッシュ出品はありません。</li>";
};

const renderCalendar = () => {
  const list = getJSON(CALENDAR_STORAGE_KEY);
  calendarList.innerHTML = list.length
    ? list.map((item) => `<li class="booking-item"><p>顧客希望: ${item.customerDate} / アーティスト空き: ${item.artistDate}</p></li>`).join("")
    : "<li class='muted'>カレンダー共有メモはありません。</li>";
};

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);

  const booking = {
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    phone: formData.get("phone")?.toString().trim(),
    dmHandle: formData.get("dmHandle")?.toString().trim(),
    date: formData.get("date")?.toString(),
    timeSlot: formData.get("timeSlot")?.toString(),
    style: formData.get("style")?.toString(),
    budget: formData.get("budget")?.toString(),
    designStage: formData.get("designStage")?.toString(),
    designUrl: formData.get("designUrl")?.toString().trim(),
    placement: formData.get("placement")?.toString().trim(),
    preferredDuration: formData.get("preferredDuration")?.toString().trim()
  };

  if (Object.values(booking).some((value, index) => index !== 9 && !value)) {
    bookingMessage.textContent = "必須項目を入力してください。";
    return;
  }

  const blacklist = getJSON(BLACKLIST_STORAGE_KEY);
  if (blacklist.some((item) => booking.name.includes(item.customerKey) || booking.phone.includes(item.customerKey))) {
    bookingMessage.textContent = "この顧客はブラックリストに該当するため予約できません。";
    return;
  }

  const bookings = getJSON(BOOKING_STORAGE_KEY);
  bookings.unshift(booking);
  saveJSON(BOOKING_STORAGE_KEY, bookings);
  bookingForm.reset();
  bookingMessage.textContent = "予約を保存しました。彫り師へDM共有をお願いします。";

  renderBookings();
  renderDesignReminders();
  renderTomorrowCustomers();
});

artistForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(artistForm);
  const profileImageFile = formData.get("profileImage");
  const workImageFiles = formData.getAll("workImages").filter((file) => file instanceof File && file.size > 0);
  const selectedStyles = Array.from(styleDetailSelect.selectedOptions).map((option) => option.value);

  const artistProfile = {
    artistName: formData.get("artistName")?.toString().trim(),
    studioName: formData.get("studioName")?.toString().trim(),
    region: formData.get("region")?.toString().trim(),
    nearestStation: formData.get("nearestStation")?.toString().trim(),
    hourlyRate: formData.get("hourlyRate")?.toString(),
    advanceSupport: formData.get("advanceSupport")?.toString(),
    styleCategory: formData.get("styleCategory")?.toString(),
    styleDetails: selectedStyles,
    snsLinks: [
      formData.get("instagram")?.toString().trim(),
      formData.get("tiktok")?.toString().trim(),
      formData.get("website")?.toString().trim(),
      ...formData.get("otherSns")?.toString().split(",").map((url) => url.trim()).filter(Boolean)
    ].filter(Boolean),
    profileImage: "",
    workImages: []
  };

  if (!artistProfile.artistName || !artistProfile.studioName || !artistProfile.region || !artistProfile.nearestStation || !artistProfile.hourlyRate || !artistProfile.advanceSupport || !artistProfile.styleCategory || !artistProfile.styleDetails.length || !(profileImageFile instanceof File) || !workImageFiles.length) {
    artistMessage.textContent = "必須項目をすべて入力してください。";
    return;
  }

  artistProfile.profileImage = await toDataUrl(profileImageFile);
  artistProfile.workImages = await Promise.all(workImageFiles.map((file) => toDataUrl(file)));

  const artists = getJSON(ARTIST_STORAGE_KEY);
  artists.unshift(artistProfile);
  saveJSON(ARTIST_STORAGE_KEY, artists);

  artistForm.reset();
  styleDetailSelect.innerHTML = "";
  artistMessage.textContent = "プロフィールを登録しました。";
  renderArtistProfiles();
});

artistSearchButton.addEventListener("click", () => {
  const artists = getJSON(ARTIST_STORAGE_KEY);
  const keyword = artistSearchKeyword.value.trim();
  const maxRate = Number(artistSearchMaxRate.value);

  const filtered = artists.filter((artist) => {
    const keywordMatch = !keyword || artist.region.includes(keyword) || artist.nearestStation.includes(keyword);
    const rateMatch = !maxRate || Number(artist.hourlyRate) <= maxRate;
    return keywordMatch && rateMatch;
  });

  renderArtistProfiles(filtered);
});

nearbySearchButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    nearbyMessage.textContent = "このブラウザでは位置情報検索が利用できません。";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      nearbyMessage.textContent = `現在地を取得しました（緯度: ${position.coords.latitude.toFixed(4)}, 経度: ${position.coords.longitude.toFixed(4)}）。地域キーワード検索と併用してください。`;
    },
    () => {
      nearbyMessage.textContent = "位置情報の取得に失敗しました。ブラウザの許可設定を確認してください。";
    }
  );
});

bookingSearchButton.addEventListener("click", () => {
  const bookings = getJSON(BOOKING_STORAGE_KEY);
  const date = bookingSearchDate.value;
  const time = bookingSearchTime.value;

  const filtered = bookings.filter((booking) => (!date || booking.date === date) && (!time || booking.timeSlot === time));
  renderBookings(filtered);
});

blacklistForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(blacklistForm);
  const item = {
    customerKey: formData.get("customerKey")?.toString().trim(),
    reason: formData.get("reason")?.toString().trim()
  };

  if (!item.customerKey || !item.reason) {
    return;
  }

  const list = getJSON(BLACKLIST_STORAGE_KEY);
  list.unshift(item);
  saveJSON(BLACKLIST_STORAGE_KEY, list);
  blacklistForm.reset();
  renderBlacklist();
});

flashForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(flashForm);
  const price = Number(formData.get("price")?.toString());
  const item = {
    title: formData.get("title")?.toString().trim(),
    imageUrl: formData.get("imageUrl")?.toString().trim(),
    price,
    fee: Math.round(price * 0.05),
    receivable: Math.round(price * 0.95)
  };

  if (!item.title || !item.imageUrl || !price) {
    return;
  }

  const list = getJSON(FLASH_STORAGE_KEY);
  list.unshift(item);
  saveJSON(FLASH_STORAGE_KEY, list);
  flashForm.reset();
  renderFlash();
});

calendarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(calendarForm);
  const item = {
    customerDate: formData.get("customerDate")?.toString(),
    artistDate: formData.get("artistDate")?.toString()
  };

  if (!item.customerDate || !item.artistDate) {
    return;
  }

  const list = getJSON(CALENDAR_STORAGE_KEY);
  list.unshift(item);
  saveJSON(CALENDAR_STORAGE_KEY, list);
  calendarForm.reset();
  renderCalendar();
});

styleCategorySelect.addEventListener("change", updateStyleDetails);

initializeStyleCategory();
renderBookings();
renderArtistProfiles();
renderDesignReminders();
renderTomorrowCustomers();
renderBlacklist();
renderFlash();
renderCalendar();
