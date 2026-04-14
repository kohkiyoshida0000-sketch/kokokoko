const bookingForm = document.getElementById("booking-form");
const bookingList = document.getElementById("booking-list");
const bookingMessage = document.getElementById("form-message");
const BOOKING_STORAGE_KEY = "inkreserve_bookings_v2";

const artistForm = document.getElementById("artist-profile-form");
const artistList = document.getElementById("artist-profile-list");
const artistMessage = document.getElementById("artist-form-message");
const styleCategorySelect = document.getElementById("style-category");
const styleDetailSelect = document.getElementById("style-detail");
const ARTIST_STORAGE_KEY = "inkreserve_artist_profiles_v1";

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

const renderBookings = () => {
  const bookings = getJSON(BOOKING_STORAGE_KEY);

  if (!bookings.length) {
    bookingList.innerHTML = "<li class='muted'>まだ予約リクエストはありません。</li>";
    return;
  }

  bookingList.innerHTML = bookings
    .map(
      (booking) => `
      <li class="booking-item">
        <h4>${booking.name} さん / ${booking.style}</h4>
        <p>日時: ${booking.date} ${booking.timeSlot}</p>
        <p>部位: ${booking.placement} / 予算: ${booking.budget}</p>
        <p>連絡先: ${booking.email} / ${booking.phone}</p>
        <p>備考: ${booking.note || "なし"}</p>
      </li>
    `
    )
    .join("");
};

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

const renderArtistProfiles = () => {
  const artists = getJSON(ARTIST_STORAGE_KEY);

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
          <p>${artist.studioName} / ${artist.region}</p>
          <p>1時間料金: ¥${Number(artist.hourlyRate).toLocaleString()}</p>
          <p>カテゴリ: ${artist.styleCategory}</p>
          <p>専門: ${artist.styleDetails.join("、")}</p>
          <div class="sns-links">${artist.snsLinks
            .map((link) => `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`)
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

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const booking = {
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    phone: formData.get("phone")?.toString().trim(),
    date: formData.get("date")?.toString(),
    timeSlot: formData.get("timeSlot")?.toString(),
    style: formData.get("style")?.toString(),
    budget: formData.get("budget")?.toString(),
    placement: formData.get("placement")?.toString().trim(),
    note: formData.get("note")?.toString().trim()
  };

  if (!booking.name || !booking.email || !booking.phone || !booking.date || !booking.timeSlot || !booking.style || !booking.budget || !booking.placement) {
    bookingMessage.textContent = "未入力の必須項目があります。";
    return;
  }

  const bookings = getJSON(BOOKING_STORAGE_KEY);
  bookings.unshift(booking);
  saveJSON(BOOKING_STORAGE_KEY, bookings);

  bookingForm.reset();
  renderBookings();
  bookingMessage.textContent = "予約リクエストを送信しました。24時間以内にご連絡します。";
});

artistForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(artistForm);
  const profileImageFile = formData.get("profileImage");
  const workImageFiles = formData.getAll("workImages").filter((file) => file instanceof File && file.size > 0);

  const selectedStyles = Array.from(styleDetailSelect.selectedOptions).map((option) => option.value);
  const snsLinks = [
    formData.get("instagram")?.toString().trim(),
    formData.get("tiktok")?.toString().trim(),
    formData.get("website")?.toString().trim(),
    ...formData
      .get("otherSns")
      ?.toString()
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean)
  ].filter(Boolean);

  const artistProfile = {
    artistName: formData.get("artistName")?.toString().trim(),
    studioName: formData.get("studioName")?.toString().trim(),
    region: formData.get("region")?.toString().trim(),
    hourlyRate: formData.get("hourlyRate")?.toString(),
    styleCategory: formData.get("styleCategory")?.toString(),
    styleDetails: selectedStyles,
    snsLinks,
    profileImage: "",
    workImages: []
  };

  if (!artistProfile.artistName || !artistProfile.studioName || !artistProfile.region || !artistProfile.hourlyRate || !artistProfile.styleCategory || !artistProfile.styleDetails.length || !(profileImageFile instanceof File) || !workImageFiles.length) {
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

styleCategorySelect.addEventListener("change", updateStyleDetails);

initializeStyleCategory();
renderBookings();
renderArtistProfiles();
