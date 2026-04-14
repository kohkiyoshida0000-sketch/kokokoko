const BOOKING_STORAGE_KEY = "inkreserve_bookings_v3";
const ARTIST_STORAGE_KEY = "inkreserve_artist_profiles_v2";
const BLACKLIST_STORAGE_KEY = "inkreserve_blacklist_v1";
const FLASH_STORAGE_KEY = "inkreserve_flash_v1";
const CALENDAR_STORAGE_KEY = "inkreserve_calendar_v1";
const PAYMENT_STORAGE_KEY = "inkreserve_payments_v1";
const DM_STORAGE_KEY = "inkreserve_dm_v1";
const PROFILE_STORAGE_KEY = "inkreserve_profiles_v1";
const POST_STORAGE_KEY = "inkreserve_posts_v1";
const FOLLOW_STORAGE_KEY = "inkreserve_follows_v1";
const COUPON_STORAGE_KEY = "inkreserve_coupon_v1";

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

const paymentForm = document.getElementById("payment-form");
const paymentMessage = document.getElementById("payment-message");
const paymentList = document.getElementById("payment-list");
const couponForm = document.getElementById("coupon-form");
const couponMessage = document.getElementById("coupon-message");

const dmForm = document.getElementById("dm-form");
const dmList = document.getElementById("dm-list");

const splashScreen = document.getElementById("splash-screen");
const typingText = document.getElementById("typing-text");
const enterSiteButton = document.getElementById("enter-site");
const appShell = document.querySelectorAll(".app-shell");

const profileForm = document.getElementById("profile-form");
const profileList = document.getElementById("profile-list");
const postForm = document.getElementById("post-form");
const postFeed = document.getElementById("post-feed");

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

const normalizeCouponCode = (code) =>
  code
    .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 65248))
    .replace(/\s+/g, "")
    .toUpperCase();

const applyCouponUIState = () => {
  const couponState = localStorage.getItem(COUPON_STORAGE_KEY) === "applied";
  const amountInput = paymentForm.querySelector('input[name="amount"]');
  if (!amountInput) {
    return;
  }

  if (couponState) {
    amountInput.value = "0";
    amountInput.readOnly = true;
    couponMessage.textContent = "クーポン適用済みです。";
  } else {
    if (!amountInput.value || amountInput.value === "0") {
      amountInput.value = "4980";
    }
    amountInput.readOnly = false;
  }
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


const renderPayments = () => {
  const list = getJSON(PAYMENT_STORAGE_KEY);
  paymentList.innerHTML = list.length
    ? list.map((item) => `<li class="booking-item"><p>${item.createdAt} / ${item.customerEmail} / ${item.paymentType} / ¥${Number(item.amount).toLocaleString()} / ${item.status}</p></li>`).join("")
    : "<li class='muted'>決済履歴はありません。</li>";
};

const renderDMs = () => {
  const list = getJSON(DM_STORAGE_KEY);
  dmList.innerHTML = list.length
    ? list.map((item) => `<li class="booking-item"><p>[${item.sentAt}] ${item.senderRole} → ${item.targetName}</p><p>${item.message}</p></li>`).join("")
    : "<li class='muted'>DM履歴はありません。</li>";
};


const renderProfiles = () => {
  const profiles = getJSON(PROFILE_STORAGE_KEY);
  const posts = getJSON(POST_STORAGE_KEY);
  const follows = getJSON(FOLLOW_STORAGE_KEY);

  if (!profiles.length) {
    profileList.innerHTML = "<li class='muted'>プロフィール登録はまだありません。</li>";
    return;
  }

  const activeHandle = localStorage.getItem("inklink_active_handle") || profiles[0].handle;

  profileList.innerHTML = profiles
    .map((profile) => {
      const latestPost = posts.find((post) => post.authorHandle === profile.handle);
      const isFollowing = follows.some((item) => item.follower === activeHandle && item.target === profile.handle);
      return `
      <li class="artist-card">
        <div class="profile-head">
          <img class="avatar" src="${profile.avatarUrl || "https://placehold.co/80x80?text=INK"}" alt="${profile.displayName}" />
          <div>
            <h4>${profile.displayName} <small>@${profile.handle}</small></h4>
            <p>${profile.role}</p>
            <p class="status-text">${latestPost ? latestPost.content : "まだ投稿はありません"}</p>
          </div>
        </div>
        <button type="button" class="follow-btn" data-target="${profile.handle}">${isFollowing ? "フォロー中" : "フォロー"}</button>
      </li>`;
    })
    .join("");

  document.querySelectorAll(".follow-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      if (!target || target === activeHandle) {
        return;
      }
      const list = getJSON(FOLLOW_STORAGE_KEY);
      const exists = list.find((item) => item.follower === activeHandle && item.target === target);
      const next = exists ? list.filter((item) => !(item.follower === activeHandle && item.target === target)) : [...list, { follower: activeHandle, target }];
      saveJSON(FOLLOW_STORAGE_KEY, next);
      renderProfiles();
    });
  });
};

const renderPosts = () => {
  const posts = getJSON(POST_STORAGE_KEY);
  postFeed.innerHTML = posts.length
    ? posts
        .map(
          (post) => `
      <li class="artist-card">
        <p><strong>@${post.authorHandle}</strong> ・ ${post.createdAt}</p>
        <p>${post.content}</p>
        ${post.imageUrl ? `<img class="profile-image" src="${post.imageUrl}" alt="投稿画像" />` : ""}
        ${post.mentions.length ? `<p>メンション: ${post.mentions.map((m) => `<span class="mention">${m}</span>`).join(" ")}</p>` : ""}
      </li>`
        )
        .join("")
    : "<li class='muted'>投稿はまだありません。</li>";
};

const initializeSplash = () => {
  const phrase = "Welcome to InkLink";
  let index = 0;
  const timer = setInterval(() => {
    typingText.textContent += phrase[index];
    index += 1;
    if (index >= phrase.length) {
      clearInterval(timer);
      enterSiteButton.hidden = false;
    }
  }, 90);

  enterSiteButton.addEventListener("click", () => {
    splashScreen.style.display = "none";
    appShell.forEach((item) => {
      item.hidden = false;
    });
  });
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



couponForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(couponForm);
  const inputCode = formData.get("couponCode")?.toString() ?? "";
  const normalized = normalizeCouponCode(inputCode);

  if (normalized === "GARAGE1717") {
    localStorage.setItem(COUPON_STORAGE_KEY, "applied");
    couponMessage.textContent = "クーポンを適用しました。";
    applyCouponUIState();
  } else {
    couponMessage.textContent = "クーポンコードが正しくありません。";
  }
});

paymentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(paymentForm);
  const couponApplied = localStorage.getItem(COUPON_STORAGE_KEY) === "applied";
  const requestedAmount = Number(formData.get("amount")?.toString());

  const payment = {
    customerEmail: formData.get("customerEmail")?.toString().trim(),
    paymentType: formData.get("paymentType")?.toString(),
    amount: couponApplied && formData.get("paymentType")?.toString() === "月額プラン" ? 0 : requestedAmount,
    status: "処理中",
    createdAt: new Date().toLocaleString("ja-JP")
  };

  if (!payment.customerEmail || !payment.paymentType || (payment.amount < 0 || Number.isNaN(payment.amount))) {
    paymentMessage.textContent = "決済情報を入力してください。";
    return;
  }

  const stripePublicKey = window.INKLINK_STRIPE_PUBLIC_KEY || "";

  if (window.Stripe && stripePublicKey) {
    paymentMessage.textContent = "Stripe Checkoutへ遷移します...";
    const stripe = window.Stripe(stripePublicKey);
    await stripe.redirectToCheckout({
      lineItems: [{
        price_data: {
          currency: "jpy",
          product_data: { name: `${payment.paymentType} / Ink Link` },
          unit_amount: payment.amount
        },
        quantity: 1
      }],
      mode: "payment",
      successUrl: window.location.href,
      cancelUrl: window.location.href
    });
  } else {
    payment.status = "デモ決済完了";
    paymentMessage.textContent = payment.amount === 0 ? "クーポン適用により0円で登録しました。" : "Stripe公開鍵未設定のため、デモ決済として保存しました。";
  }

  const list = getJSON(PAYMENT_STORAGE_KEY);
  list.unshift(payment);
  saveJSON(PAYMENT_STORAGE_KEY, list);
  paymentForm.reset();
  renderPayments();
});

dmForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(dmForm);
  const dm = {
    senderRole: formData.get("senderRole")?.toString(),
    targetName: formData.get("targetName")?.toString().trim(),
    message: formData.get("message")?.toString().trim(),
    sentAt: new Date().toLocaleString("ja-JP")
  };

  if (!dm.senderRole || !dm.targetName || !dm.message) {
    return;
  }

  const list = getJSON(DM_STORAGE_KEY);
  list.unshift(dm);
  saveJSON(DM_STORAGE_KEY, list);
  dmForm.reset();
  renderDMs();
});


profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  const profile = {
    role: formData.get("role")?.toString(),
    displayName: formData.get("displayName")?.toString().trim(),
    handle: formData.get("handle")?.toString().replace(/^@/, "").trim(),
    avatarUrl: formData.get("avatarUrl")?.toString().trim()
  };

  if (!profile.role || !profile.displayName || !profile.handle) {
    return;
  }

  const list = getJSON(PROFILE_STORAGE_KEY).filter((item) => item.handle !== profile.handle);
  list.unshift(profile);
  saveJSON(PROFILE_STORAGE_KEY, list);
  localStorage.setItem("inklink_active_handle", profile.handle);
  profileForm.reset();
  renderProfiles();
  renderPosts();
});

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(postForm);
  const post = {
    authorHandle: formData.get("authorHandle")?.toString().replace(/^@/, "").trim(),
    content: formData.get("content")?.toString().trim(),
    imageUrl: formData.get("imageUrl")?.toString().trim(),
    mentions: formData
      .get("mentions")
      ?.toString()
      .split(",")
      .map((mention) => mention.trim())
      .filter(Boolean) ?? [],
    createdAt: new Date().toLocaleString("ja-JP")
  };

  if (!post.authorHandle || !post.content) {
    return;
  }

  const list = getJSON(POST_STORAGE_KEY);
  list.unshift(post);
  saveJSON(POST_STORAGE_KEY, list);
  postForm.reset();
  renderPosts();
  renderProfiles();
});

styleCategorySelect.addEventListener("change", updateStyleDetails);

initializeStyleCategory();
applyCouponUIState();
renderBookings();
renderArtistProfiles();
renderDesignReminders();
renderTomorrowCustomers();
renderBlacklist();
renderFlash();
renderCalendar();
renderPayments();
renderDMs();
renderProfiles();
renderPosts();
initializeSplash();
