const form = document.getElementById("booking-form");
const list = document.getElementById("booking-list");
const message = document.getElementById("form-message");
const STORAGE_KEY = "inkreserve_bookings_v2";

const getBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

const saveBookings = (bookings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

const renderBookings = () => {
  const bookings = getBookings();

  if (!bookings.length) {
    list.innerHTML = "<li class='muted'>まだ予約リクエストはありません。</li>";
    return;
  }

  list.innerHTML = bookings
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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
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

  if (
    !booking.name ||
    !booking.email ||
    !booking.phone ||
    !booking.date ||
    !booking.timeSlot ||
    !booking.style ||
    !booking.budget ||
    !booking.placement
  ) {
    message.textContent = "未入力の必須項目があります。";
    return;
  }

  const bookings = getBookings();
  bookings.unshift(booking);
  saveBookings(bookings);

  form.reset();
  renderBookings();
  message.textContent = "予約リクエストを送信しました。24時間以内にご連絡します。";
});

renderBookings();
