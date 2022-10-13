// State değerleri
const state = {
  accountList: [],
  historyList: [],
  filterList: [{ sender: "", receiver: "" }],
  productList: [],
  cart: { currentUser: "", total: 0, products: [] },
};

// State değiştirme fonksiyonu
function setState(stateName, newValue) {
  state[stateName] = newValue;
}


window.addEventListener("load", () => {
  renderOptions();
});

// Liste itemleri oluşturma fonksiyonu
function ListItem(list, subscriber) {
  // subscriber'a bağlı olarak liste öğeleri oluşturma
  switch (subscriber.id) {
    case "accountsList":
      list.forEach((element) => {
        const newListItem = document.createElement("li");
        newListItem.setAttribute(
          "class",
          "list-group-item d-flex justify-content-between align-items-center"
        );
        newListItem.setAttribute("account-id", element.id); // Liste öğesine unique hesap idsi verir
        newListItem.innerHTML = `<div class="ms-2 me-auto">${element.name}</div><div class="me-4">${element.balance} &#8378</div><button class="btn btn-danger btn-sm" onclick="removeAccount(event)">X</button>`;
        subscriber.appendChild(newListItem);
      });
      break;
    case "historyList":
      list.forEach((element) => {
        const newListItem = document.createElement("li");
        newListItem.setAttribute(
          "class",
          "list-group-item d-flex justify-content-between align-items-center"
        );
        newListItem.setAttribute("history-id", element.id); // Liste öğesine unique işlem geçmişi idsi verir
        newListItem.innerHTML = `<div class="ms-2 me-auto">${element.time.toLocaleString() } - ${
          element.sender
        } sent ${element.receiver} ${
          element.amount
        } &#8378</div><button class="btn btn-danger btn-sm" onclick="cancelTransaction(event)">Cancel</button>`;
        subscriber.appendChild(newListItem);
      });
      break;
    case "productList":
      list.forEach((element) => {
        const newListItem = document.createElement("li");
        newListItem.setAttribute(
          "class",
          "list-group-item d-flex align-items-center justify-content-between"
        );
        newListItem.setAttribute("product-id", element.id); // Liste öğesine unique ürün idsi verir
        newListItem.innerHTML = `${element.name} - ${element.quantity} in stock - ${element.price} &#8378 <button class="btn btn-sm btn-success" onclick="addToCart(event)">Add to cart</button>`;
        subscriber.appendChild(newListItem);
      });
      break;
    case "cart":
      list.products.forEach((element) => {
        const newListItem = document.createElement("li");
        newListItem.setAttribute(
          "class",
          "list-group-item d-flex align-items-center justify-content-between"
        );
        newListItem.setAttribute("cartProduct-id", element.id); // // Liste öğesine unique sepet idsi verir
        newListItem.innerHTML = `${element.name} - ${element.quantity} in cart - ${element.price} &#8378`;
        subscriber.appendChild(newListItem);
      });
      break;
    default:
      break;
  }
}

// Select menü için seçenek oluşturma işlevi
function Option(list, subscriber) {
  list.forEach((element) => {
    const newOption = document.createElement("option"); // Option elementi oluşturma
    if (state.cart.currentUser === element.id) {
      newOption.setAttribute("selected", true);
    }
    newOption.setAttribute("value", element.id); // Hesap idye option değerini atama
    newOption.innerText = element.name; // Hesap adını option'a yazma
    subscriber.appendChild(newOption);
  });
}

// Hesap listesi render fonksiyonu
function renderAccounts() {
  const accountList = document.getElementById("accountsList"); // Hesap listesi elemanı alma
  accountList.innerHTML = ""; // Hesap listesi elemanları silme
  ListItem(state.accountList, accountList); // Hesap listesindeki statedeki her hesap için liste öğeleri oluşturun
}

// Select listesi oluşturma işlevi
function renderOptions() {
  // Seçim listesi öğesini alın
  const optionList = [
    document.getElementById("senderNames"),
    document.getElementById("receiverNames"),
    document.getElementById("senderFilter"),
    document.getElementById("receiverFilter"),
    document.getElementById("cartUser"),
  ];
  // Gönderici ve alıcı listeleri için varsayılan seçenekleri ve gerekli seçenekleri oluşturun
  optionList.forEach(function (subscriber) {
    switch (subscriber.id) {
      case "senderNames":
        subscriber.innerHTML = `<option value="" disabled selected hidden>From</option>`;
        break;
      case "receiverNames":
        subscriber.innerHTML = `<option value="" disabled selected hidden>To</option>`;
        break;
      case "senderFilter":
        subscriber.innerHTML = `<option value="" selected>Sender</option>`;
        break;
      case "receiverFilter":
        subscriber.innerHTML = `<option value="" selected>Receiver</option>`;
        break;
      case "cartUser":
        if (state.cart.currentUser === "") {
          subscriber.innerHTML = `<option value="" disabled selected hidden>User</option>`;
        } else {
          subscriber.innerHTML = ``;
        }
        break;
      default:
        break;
    }
    Option(state.accountList, subscriber);
  });
}

// Filtreleme listesi işleme işlevi
function addFilter() {
  const senderFilter = document.getElementById("senderFilter").value;
  const receiverFilter = document.getElementById("receiverFilter").value;
  setState("filterList", [
    {
      sender: senderFilter,
      receiver: receiverFilter,
    },
  ]);
  renderHistory();
}

// Render için geçmiş listesini filtreleyin
function filterList() {
  const filterList = state.filterList[0]; // State'den filtre listesi alma
  const historyList = state.historyList; // İşlem geçmişinden filtre listesi alma
  if (filterList.sender === "" && filterList.receiver === "") {
    return historyList;
  } else if (filterList.receiver === "") {
    // Alıcı filtresi boşsa, gönderen filtresine göre filtreleme
    return historyList.filter(
      (history) => history.senderId === filterList.sender
    );
  } else if (filterList.sender === "") {
    // Gönderici filtresi boş ise alıcı filtresine göre filtreleme
    return historyList.filter(
      (history) => history.receiverId === filterList.receiver
    );
  } else if (filterList.sender === filterList.receiver) {
    // Gönderici ve alıcı filtresi aynı ise, o hesap kimliğine sahip tüm işlemleri getir
    return historyList.filter((history) => {
      return (
        history.senderId === filterList.sender ||
        history.receiverId === filterList.receiver
      );
    });
  } else {
    // Gönderici ve alıcı filtresi varsa göndericinin tüm işlemlerini alıcıya getirin
    return historyList.filter((history) => {
      return (
        history.senderId === filterList.sender &&
        history.receiverId === filterList.receiver
      );
    });
  }
}

// History list render function
function renderHistory() {
  const historyList = document.getElementById("historyList"); // İşlem Geçmişi listesi alma
  historyList.innerHTML = ""; // İşlem geçmişi listesini temizleme
  const filteredHistoryList = filterList();
  ListItem(filteredHistoryList, historyList); // Statedeki her işlem geçmişi için işlem geçmişi listesine liste öğeleri oluşturma
}

//Hesap ekleme metodu
function addAccount() {
  const accountName = document.getElementById("accountName"); // Girilen hesap adını alma
  const accountBalance = document.getElementById("accountBalance"); // Girilen bakiye miktarını alma
  // İnputlarda hata varsa uyarı mesajı verme
  if (!accountName.value || !accountBalance.value) {
    return alert("Invalid account!");
  }
  // Yeni hesabı state'e ekleme
  setState("accountList", [
    ...state.accountList,
    {
      id: idGen(),
      name: accountName.value,
      balance: Number(accountBalance.value),
    },
  ]);
  // İnputları resetleme
  accountName.value = "";
  accountBalance.value = null;
  // Hesapları oluşturma ve Select Menü için optionları belirleme
  renderAccounts();
  renderOptions();
}

// Hesap silme metodu
function removeAccount(event) {
  const accountId = event.target.parentElement.attributes["account-id"].value; // Silinecek hesabın hesap kimliğini alma
  const accountIndex = state.accountList.findIndex(
    (account) => account.id === accountId
  );
  const accountList = state.accountList.slice(); // Tüm hesap listelerini kopyala
  accountList.splice(accountIndex, 1); // Silinmek istenen hesabı hesap listesinden kaldırın
  setState("accountList", accountList); // State'i yeni hesap listesiyle güncelleyin
  if (state.cart.currentUser === accountId) {
    setState("cart", 
      {
        currentUser: "",
        products: [],
        total: 0,
      },
    );
  }
  // Hesap listeleri ve select menü optionlarını render etme
  renderCart();
  renderAccounts();
  renderOptions();
}

// Para gönderme metodu
function sendMoney() {
  const senderOptions = document.getElementById("senderNames"); // Tüm gönderen seçeneklerini alma
  const receiverOptions = document.getElementById("receiverNames"); // Tüm alıcı seçeneklerini alma
  const senderId = senderOptions.options[senderOptions.selectedIndex].value; // Option değerinden gönderenin kimliğini alma
  const receiverId =
    receiverOptions.options[receiverOptions.selectedIndex].value; // Option değerinden alıcının kimliğini alma
  const amount = document.getElementById("transferAmount").value; // Option değerinden transfer miktarını alma
  // Gönderici ve alıcı idleri eşit ise hata mesajı döndürme
  if (senderId === receiverId || !amount) {
    return alert("Invalid transaction!");
  }
  // İşlem geçmişi ekleme
  addHistory(senderId, receiverId, amount);
  // Gönderici ve alıcı arasındaki işlemi yapma
  changeBalance(senderId, -amount);
  changeBalance(receiverId, amount);
}

// İşlem geçmişi ekleme metodu
function addHistory(senderId, receiverId, amount) {
  const sender = state.accountList.find((account) => account.id === senderId); // Gönderen hesap nesnesini kimliğine göre alma
  const receiver = state.accountList.find(
    (account) => account.id === receiverId
  ); // Alıcı hesabı nesnesini kimliğine göre alma
  // İşlemi geçmiş state'inin en üstüne ekleyin
  setState("historyList", [
    {
      id: idGen(), // Random unique id oluşturma
      time: new Date(), // İşlem tarihi
      sender: sender.name,
      senderId: sender.id,
      receiverId: receiver.id,
      receiver: receiver.name,
      amount: Number(amount),
    },
    ...state.historyList,
  ]);
  // İşlem Geçmişi Listesi Oluşturma
  renderHistory(state.historyList);
}

// İd'ye göre işlem geçmişi silme
function deleteHistory(historyId) {
  const historyList = state.historyList.filter(
    (history) => history.id !== historyId
  ); //id'ye göre işlem geçmişi silme
  setState("historyList", historyList); // İşlem geçmişi stateini güncelleme
  // İşlem geçmişi listesi renderı
  renderHistory(state.historyList);
}

// İşlem iptal etme metodu
function cancelTransaction(event) {
  const historyId = event.target.parentElement.attributes["history-id"].value; // İptal edilecek işlemin id'sini alma
  const history = state.historyList.find((history) => history.id === historyId); // İşlem geçmişi nesnesine id'ye göre state'den alma
  // Hesap hala var mı kontrolü
  const sender = state.accountList.find(
    (account) => account.id === history.senderId
  ); //İd'ye göre stateden gönderici nesnesini alma
  const receiver = state.accountList.find(
    (account) => account.id === history.receiverId
  ); //İd'ye göre stateden alıcı nesnesini alma
  // Hesap silindiyse uyarı mesajı verme
  if (!sender || !receiver) {
    return alert(
      "One of the accounts is deleted. You cannot cancel this transaction!"
    );
    // Hesap hala varsa işlemi iptal etme
  } else {
    // Parayı geri göndererek işlemi geri alma
    changeBalance(history.receiverId, -history.amount);
    changeBalance(history.senderId, history.amount);
    deleteHistory(historyId); // İşlem geçmişi state'inden işlem geçmişini silin ve işlem geçmişi listesini oluşturma
  }
}

// Hesap bakiyesi değiştirme metodu
function changeBalance(accountId, amount) {
  const accountList = state.accountList; // Hesap durumu alma
  const accountIndex = accountList.findIndex(
    (account) => account.id === accountId
  ); // Hesabın indeksini alma   //BURADA İF İLE KONTROL KOY BALANCE AMOUNTTAN KÜÇÜKSE UYARI MESAJI VERSİN
  accountList[accountIndex] = {
    ...accountList[accountIndex],
    balance: accountList[accountIndex].balance + Number(amount),
  };
  setState("accountList", accountList); // Hesap state'ini yeni değişkenlere ayarlama
  renderAccounts(); // Hesap listesi renderı
}

// Ürün stok değiştirme metodu
function changeStock(cartProductList, sign) {
  const productList = state.productList;
  if (sign === "+") {
    cartProductList.forEach((cartProduct, index) => {
      const productIndex = productList.findIndex(
        (product) => product.id === cartProduct.id
      );
      productList[productIndex] = {
        ...productList[productIndex],
        quantity: productList[productIndex] + cartProductList[index].quantity,
      };
    });
  } else if (sign === "-") {
    cartProductList.forEach((cartProduct, index) => {
      const productIndex = productList.findIndex(
        (product) => product.id === cartProduct.id
      );
      productList[productIndex] = {
        ...productList[productIndex],
        quantity:
          productList[productIndex].quantity - cartProductList[index].quantity,
      };
    });
  }
  setState("productList", productList);
  renderProducts();
}

// Ürün ekleme metodu
function addProduct() {
  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const productQuantity = document.getElementById("productQuantity");
  if (productName && productPrice && productQuantity) {
    setState("productList", [
      ...state.productList,
      {
        id: idGen(),
        name: productName.value,
        price: Number(productPrice.value),
        quantity: Number(productQuantity.value),
      },
    ]);
    // Ürün input değerlerini resetleme
    productName.value = "";
    productPrice.value = null;
    productQuantity.value = null;
    renderProducts();
  } else {
    alert("Invalid product input!");
  }
}

// Ürün render metodu
function renderProducts() {
  const productList = document.getElementById("productList"); // Ürün listesi elemanlarını alma
  productList.innerHTML = ""; // Ürün listesi silme
  ListItem(state.productList, productList); // Statedeki her işlem geçmişi için işlem geçmişi listesine liste öğeleri oluşturma
}

// Sepet kullanıcı metodu alma
function setCartUser() {
  const cartUser = document.getElementById("cartUser").value;
  setState("cart", {
    currentUser: cartUser,
    products: [],
    total: 0,
  });
  renderCart();
}

// Sepete ekleme metodu
function addToCart(event) {
  if (!state.cart.currentUser) {
    alert("No user selected for cart!");
  } else {
    const cartProducts = state.cart.products;
    const productId = event.target.parentElement.attributes["product-id"].value;
    const productIndex = cartProducts.findIndex(
      (product) => product.id === productId
    );
    if (productIndex !== -1) {
      cartProducts[productIndex] = {
        ...cartProducts[productIndex],
        quantity: cartProducts[productIndex].quantity + 1,
      };
    } else {
      const product = state.productList.find(
        (product) => product.id === productId
      );
      cartProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
    const cartTotal = state.cart.products.reduce((acc, curr) => {
      return acc + curr.quantity * curr.price;
    }, 0);
    setState("cart", {
      currentUser: state.cart.currentUser,
      products: cartProducts,
      total: cartTotal,
    });
    renderCart();
  }
}

// Ödeme metodu
function checkout() {
  const currentAccountId = state.cart.currentUser;
  const total = state.cart.total;
  changeBalance(currentAccountId, -total);
  changeStock(state.cart.products, "-");
  setState("cart", {
    currentUser: currentAccountId,
    products: [],
    total: 0,
  });
  renderAccounts();
  renderCart();
}

// Sepet render metodu
function renderCart() {
  const cart = document.getElementById("cart");
  const cartTotalElement = document.getElementById("cartTotal");
  const cartTotal = state.cart.total;
  cartTotalElement.innerHTML = `${cartTotal} &#8378`;
  cart.innerHTML = "";
  ListItem(state.cart, cart);
}

//Kimlik oluşturucu yardımcı metodu
function idGen() {
  return String(Math.round(Math.random() * 10000));
}
