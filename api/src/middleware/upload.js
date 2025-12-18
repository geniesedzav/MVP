// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Убедимся, что папка для загрузок существует
// __dirname будет указывать на папку 'middleware'
// '..' переходит на уровень выше (в 'api')
// 'img' - папка для изображений
const uploadDir = path.join(__dirname, '..', 'public', 'img'); // Лучше в public/img
if (!fs.existsSync(uploadDir)) {
    // recursive: true создаст и 'public', если его нет
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Создана директория для загрузок: ${uploadDir}`);
} else {
     console.log(`Директория для загрузок уже существует: ${uploadDir}`);
}


// Настройка хранилища
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Папка для сохранения файлов
    },
    filename: function (req, file, cb) {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Фильтр файлов (принимаем только изображения)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Принять файл
    } else {
        // Отклонить файл, не передавая ошибку в контроллер,
        // но можно добавить сообщение в req для информирования
        req.fileValidationError = 'Разрешены только изображения!';
        cb(null, false);
    }
};

// Создаем middleware multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // Ограничение 10MB
    }
});

module.exports = upload; // Экспортируем настроенный multer
