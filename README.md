# Yeşil Miras 

Bu proje, Yeşil Miras uygulamasının servislerini içerir. Go ve typescript programlama dilleri kullanılarak geliştirilmiştir.

## Gereksinimler

- Go 1.22 veya üzeri
- PostgreSQL 15 veya üzeri
- Docker ve Docker Compose (opsiyonel)

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/talhabektas/yesil-miras.git
cd yesil-miras/yeşil-miras-backend
```

2. Bağımlılıkları yükleyin:
```bash
go mod download
```

3. `.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

4. Veritabanını oluşturun:
```bash
createdb yesil_miras
```

5. Uygulamayı çalıştırın:
```bash
go run cmd/main.go
```

## Docker ile Çalıştırma

1. Docker Compose ile tüm servisleri başlatın:
```bash
docker-compose up --build
```

2. Servisleri durdurun:
```bash
docker-compose down
```

## API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Projeler
- `POST /api/projects` - Yeni proje oluşturma
- `GET /api/projects` - Tüm projeleri listeleme
- `GET /api/projects/:id` - Belirli bir projeyi getirme

### Görevler
- `POST /api/tasks` - Yeni görev oluşturma
- `GET /api/projects/:projectId/tasks` - Projeye ait görevleri listeleme

### Yorumlar
- `POST /api/comments` - Yeni yorum oluşturma
- `GET /api/tasks/:taskId/comments` - Göreve ait yorumları listeleme

## Proje Yapısı

```
.
├── cmd/
│   └── main.go
├── internal/
│   ├── api/
│   │   ├── handlers.go
│   │   └── routes.go
│   ├── domain/
│   │   └── models.go
│   ├── repository/
│   │   └── repository.go
│   └── service/
│       └── service.go
├── pkg/
├── configs/
├── docs/
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
└── .env
```

## Geliştirme

1. Yeni bir branch oluşturun:
```bash
git checkout -b feature/your-feature-name
```

2. Değişikliklerinizi commit edin:
```bash
git commit -m "Add your feature"
```

3. Branch'inizi push edin:
```bash
git push origin feature/your-feature-name
```

4. Bir Pull Request oluşturun.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın. 
