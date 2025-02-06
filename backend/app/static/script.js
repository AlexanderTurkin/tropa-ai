document.addEventListener("DOMContentLoaded", () => {
  // Инициализация фоновой анимации с помощью Vanta.js
  VANTA.WAVES({
    el: "#background",
    color: 0x0C3B68, // Глубокий синий
    shininess: 60, // Усиленный блеск
    waveHeight: 25, // Чуть выше волны
    waveSpeed: 0.5, // Умеренная скорость анимации
    zoom: 1.2, // Легкое увеличение для глубины эффекта
  });

  const chatBox = document.getElementById("chat-box");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");

  // Функция для динамического расчёта высоты блока чата
  function updateChatHeight() {
    const windowHeight = window.innerHeight;
    const chatHeight = Math.max(500, windowHeight * 0.3) + "px";
    chatBox.style.height = chatHeight;
  }
  window.addEventListener("resize", updateChatHeight);
  updateChatHeight();

  // Функция для добавления сообщения в чат
  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    // Автоматическая прокрутка к последнему сообщению
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Функция для добавления виджета с картой и построения маршрута из 3 точек
  function appendMapWidget() {
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "map-widget";
    widgetContainer.style.position = "relative";
    widgetContainer.style.width = "100%";
    widgetContainer.style.height = "300px";
    widgetContainer.style.marginTop = "10px";
    widgetContainer.style.borderRadius = "12px";
    widgetContainer.style.overflow = "hidden";
    widgetContainer.style.background = "rgba(255, 255, 255, 0.2)";
    widgetContainer.style.backdropFilter = "blur(10px)";
    widgetContainer.style.padding = "10px";

    // Создаём уникальный id для контейнера карты
    const mapContainer = document.createElement("div");
    mapContainer.id = "map-" + Date.now();
    mapContainer.style.width = "100%";
    mapContainer.style.height = "100%";
    mapContainer.style.borderRadius = "10px";

    widgetContainer.appendChild(mapContainer);
    chatBox.appendChild(widgetContainer);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Данные маршрута с тремя точками: Москва, Тверь, Санкт-Петербург
    const routeData = {
      names: ["Москва", "Тверь", "Санкт-Петербург"],
      placemarks: [
        [55.7558, 37.6176],   // Москва
        [56.8581, 35.9179],   // Тверь
        [59.9311, 30.3609]    // Санкт-Петербург
      ],
      tags: [["Столица"], ["Исторический город"], ["Культурная столица"]],
      startPoint: [55.7558, 37.6176],
      endPoint: [59.9311, 30.3609],
      viaPoints: [
        [55.7558, 37.6176],
        [56.8581, 35.9179],
        [59.9311, 30.3609]
      ]
    };

    // Инициализация карты через API Яндекс.Карт
    ymaps.ready(() => {
      const map = new ymaps.Map(mapContainer.id, {
        center: routeData.startPoint,
        zoom: 7, // Подбираем масштаб так, чтобы были видны все точки
        controls: ["routePanelControl"],
      });

      // Добавляем метки на карту
      for (let i = 0; i < routeData.placemarks.length; i++) {
        const placemark = new ymaps.Placemark(
          routeData.placemarks[i],
          {
            balloonContentHeader: routeData.names[i],
            balloonContentFooter: routeData.tags[i].join(", "),
          },
          {
            iconLayout: "default#image",
            iconImageHref:
              "https://cdn-icons-png.flaticon.com/512/7153/7153133.png",
            iconImageSize: [40, 40],
          }
        );
        map.geoObjects.add(placemark);
      }

      // Настраиваем панель маршрутов
      const control = map.controls.get("routePanelControl");
      control.routePanel.state.set({
        fromEnabled: false,
        toEnabled: false,
        from: routeData.startPoint,
        to: routeData.endPoint,
      });

      // Строим маршрут по заданным точкам
      ymaps
        .route(routeData.viaPoints)
        .then((route) => {
          map.geoObjects.add(route);
        })
        .catch((error) => {
          alert("Ошибка построения маршрута: " + error.message);
        });
    });
  }

  // Обработка нажатия кнопки отправки сообщения
  sendBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message !== "") {
      appendMessage("Вы", message);
      chatInput.value = "";

      // Если сообщение содержит слово "маршрут", показываем карту
      if (message.toLowerCase().includes("маршрут")) {
        setTimeout(() => {
          appendMessage("Tropa-AI", "Вот ваш маршрут:");
          appendMapWidget();
        }, 1000);
      } else {
        setTimeout(() => {
          appendMessage(
            "Tropa-AI",
            "Я пока учусь отвечать на вопросы, попробуйте что-то другое!"
          );
        }, 1000);
      }
    }
  });

  // Отправка сообщения при нажатии клавиши Enter
  chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendBtn.click();
    }
  });
});
