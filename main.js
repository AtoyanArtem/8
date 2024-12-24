document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openFormBtn = document.getElementById("openFormBtn");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const feedbackForm = document.getElementById("feedbackForm");
    const responseMessage = document.getElementById("responseMessage");


    // Восстановление данных из локального хранилища
    const restoreFormData = () => {
        const savedData = JSON.parse(localStorage.getItem("formData")) || {};
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = savedData[key];
        });
    };

    const saveFormData = () => {
        const formData = {};
        new FormData(feedbackForm).forEach((value, key) => {
            formData[key] = value;
        });
        localStorage.setItem("formData", JSON.stringify(formData));
    };

    const clearFormData = () => {
        localStorage.removeItem("formData");
        feedbackForm.reset();
    };

    const showPopup = () => {
        popup.style.display = "flex";
        history.pushState({ popupOpen: true }, "", "#feedback-form");
    };

    const closePopup = () => {
        popup.style.display = "none";
        history.replaceState({ popupOpen: false }, "", "");
    };

    // Всплывающее окно "Открыть/закрыть"
    openFormBtn.addEventListener("click", showPopup);
    closeFormBtn.addEventListener("click", closePopup);

    // Обработка истории
    window.addEventListener("popstate", (event) => {
        if (event.state?.popupOpen) {
            showPopup();
        } else {
            closePopup();
        }
    });

    // Отправить форму
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        saveFormData();

        // Получаем значения элементов формы *здесь*
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const organization = document.getElementById("organization").value;
        const message = document.getElementById("message").value;


        // Проверка на пустые поля
        if (!name || !email || !phone || !message || !organization) {
            responseMessage.textContent = "Заполните все поля!";
            responseMessage.style.color = "red";
            return; // Прерываем отправку
        }


        try {
          const response = await fetch(
              `https://t.me/Artem2066Bot`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    chat_id: 5106244821, // Замените на ID чата админа
                    text: `Новая заявка:\nИмя: ${name} \nemail: ${email}\nТелефон: ${phone}\nСообщение: ${message} \nОрганизация: ${organization}`,
                  }),
                }
              );

            if (response.ok) {
                closePopup();
                clearFormData();
                alert("Форма успешно отправлена!");
            }else{
              throw new Error("Ошибка отправки сообщения в Telegram");
            }

        } catch (error) {
            responseMessage.textContent = error.message;
            responseMessage.style.color = "red";
        }
    });

    // Восстановление данных формы (после объявления обработчика submit)
     restoreFormData();
});
