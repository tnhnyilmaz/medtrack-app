![9](https://github.com/user-attachments/assets/76e64e10-4388-4e07-97b6-56bed2c23198)
# MedTrack  🏥

MedTrack, React Native ve Expo ile geliştirilmiş kapsamlı bir kişisel sağlık yönetimi uygulamasıdır. Kullanıcıların ilaçlarını, sağlık ölçümlerini takip etmelerine ve tıbbi rutinlerini aksatmamaları için önemli hatırlatıcılar kurmalarına yardımcı olur.

## 🌟 Temel Özellikler

- **İlaç Takibi:** İlaçlarınızı detaylı programlarla ekleyin ve yönetin.
- **Sağlık Ölçümleri:** Tansiyon, kan şekeri ve diğer hayati metrikleri kaydedin.
- **Hatırlatıcılar ve Bildirimler:** Dahili uyarılar sayesinde hiçbir dozu veya ölçümü kaçırmayın.
- **Görsel Analizler:** Sağlık verilerinizin trendlerini sezgisel grafiklerle görüntüleyin.
- **Yerel Depolama:** Verileriniz SQLite kullanılarak cihazınızda güvenli bir şekilde saklanır.
- **Çoklu Dil Desteği:** İngilizce ve Türkçe için tam yerelleştirme.

## 🛠 Teknoloji Yığını

- **Framework:** [React Native](https://reactnative.dev/) ve [Expo](https://expo.dev/)
- **Yönlendirme:** [Expo Router](https://docs.expo.dev/router/introduction/) (Dosya tabanlı)
- **Veritabanı:** [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Yerelleştirme:** [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
- **Grafikler:** [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts)
- **Tasarım:** React Native StyleSheet ve Linear Gradients ile özel bileşenler.

## Ekran Görüntüleri
![1](https://github.com/user-attachments/assets/065c6b0a-266a-4243-ac81-ce90eeaeadf3)
![2](https://github.com/user-attachments/assets/c236b965-22c5-498f-b0d3-4402e444aa9f)
![3](https://github.com/user-attachments/assets/2cd16ab9-c23a-42bd-b474-84fd285a5104)
![4](https://github.com/user-attachments/assets/530fabc2-0f02-4a03-b23d-595991024943)
![5](https://github.com/user-attachments/assets/f9cb5861-0618-4baf-a699-afdf55edc42b)
![6](https://github.com/user-attachments/assets/03e2f55d-a5a3-4845-b6b2-3b29288a7953)
![7](https://github.com/user-attachments/assets/da3b95f3-4fed-4342-b125-65fb38ad4651)
![8](https://github.com/user-attachments/assets/95785e5a-c3ad-4506-9efe-0e897bdf239b)
![9](https://github.com/user-attachments/assets/19578992-123a-400a-8ef5-e8310299bbbe)
![10](https://github.com/user-attachments/assets/8e7a41db-c5dc-4f36-8a35-f3e5db9135ae)


## 🚀 Başlarken

1.  **Depoyu kopyalayın:**

    ```bash
    git clone <repository-url>
    cd medtrack-app
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3.  **Uygulamayı başlatın:**
    ```bash
    npx expo start
    ```

---

## 📁 Project Structure / Proje Yapısı

```text
/app         - Route handlers & screens (Expo Router)
/assets      - Images, fonts, and static assets
/src
  /components - Reusable UI components
  /constants  - App constants and theme
  /contexts   - React contexts (Language, Theme, etc.)
  /database   - SQLite setup and queries
  /hooks      - Custom React hooks
  /i18n       - Localization files (EN/TR)
  /services   - Notification and external services
  /styles     - Global styles and theme tokens
```

---

## 📄 License / Lisans

This project is private. All rights reserved. / Bu proje özeldir. Tüm hakları saklıdır.
