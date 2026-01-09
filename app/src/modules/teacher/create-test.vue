<template>
    <div class="container">
        <nav>
        <div class="info">
            <h5 class="heading-h4">Екатерина Васильевна</h5>
            <span class="description-d1">Преподаватель</span>
        </div>
        <div class="menu">
            <div class="item">
            <span class="body-b2">Главная страница</span>
            </div>
            <div class="item">
            <a class="body-b2">Журнал</a>
            </div>
            <div class="item">
            <a class="body-b2">Конструктор теста</a>
            </div>
        </div>
        </nav>
        <div class="content">
            <div class="header">
                <h1>Создание теста</h1>
                <a href="">Посмотреть подсказку</a>
            </div>
            <div class="designer">
                <div class="question">
                    <h2>Вопрос 1</h2>
                    <div class="information">
                        <div class="description">
                            <UiInput placeholder="Найдите по ФИО" type="text" />
                            <a href="" class="add-text">+ Добавить фотографию</a>
                        </div>
                        <div class="add-answer">
                            <div class="answers">
                                <div class="answer">
                                    <div class="check">
                                        <input type="checkbox">
                                        <UiInput placeholder="Найдите по ФИО" type="text" />
                                    </div>
                                    <div class="delete"><img src="" alt=""></div>
                                </div>
                                <div class="answer">
                                    <div class="check">
                                        <input type="checkbox">
                                        <UiInput placeholder="Найдите по ФИО" type="text" />
                                    </div>
                                    <div class="delete"><img src="" alt=""></div>
                                </div>
                                <div class="answer">
                                    <div class="check">
                                        <input type="checkbox">
                                        <UiInput placeholder="Найдите по ФИО" type="text" />
                                    </div>
                                    <div class="delete"><img src="" alt=""></div>
                                </div>
                            </div>
                            <a href="" class="add-text">+ Добавить вариант ответа</a>
                        </div>

                    </div>
                </div>
                <UiButton>Добавить вопрос</UiButton>
            </div>
        </div>
        <div class="setting">
            <div class="setting-test">
                <div class="h-arrow">
                    <h3>Настройки теста</h3>
                    <img src="" alt="">
                </div>
                <div class="inputs">
                    <UiInput
                        label="Начало теста"
                        placeholder="Выбрать дату"
                        required
                        type="date"
                    />
                    <UiInput
                        label="Окончание теста"
                        placeholder="Выбрать дату"
                        required
                        type="date"
                    />
                    <UiInput
                        label="Время прохождения"
                        placeholder="Назначить время"
                        required
                        type="number"
                    />
                    <UiInput
                        label="Выбор групп"
                        placeholder="Выбрать группы"
                        required
                        type="text"
                    />
                </div>
            </div>
            <div class="info-text">
                <div class="h-arrow">
                    <h3>Информация теста</h3>
                    <img src="" alt="">
                </div>
                <div class="content-test">
                    <UiInput
                        label="Заголовок"
                        placeholder="Введите название"
                        required
                        type="text"
                    />
                    <UiInput
                        label="Описание"
                        placeholder="Введите описание теста"
                        required
                        type="text"
                    />
                </div>
            </div>
            <UiButton> Опубликовать тест </UiButton>
        </div>
    </div>
</template>